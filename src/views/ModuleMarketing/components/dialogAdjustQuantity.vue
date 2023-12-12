<template>
    <!-- /*
 * @Descripttion:调整数量弹框组件
*/ -->
    <!-- 调整数量 -->
    <el-dialog title="调整数量" custom-class="dialog-form" width="420px" :visible.sync="ruleForm.isVisible">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="增加成团数量" prop="num">
                <el-input
                    v-model="ruleForm.num"
                    placeholder="请输入数量"
                    type="number"
                    maxlength="11"
                    oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"
                />
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="ruleForm.isVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    components: {},
    mixins: [],
    props: {},
    data() {
        return {
            ruleForm: {
                num: '',
                isVisible: false
            },
            rules: {
                num: [{ required: true, message: '请输入数量', trigger: 'blur' }]
            }
        }
    },
    computed: {},
    watch: {},
    created() {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!')
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        showDialog() {
            this.ruleForm.isVisible = true
        }
    }
}
</script>

<style lang="scss" scoped></style>
