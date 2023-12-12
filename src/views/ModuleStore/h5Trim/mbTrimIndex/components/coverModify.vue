<template>
    <el-dialog title="修改封面" custom-class="dialog-form" width="420px" :visible.sync="dialogImg.visible" destroy-on-close>
        <div>
            <el-form
                ref="myForm"
                :inline="false"
                :model="dialogImg.formData"
                :rules="dialogImg.formRule"
                label-position="right"
                label-width="95px"
                size="small"
            >
                <el-form-item label="图片" prop="bigImage">
                    <imgCenter v-model="dialogImg.formData.bigImage" @input="$refs.myForm.validateField('bigImage')"></imgCenter>
                    <span class="text-999 font ml-15" style="vertical-align: top">建议尺寸：365*282px</span>
                </el-form-item>
            </el-form>
        </div>

        <span slot="footer">
            <el-button size="small" @click="dialogImg.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    components: {},
    props: {
        chooseItem: {
            type: [String, Number]
        }
    },
    data() {
        return {
            dialogImg: {
                visible: false,
                formRule: {
                    bigImage: [{ required: true, message: '请上传图片', trigger: 'change' }]
                },
                formData: {
                    bigImage: ''
                }
            }
        }
    },
    watch: {
        'dialogImg.formData.bigImage': {
            handler(newValue, oldValue) {
                console.log('bigImage:', newValue)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 打开dialog
        dialogShow() {
            this.dialogImg.visible = true
        },
        // 关闭dialog
        dialogClose() {
            this.dialogImg.visible = false
            console.log('修改前的', this.dialogImg.formData.bigImage)
            this.dialogImg.formData.bigImage = ''
        },

        // 保存封面修改
        debounceSubmit() {
            if (this.dialogImg.formData.bigImage.length === 0) {
                this.$message.warning('请选择一张图片上传')
                return
            }
            this.$emit('modifyImg', this.dialogImg.formData.bigImage, this.chooseItem)
        }
    }
}
</script>
<style lang="scss" scoped></style>
