<!--
	UI后的新页面
-->
<template>
    <div class="login-wrapper">
        <div class="login-container bg-fff border-box p-30 overflow-h rounded-10">
            <div v-loading="!systemConfigFinally" class="w-200p h-60p">
                <!-- 用ls-image的话，fit: contain;时宽度不对 -->
                <!-- <ls-image :src="systemConfigTemp.adminBigLogo" :options="{ w: '400', h: '95'}" :isPreview="false" v-if="systemConfigTemp&&systemConfigTemp.adminBigLogo" /> -->
                <img
                    v-if="systemConfigTemp && systemConfigTemp.adminBigLogo"
                    :src="$photoServer + systemConfigTemp.adminBigLogo"
                    style="object-fit: contain"
                    class="w-100 h-100"
                    :onerror="$defaultImg"
                />
                <img v-else-if="systemConfigFinally" class="w-100 h-100" src="@/assets/images/login__logo.png" alt="" />
                <div v-else class="w-100 h-100"></div>
            </div>
            <div class="mt-10 flex-between login-main">
                <div class="login-bgAside h-100"></div>
                <div class="form-wrapper border-box flex-1 ml-10 p-20 h-100">
                    <p class="font-28 h-40p" style="color: #222; font-weight: 600; line-height: 40px">后台管理系统</p>
                    <p class="mt-5 text-999 font-16" style="line-height: 22px">欢迎登录~</p>
                    <el-form
                        ref="loginForm"
                        size="small"
                        :model="loginForm"
                        :rules="loginRules"
                        class="login-form mt-30"
                        auto-complete="on"
                        label-position="left"
                    >
                        <el-form-item prop="principal" style="margin-bottom: 20px">
                            <el-input
                                ref="username"
                                v-model="loginForm.principal"
                                placeholder="请输入用户名"
                                name="username"
                                type="text"
                                tabindex="1"
                                autocomplete="on"
                                size="large"
                            >
                                <i slot="prefix" class="el-input__icon iconfont icon-user text-333"></i>
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="credentials" style="margin-bottom: 50px">
                            <el-input
                                :key="passwordType"
                                ref="password"
                                v-model="loginForm.credentials"
                                :type="passwordType"
                                placeholder="请输入密码"
                                name="password"
                                tabindex="2"
                                autocomplete="on"
                                size="large"
                                maxlength="16"
                                @keyup.enter.native="handleLogin"
                            >
                                <i slot="prefix" class="el-input__icon iconfont icon-password text-333"></i>
                                <i
                                    slot="suffix"
                                    class="el-input__icon iconfont cursor-pointer"
                                    :class="[passwordType === 'password' ? 'icon-password-hidden' : 'icon-password-shows']"
                                    @click="showPwd"
                                ></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 0">
                            <el-button
                                :disabled="disabled"
                                :loading="loading"
                                type="primary"
                                class="w-100"
                                size="large"
                                style="height: 45px"
                                @click.native.prevent="handleLogin"
                            >
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <verifition
                        ref="verify"
                        mode="pop"
                        captcha-type="blockPuzzle"
                        :img-size="{ width: '330px', height: '155px' }"
                        @success="verifySuccess"
                    />
                </div>
            </div>
        </div>
        <footer
            v-if="systemConfigTemp"
            class="font-14 position-absolute text-999"
            style="left: 50%; bottom: 40px; transform: translateX(-50%); height: 20px; line-height: 20px"
        >
            Copyright © {{ systemConfigTemp && systemConfigTemp.domainName ? systemConfigTemp.domainName : '朗尊电商' }}版权所有
            {{ systemConfigTemp && systemConfigTemp.icpInfo ? systemConfigTemp.icpInfo : '' }}
        </footer>
    </div>
</template>

<script>
import Verifition from '@/components/Verifition/Verify'
import encryption from '@/utils/encryption.js'
export default {
    name: 'Login2',
    components: {
        Verifition
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            callback()
        }
        const validatePassword = (rule, value, callback) => {
            if (this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback()
            } else {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            }
        }
        return {
            loginForm: {
                principal: '',
                credentials: '',
                auth_type: 'PASSWORD'
            },
            loginRules: {
                principal: [{ required: true, trigger: 'blur', validator: validateUsername }],
                credentials: [{ required: true, trigger: ['change', 'blur'], validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            systemConfigTemp: null, // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
            systemConfigFinally: false
        }
    },
    computed: {
        disabled() {
            return !(this.loginForm.principal && this.loginForm.credentials)
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {
        let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
        // 如果main.js里面执行了方法获取到系统设置
        if (systemConfig && systemConfig.id) {
            this.systemConfigTemp = systemConfig
            this.systemConfigFinally = true
            // 如果VUEX里没有设置systemConfig(系统设置)
        } else {
            this.$store
                .dispatch('user/getSystemConfig')
                .then((res) => {
                    this.systemConfigTemp = res
                    console.log('systemConfig:', this.systemConfigTemp)
                })
                .catch(() => {})
                .finally(() => {
                    this.systemConfigFinally = true
                })
        }
    },
    methods: {
        verifySuccess(params) {
            this.loading = true
            const sumbitForm = Object.assign(this.loginForm)
            this.$store
                .dispatch('user/login', {
                    userInfo: {
                        ...sumbitForm,
                        principal: encryption(sumbitForm.principal),
                        credentials: encryption(sumbitForm.credentials)
                    },
                    code: params.captchaVerification //二次校验参数
                })
                .then(() => {
                    // console.log(111,this.redirect);
                    this.$router.push({ path: this.redirect || '/' })
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
            // console.log(params) // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        useVerify() {
            this.$refs.verify.show()
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.useVerify()
                } else {
                    // console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$bg: #f5f7fa;

.login-wrapper {
    min-height: 768px; //防止底部往上挪
    height: 100%;
    width: 100%;
    // background-color: $bg;
    overflow: hidden;
    background-image: url('~@/assets/images/login__bg2.png');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-container {
        width: 710px;
        height: 492px;
        max-width: 100%;
        box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.04);
        .login-main {
            height: 332px;
            .login-bgAside {
                width: 300px;
                background-image: url('~@/assets/images/login__aside.png');
                background-size: cover;
                background-position: center;
            }
            .form-wrapper {
                .el-input {
                    ::v-deep .el-input__inner {
                        // padding-left: 45px;
                        padding: 0 45px;
                        // 以下两个分开设    要先设置selected后设置previewed
                        &:-internal-autofill-selected {
                            box-shadow: inset 0 0 0 1000px #fff !important; // 自动填充完毕后改变了背景色
                            transition: box-shadow 0.3s ease;
                        }

                        &:-internal-autofill-previewed {
                            box-shadow: inset 0 0 0 1000px #e8f0fe !important; // 自动填充预览时改变了背景色
                        }
                    }
                    ::v-deep .el-input__prefix {
                        left: 20px;
                    }
                    ::v-deep .el-input__suffix {
                        right: 20px;
                    }
                }
            }
        }
    }
}
</style>
