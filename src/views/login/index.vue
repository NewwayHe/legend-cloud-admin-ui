<!--
	这个是UI前的登录页
-->
<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            size="small"
            :model="loginForm"
            :rules="loginRules"
            class="login-form rounded-10"
            auto-complete="on"
            label-position="left"
        >
            <div v-loading="!systemConfigFinally" class="w-100 flex-center mb-40">
                <!-- 用ls-image的话，fit: contain;时宽度不对 -->
                <!-- <ls-image :src="systemConfigTemp.adminBigLogo" :options="{ w: '400', h: '95'}" :isPreview="false" v-if="systemConfigTemp&&systemConfigTemp.adminBigLogo" /> -->
                <img
                    v-if="systemConfigTemp && systemConfigTemp.adminBigLogo"
                    :src="$photoServer + systemConfigTemp.adminBigLogo"
                    style="height: 95px; object-fit: contain; max-width: 400px"
                    :onerror="$defaultImg"
                />
                <img v-else-if="systemConfigFinally" style="width: 400px; height: 95px" src="@/assets/images/login__logo.png" alt="" />
                <div v-else style="width: 400px; height: 95px"></div>
            </div>

            <el-form-item prop="principal">
                <span class="svg-container"><svg-icon icon-class="user" /></span>
                <el-input
                    ref="username"
                    v-model="loginForm.principal"
                    placeholder="账号"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                />
            </el-form-item>

            <el-form-item prop="credentials">
                <span class="svg-container"><svg-icon icon-class="password" /></span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.credentials"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /></span>
            </el-form-item>
            <el-button :disabled="disabled" :loading="loading" type="primary" class="w-100 mb-30" @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
        <verifition ref="verify" mode="pop" captcha-type="blockPuzzle" :img-size="{ width: '330px', height: '155px' }" @success="verifySuccess" />
    </div>
</template>
<script>
import Verifition from '@/components/Verifition/Verify'
import encryption from '@/utils/encryption.js'
export default {
    name: 'Login',
    components: {
        Verifition
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            callback()
        }
        const validatePassword = (rule, value, callback) => {
            callback()
        }
        return {
            loginForm: {
                principal: '',
                credentials: '',
                auth_type: 'PASSWORD'
            },
            loginRules: {
                principal: [{ required: true, trigger: 'blur', validator: validateUsername }],
                credentials: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            systemConfigTemp: '', // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
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
    mounted() {},
    methods: {
        verifySuccess(params) {
            this.loading = true
            const sumbitForm = Object.assign(this.loginForm)
            this.$store
                .dispatch('user/login', {
                    ...sumbitForm,
                    principal: encryption(sumbitForm.principal),
                    credentials: encryption(sumbitForm.credentials)
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
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container {
        ::v-deep .el-input input {
            color: $cursor;
        }
    }
}

/* reset element-ui css */
.login-container {
    ::v-deep .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #000;
            height: 47px;
            caret-color: #000;
            cursor: pointer;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(0, 0, 0, 0.1);
        // background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #eef2f6;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    background-image: url('~@/assets/images/login__bg.png');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-form {
        background-color: #fff;
        width: 500px;
        height: 485px;
        display: block;
        max-width: 100%;
        padding: 50px;
        margin: 0 auto;
        overflow: hidden;
        box-sizing: border-box;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: #dcdce4;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
