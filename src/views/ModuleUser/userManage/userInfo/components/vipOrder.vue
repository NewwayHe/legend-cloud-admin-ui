<!-- /*
 * @Descripttion:会员订单
*/ -->
<template>
    <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
        <div class="search">
            <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                <el-form-item label="商品名称"><el-input v-model="searchFilters.productName" placeholder="商品名称" /></el-form-item>
                <el-form-item label="订单号"><el-input v-model="searchFilters.orderNumber" placeholder="订单号" /></el-form-item>
                <el-form-item label="交易状态">
                    <el-select v-model="searchFilters.payedFlag" placeholder="请选择" clearable>
                        <el-option label="已支付" :value="1" />
                        <el-option label="未支付" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
            </el-form>
        </div>

        <div ref="wrapTable" class="customTable__warp">
            <template v-if="tableList && tableList.length">
                <table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
                    <thead>
                        <tr>
                            <th width="48">序号</th>
                            <th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
                            <th width="140">单价</th>
                            <th :width="tableLayout.d_80">数量</th>
                            <th :width="tableLayout.d_80">订单类型</th>
                            <th min-width="100" :width="tableLayout.m_100">用户信息</th>
                            <th min-width="140" :width="tableLayout.m_140">实付款</th>
                            <th :width="tableLayout.d_80">交易状态</th>
                            <th width="120">售后状态</th>
                        </tr>
                    </thead>
                </table>
                <div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
                    <table v-for="(item, indexs) in tableList" :key="indexs" class="customTable__table">
                        <colgroup>
                            <col width="48" />
                            <col min-width="80" :width="tableLayout.m_80" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col width="140" />
                            <col :width="tableLayout.d_80" />
                            <col :width="tableLayout.d_80" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col min-width="140" :width="tableLayout.m_140" />
                            <col :width="tableLayout.d_80" />
                            <col width="120" />
                        </colgroup>
                        <tbody>
                            <tr class="customTable__trHead">
                                <td colspan="11" style="text-align: left">
                                    <span class="customTable__trHead--action">下单时间：{{ item.createTime }}</span>
                                    <span class="customTable__trHead--action">订单号: {{ item.orderNumber }}</span>
                                    <span class="customTable__trHead--action customTable__primary">
                                        <span class="icon iconfont icon-index mr-5 font-12" />
                                        {{ item.shopName }}
                                    </span>
                                    <span v-if="item.payedFlag" class="customTable__trHead--action">支付方式：{{ item.payTypeName }}</span>
                                </td>
                            </tr>
                            <tr v-for="(goodsInfo, index) in item.orderItemDTOList" :key="goodsInfo.id">
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ indexs + 1 }}</td>
                                <td colspan="3">
                                    <div class="d-flex a-center line-h-md">
                                        <ls-image style="flex: 0 0 50px" :src="goodsInfo.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                        <div class="ml-10 flex-col-between">
                                            <el-link :underline="false" type="primary" class="font-12">
                                                <el-popover placement="top-start" width="500" trigger="hover" :content="goodsInfo.productName">
                                                    <div slot="reference" class="text-two text-left">{{ goodsInfo.productName }}</div>
                                                </el-popover>
                                            </el-link>
                                            <span v-if="goodsInfo.attribute" class="text-999 mt-10 text-left">{{ goodsInfo.attribute }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ goodsInfo.price | priceFilter }}</td>
                                <td>{{ goodsInfo.basketCount }}</td>
                                <!-- 订单类型 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ orderType[item.orderType] }}</td>

                                <!-- 用户信息 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <el-link :underline="false" type="primary" class="font-12">{{ item.nickName }}</el-link>
                                    <p class="word-breakall">{{ item.receiver }}</p>
                                    <p>{{ item.mobile }}</p>
                                </td>
                                <!-- 实付款 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <p>{{ item.actualTotalPrice | priceFilter }}</p>
                                    <p>(含运费：{{ item.changedPrice | priceFilter }})</p>
                                </td>

                                <!-- 交易状态 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <span :class="'1,5,10,15'.includes(item.status) ? 'status-wait' : 'status-done'">
                                        {{ item.status | getOrderStatus }}
                                    </span>
                                </td>

                                <!-- 售后状态 -->
                                <td v-if="!index" :rowspan="item.orderItemDTOList.length">
                                    <span>{{ item.refundStatus | getOrderRefundStatus }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </LsSticky>
            </template>
            <Empty v-else text="暂无订单列表" />
        </div>
    </el-card>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    name: 'VipOrder',
    components: {},
    filters: {
        getOrderStatus(value) {
            const dict = {
                0: '所有订单',
                1: '待付款',
                5: '待发货',
                10: '待签收',
                15: '待收货',
                20: '已完成',
                '-5': '已取消'
            }
            return dict[value]
        },
        getOrderRefundStatus(value) {
            const dict = {
                0: '未退款',
                1: '退货退款处理中',
                2: '已完成'
            }
            return dict[value]
        }
    },
    mixins: [common, cud],
    data() {
        return {
            fixFilters: {
                userId: ''
            },
            searchFilters: {
                productName: '',
                orderNumber: '',
                payedFlag: ''
            },
            url: {
                getData: '/order/admin/user/order/page'
            },
            isMounted: true,
            customCheck: false,
            orderType: {
                A: '预约订单',
                O: '普通订单',
                // P: '预售订单',
                G: '团购订单',
                S: '秒杀订单',
                MG: '拼团订单'
            },
            tableLayout: {
                // 单元格大小分配
                colTotalWidth: 48 + 80 + 100 + 100 + 140 + 100 + 120 + 80 * 3 + 140
            }
        }
    },
    created() {
        console.log(this.$route)
        if (this.$route.query.userId) {
            this.fixFilters.userId = this.$route.query.userId
        }
    },
    methods: {}
}
</script>
<style lang="scss" scoped>
::v-deep .self__table {
    &.el-table thead {
        color: #000;
    }
}
</style>
