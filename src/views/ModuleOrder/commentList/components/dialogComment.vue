<template>
    <div>
        <el-dialog :title="commentType == 1 ? '审核初评' : '审核追评'" :visible.sync="isVisible" custom-class="dialog-form-small">
            <el-form ref="myForm" :model="formData" :rules="rule" label-width="98px" label-position="right" size="small">
                <el-form-item label="审核状态：" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="-1">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer font-0">
                <el-button size="small" @click.stop="isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :asyncFunction="() => debounceSubmit('myForm')">确 定</ls-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { commentList } from '@/api/ModuleOrder.js'
export default {
    props: {
        // 初评状态
        commentStatus: {
            type: [String, Number],
            default: ''
        },
        // 评论id
        commentId: {
            type: [String, Number],
            default: ''
        },
        // 追评id
        commentAddId: {
            type: [String, Number],
            default: ''
        },
        // 评论类型(初评/追评)
        commentType: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            formData: {
                status: 1
            },
            // 预验证
            rule: {
                status: [{ required: true, message: '请选择状态', trigger: 'change' }]
            }
        }
    },
    watch: {
        commentStatus(val) {
            if (val == 0) return
            this.formData.status = val
        }
    },
    methods: {
        showDialog() {
            this.isVisible = true
        },
        // 保存
        debounceSubmit(form) {
            return new Promise((resolve) => {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 回复初评
                        if (this.commentType == 1) {
                            commentList.postComment({ id: this.commentId, status: Number(this.formData.status) }).then((res) => {
                                if (res.code == 1) {
                                    this.$message.success('操作成功')
                                    this.isVisible = false
                                    this.$emit('getData')
                                }
                            }).finally(()=>{
                                return resolve()
                            })
                        } else if (this.commentType == 2) {
                            // 回复追评
                            commentList.postReplyComment({ addId: this.commentAddId, status: Number(this.formData.status) }).then((res) => {
                                if (res.code == 1) {
                                    this.$message.success('操作成功')
                                    this.isVisible = false
                                    this.$emit('getData')
                                }
                            }).finally(()=>{
                                return resolve()
                            })
                        }
                    } else {
                        return resolve()
                    }
                })
            })
        }
    }
    // 保存
}
</script>

<style></style>
