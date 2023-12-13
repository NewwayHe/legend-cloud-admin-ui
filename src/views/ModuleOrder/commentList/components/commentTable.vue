<template>
    <div class="customTable__warp">
        <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" row-key="id">
            <template slot="empty">
                <empty empty-type="pro" />
            </template>
            <el-table-column prop="pic" label="订单编号" width="350" />
            <el-table-column prop="pic" label="商品主图" width="350">
                <ls-image
                    style="flex: 0 0 50px"
                    src="http://192.168.0.13:9000/dev6.0/2020/08/11/39991d2193034667b850b73455665392.jpg"
                    :options="{ w: '50', h: '50', br: '6' }"
                />
            </el-table-column>
            <el-table-column label="商品名称" width="350">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary">
                        <el-popover placement="top-start" width="500" trigger="hover" :content="scope.row.content">
                            <div slot="reference" class="text-two">
                                {{ scope.row.content }}
                            </div>
                        </el-popover>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="商品规格" width="350">
                <template slot-scope="scope">
                    <div>{{ scope.row.content }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="pic" label="购买用户" width="350" />
            <el-table-column prop="pic" label="购买日期" width="350" />
            <el-table-column prop="pic" label="商家" width="350" />
        </el-table>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        tableList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            checkList: [], // 选中的item
            customCheck: false, // 全选状态
            cancelDialog: false, // 取消dialog
            orderDialog: false, // 调整订单
            deliverDialog: false, // 确认发货
            form: {
                type: '',
                reason: '',
                remark: '',
                money: '',
                company: '',
                number: ''
            }
        }
    },
    watch: {
        // 监听选中的数组，如果选中的数组长度等于当前分页的数量，则会全选
        checkList(val) {
            if (this.checkList.length === this.tableList.length) {
                this.customCheck = true
            } else {
                this.customCheck = false
            }
            this.$emit('selecteItem', this.customCheck, this.checkList)
        }
    },
    mounted() {
        console.log('tableList......', this.tableList)
    },
    methods: {
        // 父组件点击全选
        selectedAllOrNot() {
            if (this.checkList.length === this.tableList.length) {
                this.checkList = []
            } else {
                this.checkList = this.tableList.map((item) => item.id)
            }
        },

        // 取消订单
        showDialog(item, type) {
            this.form.type = type
            this.cancelDialog = true
        },

        // 跳转详情页
        toDetail(item) {
            this.$emit('toDetail', item)
        },

        // 父组件批量取消订单
        batchShowDialog(type) {
            if (this.checkList.length < 1) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.form.type = type
            this.cancelDialog = true
        }
    }
}
</script>
