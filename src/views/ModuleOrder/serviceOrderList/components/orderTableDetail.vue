<!--
    售后订单详情底部表格
-->
<template>
    <div class="customTable__warp table">
        <el-table
            ref="multipleTable"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100"
            header-row-class-name="headerRow"
            :span-method="spanMerge"
        >
            <template slot="empty">
                <empty empty-type="pro" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="pic" label="商品" width="280">
                <template slot-scope="scope">
                    <div class="d-flex a-center line-h-md">
                        <ls-image style="flex: 0 0 60px" :src="scope.row.pic" :options="{ w: '60', h: '60', br: '4' }" />
                        <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.productName">
                            <el-link
                                :underline="false"
                                type="primary"
                                target="_blank"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
                            </el-link>
                            <template slot="reference">
                                <el-link
                                    class="ml-10"
                                    style="font-size: 0"
                                    :underline="false"
                                    type="primary"
                                    target="_blank"
                                    :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                                >
                                    <div class="line-clamp2 text-left font-12">{{ scope.row.productName }}</div>
                                </el-link>
                            </template>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" show-overflow-tooltip width="115">
                <template slot-scope="scope">
                    <span class="line-h-md">{{ scope.row.price | priceFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="basketCount" label="数量" width="100">
                <template slot-scope="scope">{{ scope.row.basketCount || '-' }}</template>
            </el-table-column>
            <el-table-column prop="status" label="订单类型">
                <template>
                    <div>{{ refuseInfo.orderType == 'O' ? '普通订单' : '预售订单' }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="userInfo" label="用户信息" min-width="100">
                <template>
                    <el-link
                        class="text-blue font-12"
                        type="primary"
                        :underline="false"
                        @click="$router.push({ name: 'userInfo', query: { userId: refuseInfo.userId } })"
                    >
                        {{ refuseInfo.nickName }}
                    </el-link>
                    <p>{{ refuseInfo.receiver }}</p>
                    <p>{{ refuseInfo.mobile }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="商品实付款" min-width="140">
                <template slot-scope="scope">
                    <p>
                        {{ scope.row.actualAmount | priceFilter }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="orderAmount" label="订单实付款" min-width="140">
                <template slot-scope="scope">
                    <p>
                        {{ orderPriceAmount | priceFilter }}
                        <br />
                        <span class="text-999">(含运费: {{ refuseInfo.freightPrice | priceFilter }})</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="shopInfo" label="店铺信息" width="140">
                <template slot-scope="scope">
                    <el-popover placement="top" width="450" trigger="hover" :title="refuseInfo.shopName">
                        <el-link
                            type="primary"
                            target="_blank"
                            :underline="false"
                            :href="$shareRedirectUrl + '?detailsType=shop&shopId=' + refuseInfo.shopId"
                        >
                            {{ $shareRedirectUrl + '?detailsType=shop&shopId=' + refuseInfo.shopId }}
                        </el-link>
                        <el-link
                            slot="reference"
                            :underline="false"
                            class="line-clamp2"
                            type="primary"
                            target="_blank"
                            :href="$shareRedirectUrl + '?detailsType=shop&shopId=' + refuseInfo.shopId"
                        >
                            {{ refuseInfo.shopName }}
                        </el-link>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="交易状态">
                <template>
                    <span :class="'1,5,10'.includes(refuseInfo.orderStatus) ? 'status-wait' : 'status-done'">
                        {{ refuseInfo.orderStatus | getOrderStatus }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="afterStatus" label="售后状态" width="120">
                <template>
                    <span :class="refuseInfo.applyStatus == -3 ? 'status-veto' : afterStatus(refuseInfo) ? 'status-wait' : 'status-done'">
                        {{ refuseInfo | refundStatus }}
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
        getOrderStatus(status) {
            const orderStatusDict = {
                1: '待付款',
                5: '待发货',
                10: '待收货',
                15: '已收货',
                20: '已完成',
                [-5]: '已取消',
                3: '已付定金'
            }
            return orderStatusDict[status] || '-'
        },
        refundStatus(data) {
            if (data.refundStatus == 0) {
                return '未申请'
            }
            if (data.applyStatus == -1 || data.applyStatus == -2) {
                return '已取消'
            }
            if (data.applyStatus == -3) {
                return '已拒绝'
            }
            if (data.applyStatus == 3) {
                return '已完成'
            }
            if (data.applyStatus == 1 && data.sellerStatus == 0) {
                return '待商家确认'
            }
            if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
                return '待商家收货'
            }
            if (data.applyStatus == 2) {
                return '待审核'
            }
            return '-'
        }
    },
    props: {
        tableList: {
            type: [Object, Array],
            required: true
        },
        refuseInfo: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {}
    },
    computed: {
        // 售后状态的等待颜色
        afterStatus() {
            return (row) => {
                return (
                    (row.applyStatus == 1 && row.sellerStatus == 0) ||
                    row.applyStatus == 2 ||
                    (row.goodsStatus == 3 && row.sellerStatus == 1) ||
                    (row.goodsStatus == 5 && row.sellerStatus == 1)
                )
            }
        },
        // 订单实付款 金额总和
        orderPriceAmount() {
            return this.tableList.reduce((pre, cur) => pre + cur.actualAmount, this.refuseInfo.freightPrice || 0)
        }
    },
    watch: {},

    methods: {
        // 行/列合并
        spanMerge({ row, column, rowIndex, columnIndex }) {
            // 行合并
            const rowSpan = this.tableList.length
            const rowSpanProps = ['userInfo', 'shopInfo', 'orderStatus', 'afterStatus', 'orderAmount']
            if (rowSpanProps.includes(column.property)) {
                if (rowIndex == 0) {
                    //第一行
                    return [rowSpan, 1]
                } else {
                    return [0, 1]
                }
            } else {
                return [1, 1]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/* 表格第二列 商品列靠左对齐 */
.table {
    ::v-deep .el-table thead th {
        &:nth-child(2) {
            text-align: left;
        }
    }
}
</style>
