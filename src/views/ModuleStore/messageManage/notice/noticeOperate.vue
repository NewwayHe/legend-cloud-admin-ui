<!-- /*
 * @Descripttion: 公告管理 - 新增/编辑
*/ -->
<template>
    <section class="formWarp mb-20">
        <el-card v-loading="lodaing">
            <h3 class="form-title">{{ $route.meta.title }}</h3>
            <el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small">
                <el-form-item label="标题：" prop="title">
                    <el-input
                        v-model="form.title"
                        type="textarea"
                        placeholder="标题"
                        resize="none"
                        class="w-450p"
                        :autosize="true"
                        :maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="公告类型：" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" clearable class="w-450p">
                        <el-option label="买家公告" :value="0" />
                        <el-option label="卖家公告" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="公告状态：" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效时间：">
                    <el-date-picker
                        v-model="form.startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间"
                        :picker-options="selectTimeOpt"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间：">
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        default-time="23:59:59"
                        :picker-options="selectTimeOpt"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="内容：" prop="content" class="btn_lastItem">
                    <!-- 不加v-if，编辑一个后，再编辑另一个时，页面上不渲染内容 -->
                    <TinyMce v-if="!lodaing" v-model="form.content" />
                </el-form-item>
                <el-form-item class="btnArea">
                    <el-button @click="onCancel">取消</el-button>
                    <ls-button type="primary" :async-function="dbnSubmit">保存</ls-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script>
import TinyMce from '@/components/TinyMceNew'
import { specifications } from '@/api/ModuleGoods'
import { notice } from '@/api/ModuleStore'
import { debounce } from '@/utils/utils'
export default {
    components: { TinyMce },
    data() {
        return {
            form: {
                id: '',
                title: '',
                type: 1,
                status: 1,
                content: '',
                startTime: '',
                endTime: ''
            },
            rules: {
                title: [{ required: true, message: '请输入标题名称', trigger: 'blur' }],
                type: [{ required: true, message: '请输入公告类型', trigger: 'blur' }],
                content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
            },
            isEdit: false,
            lodaing: true
        }
    },
    // name: 'noticeOperate',
    computed: {
        // 有效时间的可选范围为 [当天及之后]
        selectTimeOpt() {
            return {
                disabledDate: (cur) => {
                    return cur.getTime() < Date.now() - 8.64e7
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        if (to.query.type == 'edit') {
            to.meta.title = '编辑公告' //更改tab页同步标题
        } else {
            to.meta.title = '新增公告' //更改tab页同步标题
        }
        next()
    },
    mounted() {
        if (this.$route.query.type == 'edit') {
            this.isEdit = true
            this.getDetail()
        } else {
            this.isEdit = false
            this.lodaing = false
        }
    },
    methods: {
        // 获取详情(编辑时调用)
        getDetail() {
            this.lodaing = true
            notice
                .detail(this.$route.query.id)
                .then((res) => {
                    this.form = Object.assign({}, this.form, res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    this.lodaing = false
                })
        },

        // 提交
        dbnSubmit() {
            return new Promise(async (resolve) => {
                await this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (this.isEdit) {
                            console.log('before API')
                            await this.edit()
                            console.log('After API')
                            resolve()
                        } else {
                            await this.add()
                            resolve()
                        }
                    } else {
                        return resolve()
                    }
                })
            })
        },
        // 新增
        add() {
            return new Promise(async (resolve, reject) => {
                if (this.form.startTime && this.form.endTime && new Date(this.form.startTime) >= new Date(this.form.endTime)) {
                    return this.$message.error('生效时间必须早于失效时间')
                }
                notice
                    .add(this.form)
                    .then((res) => {
                        if (res.code) {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            console.log('before Redirect')
                            this.$router.push({ path: '/ModuleStore/messageManage/notice' })
                            console.log('After Redirect')
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
                    .finally((res) => {
                        resolve()
                    })
            })
        },

        // 编辑
        edit() {
            return new Promise(async (resolve, reject) => {
                if (this.form.startTime && this.form.endTime && new Date(this.form.startTime) >= new Date(this.form.endTime)) {
                    return this.$message.error('生效时间必须早于失效时间')
                }
                notice
                    .edit(this.form)
                    .then((res) => {
                        if (res.code) {
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            this.$router.push({ path: '/ModuleStore/messageManage/notice' })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
                    .finally((res) => {
                        resolve()
                    })
            })
        },
        // 取消
        onCancel() {
            this.$router.push({ path: '/ModuleStore/messageManage/notice' })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-textarea {
    > .el-textarea__inner {
        overflow: hidden;
        word-break: break-all;
    }
    .el-input__count {
        line-height: 1;
    }
}
</style>
