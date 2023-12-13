<template>
    <div>
        <el-dialog title="设置店铺分类" custom-class="dialog-form-small" :visible.sync="isVisible" :before-close="handleClose" destroy-on-close>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px" size="small">
                <el-form-item label="店铺类型：" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择" clearable>
                        <el-option label="专营店" :value="0" />
                        <el-option label="旗舰店" :value="1" />
                        <el-option label="自营店" :value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :async-function="submitForm">确 定</ls-button>
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
        shopType: {
            type: String | Number,
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            rules: {
                type: [{ required: true, message: '请选择店铺类型', trigger: 'change' }]
            },
            ruleForm: {
                type: ''
            }
        }
    },
    watch: {
        shopType(val) {
            this.ruleForm.type = val
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
            return new Promise((resolve) => {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.ruleForm.id = this.id
                        storeManage
                            .editStoreType(this.ruleForm)
                            .then((res) => {
                                if (res.code) {
                                    this.$message.success('操作成功')
                                    this.isVisible = false
                                    this.$parent.getData()
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.$message.error(err.msg)
                            })
                            .finally((_) => {
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
