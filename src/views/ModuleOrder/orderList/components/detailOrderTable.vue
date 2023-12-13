<template>
    <div class="customTable__warp table">
        <el-table
            ref="multipleTable"
            :data="tableList"
            :span-method="orderInfo.orderType == 'P' ? preSellSpanMethod : normalSpanMethod"
            tooltip-effect="dark"
            class="w-100"
            :row-class-name="showAllHoverStyle ? 'hoverStyle' : ''"
            header-row-class-name="headerRow"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
        >
            <el-table-column prop="pic" label="商品" width="300">
                <template slot-scope="scope">
                    <div class="d-flex a-center line-h-md">
                        <ls-image style="flex: 0 0 60px" :src="scope.row.pic" :options="{ w: '60', h: '60', br: '4' }" />
                        <div class="ml-10 flex-col-between">
                            <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.productName">
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    target="_blank"
                                    :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                >
                                    {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
                                </el-link>
                                <el-link
                                    slot="reference"
                                    class="font-0"
                                    :underline="false"
                                    type="primary"
                                    target="_blank"
                                    :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                >
                                    <span class="text-two text-left font-12">{{ scope.row.productName }}</span>
                                </el-link>
                            </el-popover>
                            <div v-if="scope.row.attribute" class="text-left text-999 mt-10">
                                <span>{{ scope.row.attribute }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="单价">
                <template slot-scope="scope">
                    <div>{{ scope.row.price | priceFilter }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="basketCount" label="数量">
                <template slot-scope="scope">
                    {{ scope.row.basketCount || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" :class-name="showMergeHoverStyle ? 'hoverStyle' : ''">
                <template>
                    {{ orderType[orderInfo.orderType] }}
                </template>
            </el-table-column>
            <el-table-column prop="userInfo" label="用户信息" width="200px" :class-name="showMergeHoverStyle ? 'hoverStyle' : ''">
                <template>
                    <el-link
                        class="text-blue font-12"
                        type="primary"
                        :underline="false"
                        @click="$router.push({ name: 'userInfo', query: { userId: orderInfo.userId } })"
                    >
                        {{ orderInfo.nickName }}
                    </el-link>
                    <p>{{ orderInfo.receiver }}</p>
                    <p>{{ orderInfo.mobile }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="实付款" width="160" :class-name="showMergeHoverStyle ? 'hoverStyle' : ''">
                <template slot-scope="scope">
                    <div>
                        <span>{{ orderInfo.actualTotalPrice | priceFilter }}</span>
                        <br />
                        <span>(含运费：{{ orderInfo.freightPrice | priceFilter }})</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shopInfo" label="店铺信息" width="140" :class-name="showMergeHoverStyle ? 'hoverStyle' : ''">
                <template slot-scope="scoped">
                    <el-popover placement="top" width="450" trigger="hover" :title="orderInfo.shopName">
                        <el-link
                            type="primary"
                            target="_blank"
                            :underline="false"
                            :href="$shareRedirectUrl + '?detailsType=shop&shopId=' + orderInfo.shopId"
                        >
                            {{ $shareRedirectUrl + '?detailsType=shop&shopId=' + orderInfo.shopId }}
                        </el-link>
                        <el-link
                            slot="reference"
                            :underline="false"
                            class="line-clamp2 font-12"
                            type="primary"
                            target="_blank"
                            :href="$shareRedirectUrl + '?detailsType=shop&shopId=' + orderInfo.shopId"
                        >
                            {{ orderInfo.shopName }}
                        </el-link>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="交易状态" :class-name="showMergeHoverStyle ? 'hoverStyle' : ''">
                <template slot-scope="scope">
                    <span v-if="!scope.row.title" :class="'1,5,10'.includes(orderInfo.status) ? 'status-wait' : 'status-done'">
                        {{ orderInfo.status | getOrderStatus(orderInfo.orderType) }}
                    </span>
                    <div v-else>
                        <span v-if="orderInfo.preSellOrderBO.depositPayTime && scope.$index === 1">已支付</span>
                        <span
                            v-else-if="
                                scope.row.title === '阶段3，发货' ||
                                (orderInfo.preSellOrderBO && orderInfo.preSellOrderBO.payPctType === 0 && orderInfo.status !== -5)
                            "
                        ></span>
                        <span v-else :class="{ 'status-wait': !(orderInfo.preSellOrderBO.payFinalTime || orderInfo.status == -5) }">
                            {{ orderInfo.preSellOrderBO.payFinalTime ? '已支付' : orderInfo.status == -5 ? '已取消' : '待支付' }}
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="售后状态" width="100">
                <template slot-scope="scope">
                    <span :class="afterStatus(scope.row) ? 'status-wait' : 'status-done'">{{ scope.row | refundStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="交易操作" column-key="actionCol" width="140">
                <template slot-scope="scope">
                    <span class="table__action" style="justify-content: center">
                        <el-link v-if="orderInfo.refundStatus != '0'" :underline="false" type="primary" @click="checkAfterSell(scope.row)">
                            查看售后
                        </el-link>
                    </span>
                    <span class="table__action" style="justify-content: center">
                        <el-link :underline="false" type="primary" @click="toPrintOrder">打印订单</el-link>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    components: {},
    filters: {
        getOrderStatus(status, orderType) {
            const isPickup = orderType == 'SM'
            const orderStatusDict = {
                1: '待付款',
                3: '已付定金',
                5: isPickup ? '待备货' : '待发货',
                10: '待收货',
                15: isPickup ? '待核销' : '待收货',
                20: '已完成',
                [-5]: '已取消'
            }
            return orderStatusDict[status] || '-'
        },
        refundStatus(data) {
            if (data.applyStatus == 1 && data.sellerStatus == 0) {
                return '待商家确认'
            }
            if (data.applyStatus == -3) {
                return '已拒绝'
            }
            if (data.goodsStatus == 1 && data.sellerStatus == 1) {
                return '待用户退货'
            }
            if (data.applyStatus == 2) {
                return '待审核'
            }
            if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
                return '待商家收货'
            }
            if (data.applyStatus == 3) {
                return '已完成'
            }
            if (data.applyStatus == -1 || data.applyStatus == -2) {
                return '已取消'
            }
            if (data.refundStatus == 0) {
                return '未申请'
            }
            return '-'
        }
    },
    props: {
        tableList: {
            type: [Object, Array],
            required: true
        },
        orderInfo: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {
            orderType: {
                O: '普通订单',
                P: '预售订单',
                G: '团购订单',
                S: '秒杀订单',
                MG: '拼团订单',
                SM: '门店自提订单'
            },
            showMergeHoverStyle: false,
            showAllHoverStyle: false
        }
    },
    computed: {
        // 售后状态的等待颜色
        afterStatus() {
            return (row) => {
                return (
                    (row.applyStatus == 1 && row.sellerStatus == 0) ||
                    (row.goodsStatus == 1 && row.sellerStatus == 1) ||
                    row.applyStatus == 2 ||
                    (row.goodsStatus == 3 && row.sellerStatus == 1) ||
                    (row.goodsStatus == 5 && row.sellerStatus == 1)
                )
            }
        }
    },
    watch: {},
    mounted() {},
    methods: {
        //查看售后
        checkAfterSell(row) {
            // applyType为1、2是退货、退款，为3是商家申请取消订单
            if (this.orderInfo.applyType != 3) {
                this.$router.push({ name: 'refuseDetail', query: { id: row.refundId } })
            } else {
                this.$router.push({ name: 'shopApplicationDetail', query: { orderNumber: row.orderNumber } })
            }
        },
        //打印商品订单信息
        toPrintOrder() {
            window.open(this.$router.resolve({ path: '/orderPrint', query: { orderId: this.orderInfo.id } }).href, '_blank')
        },
        //合并表格单元格
        preSellSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex != 0) {
                if (columnIndex === 2) {
                    return [1, 5]
                } else if (columnIndex === 3) {
                    return [0, 0]
                } else if (columnIndex === 4) {
                    return [0, 0]
                } else if (columnIndex === 5) {
                    return [0, 0]
                } else if (columnIndex === 6) {
                    return [0, 0]
                } else if (columnIndex === 7) {
                    return [1, 3]
                } else if (columnIndex === 8) {
                    return [0, 0]
                } else if (columnIndex === 9) {
                    return [0, 0]
                }
            }
        },
        //普通订单表格合并
        normalSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex >= 3 && columnIndex <= 7) {
                if (rowIndex == 0) {
                    return {
                        rowspan: this.tableList.length, //合并的行数
                        colspan: 1 //合并的列数
                    }
                } else {
                    return [0, 0]
                }
            }
        },
        cellMouseEnter(row, column, cell, event) {
            if (this.orderInfo.refundStatus == 0) {
                if (['orderType', 'userInfo', 'actualAmount', 'shopInfo', 'orderStatus'].includes(column.property)) {
                    this.showAllHoverStyle = true
                } else {
                    this.showMergeHoverStyle = true
                }
            }
        },
        cellMouseLeave(row, column, cell, event) {
            if (['orderType', 'userInfo', 'actualAmount', 'shopInfo', 'orderStatus'].includes(column.property) && this.orderInfo.refundStatus == 0) {
                this.showAllHoverStyle = false
            }
            this.showMergeHoverStyle = false
        }
    }
}
</script>
<style lang="scss" scoped>
.customTable__table {
    td {
        &:first-child {
            width: auto;
        }
    }
}

>>> td.hoverStyle,
>>> tr.hoverStyle {
    // .el-table {
    // border: 1px solid rgba(227, 228, 231, 1);
    background-color: #fafafa;
    //  }
}

// .customTable__header{
// 	th{
// 		&:first-child{
// 			width:auto;
// 		}
// 	}
// }
</style>
