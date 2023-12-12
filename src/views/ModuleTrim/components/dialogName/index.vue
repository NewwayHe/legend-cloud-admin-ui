<template>
    <!-- /*
   * @Descripttion:编辑/新增/复制-首页名称组件
  */ -->
    <!-- 输入首页名称 -->
    <el-dialog
        :title="title ? title : `请输入${field}`"
        custom-class="dialog-form"
        width="420px"
        append-to-body
        :visible.sync="ruleForm.isVisible"
        :close-on-click-modal="false"
    >
        <el-form ref="ruleForm" :model="ruleForm" @submit.native.prevent>
            <el-form-item class="flex-start" :label="`${field}：`" prop="name" :rules="{ required: true, message: `${field}不能为空` }">
                <el-input v-model="ruleForm.name" placeholder="请输入" size="small" clearable maxlength="10" show-word-limit />
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="ruleForm.isVisible = false">取 消</el-button>
            <el-button v-ls-loading type="primary" size="small" @click="submitForm('ruleForm')">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    components: {},
    props: {
        value: {
            type: String,
            default: ''
        },
        field: {
            type: String,
            default: '首页名称'
        },
        title: [String, Number]
    },
    data() {
        return {
            ruleForm: {
                name: '',
                isVisible: false
            },
            api: false //判断是点击“保存”(这时点击“确定”后会请求save接口)按钮还是点击“页面名称”(这时点击“确定”后不会请求save接口)进来
        }
    },
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.ruleForm.name = newValue
                } else {
                    this.ruleForm.name = ''
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.isVisible = false
                    this.$emit('input', this.ruleForm.name, this.api)
                    if (this.api) {
                        this.$emit('validatePassed', this.api)
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        showDialog(api) {
            this.api = api
            this.ruleForm.isVisible = true
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__content {
    flex: 1;
}
</style>
