<template>
    <el-dialog title="审核" custom-class="dialog-form-small" :visible.sync="isVisible" @close="handleClose">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px" size="small">
            <el-form-item label="审核结果：" prop="status">
                <el-radio-group v-model="ruleForm.status">
                    <el-radio label="1">通过</el-radio>
                    <el-radio label="-1">拒绝</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="审核意见："
                prop="content"
                :rules="{
                    required: ruleForm.status == '1' ? false : true,
                    message: '请填写审核意见(50字条以内)',
                    trigger: 'blur'
                }"
            >
                <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入" maxlength="50" show-word-limit autosize />
            </el-form-item>
        </el-form>
        <div slot="footer" class="font-0">
            <el-button size="small" @click="isVisible = false">取 消</el-button>
            <ls-button type="primary" size="small" :async-function="submitForm">确 定</ls-button>
        </div>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    name: 'DialogAudit',
    props: {
        url: {
            type: String,
            required: true
        },
        id: {
            required: true
        },
        userParams: {
            type: Object,
            default() {
                return {
                    ids: 'ids',
                    status: 'status',
                    content: 'auditOpinion'
                }
            }
        }
    },
    data() {
        return {
            isVisible: false,
            rules: {
                status: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
            },
            ruleForm: {
                status: '1',
                content: ''
            }
        }
    },
    methods: {
        showDialog() {
            this.isVisible = true
        },
        // 点击模板时初始化数据
        handleClose() {
            this.$refs.ruleForm.resetFields()
            this.isVisible = false
        },

        submitForm() {
            return new Promise((resolve) => {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        request
                            .put(this.url, {
                                [this.userParams['ids']]: this.id,
                                [this.userParams['status']]: Number(this.ruleForm.status),
                                [this.userParams['content']]: this.ruleForm.content
                            })
                            .then((res) => {
                                if (res.code) {
                                    this.$message.success('操作成功')
                                    this.isVisible = false
                                    this.$emit('finish')
                                }
                            })
                            .catch((err) => {
                                this.$message.error(err.msg)
                            })
                            .finally((_) => {
                                return resolve()
                            })
                    } else {
                        return resolve()
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
// 当input框启用show-word-limit时,防止.el-form-item__content元素的 line-height: 40px;对.el-input__count元素的line-height进行样式污染
::v-deep .el-textarea {
    .el-input__count {
        line-height: normal !important;
    }
}
</style>
