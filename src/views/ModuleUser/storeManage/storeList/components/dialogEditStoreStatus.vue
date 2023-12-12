<template>
    <div>
        <el-dialog title="店铺审核开关" custom-class="dialog-form-small" :visible.sync="isVisible" :before-close="handleClose" destroy-on-close>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px" size="small">
                <el-form-item label="审核：" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="0">不需要审核</el-radio>
                        <el-radio :label="1">需要审核</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :asyncFunction="submitForm">确 定</ls-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { storeManage } from '@/api/ModuleUser.js'
export default {
    props: {
        id: {
            type: String | Number,
            default: ''
        },
        prodRequireAudit: {
            type: String | Number,
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            rules: {
                status: [{ required: true, message: '请选择类型', trigger: 'change' }]
            },
            ruleForm: {
                status: ''
            }
        }
    },
    watch: {
        prodRequireAudit(val) {
            this.ruleForm.status = val
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
        // 提交
        submitForm() {
            return new Promise(resolve=>{
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.ruleForm.id = this.id
                        storeManage
                            .editStoreStatus(this.ruleForm)
                            .then((res) => {
                                if (res.code) {
                                    this.$message.success('操作成功')
                                    this.isVisible = false
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.$message.error(err.msg)
                            }).finally(_=>{
                                resolve()
                            })
                    } else {
                        console.log('error submit!!')
                        resolve()
                        return false
                    }
                })
            })
            
        }
    }
}
</script>

<style></style>
