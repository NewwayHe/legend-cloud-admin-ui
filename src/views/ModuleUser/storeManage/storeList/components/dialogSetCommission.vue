<template>
    <div>
        <el-dialog title="设置分佣比例" custom-class="dialog-form-small" :visible.sync="isVisible" @close="handleClose" destroy-on-close>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px" size='small' @submit.native.prevent @keyup.enter.native="()=>{}">
                <el-form-item label="分佣比例：" prop="commissionRate">
					<lsInput class="w-200p" v-model.number="ruleForm.commissionRate" :precision="2" :min="0" :max="100">
						<template slot="append">%</template>
					</lsInput>
					<el-tooltip class="item" placement="right" content="平台佣金比例范围为：0-100，保留两位小数">
					    <i class="el-icon-question text-ccc font-16 ml-5"></i>
					</el-tooltip>
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
    name: 'DialogAudit',
    props: {
        id: {
            type: String | Number,
            default: ''
        },
        commissionRate: {
            type: String | Number,
            default: undefined
        }
    },
    data() {
        return {
            isVisible: false,
            rules: {
                commissionRate: [{ required: true, message: '分佣比例不能为空', trigger: 'blur' }]
            },
            ruleForm: {
                commissionRate: undefined
            }
        }
    },
    watch: {
        commissionRate(val) {
            this.ruleForm.commissionRate = val
        }
    },
    methods: {
        showDialog() {
            this.isVisible = true
        },

        // 点击模板时初始化数据
        handleClose() {
            this.isVisible = false
        },
        // 提交
        submitForm() {
            return new Promise(resolve=>{
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.ruleForm.id = this.id
                        storeManage
                            .editStorePrice(this.ruleForm)
                            .then((res) => {
                                if (res.code) {
                                    this.isVisible = false
                                    this.$message.success('操作成功')
                                    this.$parent.getData()
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
