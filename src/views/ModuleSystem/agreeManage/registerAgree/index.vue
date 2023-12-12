<!-- /*
 * @Descripttion:注册协议
*/ -->
<template>
    <section>
        <el-form ref="myForm" label-position="right">
            <el-form-item prop="productNo">
                <el-input v-model="agreeData" type="textarea" :rows="20" placeholder="请输入注册协议" />
            </el-form-item>
            <el-form-item prop="createUserCode">
                <el-button size="small">取 消</el-button>
                <el-button size="small" type="primary">确 定</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
export default {
    components: {},

    data() {
        return {
            agreeData: ''
        }
    },
    mounted() {},
    methods: {}
}
</script>
