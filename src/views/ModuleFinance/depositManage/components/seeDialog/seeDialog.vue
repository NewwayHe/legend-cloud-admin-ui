<template>
    <el-dialog title="查看" :visible.sync="visible" width="25%" @close="changeDialog">
        <ul>
            <li>{{ info.mode + '流水号：' + info.serialNo }}</li>
            <li>{{ '用户名：' + info.nickName }}</li>
            <li>{{ info.mode + '金额：' + $options.filters.priceFilter(info.amount) }}</li>
            <li v-if="info.mode == '充值'">{{ '创建时间：' + info.createTime }}</li>
            <li>{{ '支付时间：' + info.updateTime }}</li>
            <li>{{ '收款银行：' + info.bank }}</li>
            <li>{{ '收款账号：' + info.banUser }}</li>
            <li>{{ '开户人姓名：' + info.openUser }}</li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="changeDialog()">取 消</el-button>
            <el-button v-if="info.mode == '提现'" type="primary" size="small" @click="changeDialog">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: ['showDialogVisible', 'info'],
    data() {
        return {
            visible: this.showDialogVisible
        }
    },
    watch: {
        // 解决props报错方法之一
        showDialogVisible(newVal) {
            this.visible = newVal
        }
    },
    created() {
        console.log(this.$options)
    },
    methods: {
        // 当对话框关闭的时候 || 点击了取消或者确定时触发，传递给父组件，让父组件修改showDialogVisible为false
        changeDialog() {
            this.$emit('changeDialog')
        }
    }
}
</script>

<style lang="scss" scoped>
ul {
    margin: 0;
    margin-top: -20px;
    padding: 0;
    list-style: none;
    li {
        line-height: 40px;
    }
}
</style>
