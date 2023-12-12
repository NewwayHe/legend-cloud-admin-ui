<template>
    <!-- /*
 * @Descripttion:新增轮播图(拼团广告或秒杀广告)组件
*/ -->
    <!-- 调整数量 -->
    <el-dialog title="新增轮播图" custom-class="dialog-form" width="420px" :visible.sync="ruleForm.isVisible">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="图片链接地址" prop="url">
                <el-input v-model="ruleForm.url" placeholder="请输入图片链接地址" maxlength="100" />
            </el-form-item>
            <el-form-item label="顺序" prop="num">
                <el-input
                    v-model="ruleForm.num"
                    placeholder="请输入"
                    type="number"
                    maxlength="4"
                    oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"
                />
            </el-form-item>
            <el-form-item label="上传图片" prop="img">
                <imgCenter v-model="ruleForm.img" mult></imgCenter>
                <!-- <el-input v-model="ruleForm.num" placeholder="请输入" type="number" maxlength="4" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}" /> -->
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
    components: { },
    mixins: [],
    props: {},
    data() {
        return {
            ruleForm: {
                url: '',
                num: '',
                img: '',
                isVisible: false
            },
            rules: {
                url: [{ required: true, message: '请输入图片链接地址', trigger: 'blur' }],
                num: [{ required: true, message: '请输入顺序', trigger: 'blur' }],
                img: [{ required: true, message: '请选择图片', trigger: 'blur' }]
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
