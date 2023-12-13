<!-- 分销佣金 -->
<template>
    <div class="table">
        <!-- 订单列表 -->
        <el-table
            ref="multipleTable"
            v-loading="tableListLoading"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100"
            header-row-class-name="headerRow"
        >
            <template slot="empty">
                <empty empty-type="pro" text="暂无分销员信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column label="分销商品" prop="productName" width="280">
                <template slot-scope="scope">
                    <div class="d-flex a-center line-h-md">
                        <ls-image
                            class="flex-shrink mr-10"
                            style="flex: 0 0 60px"
                            :src="scope.row.pic"
                            :is-preview="false"
                            :options="{ w: '60', h: '60', br: '4' }"
                        ></ls-image>
                        <div class="flex-1 overflow-h flex-col-between">
                            <!-- <span class="line-clamp2">{{ scope.row.productName }}</span> -->
                            <el-link :underline="false" type="primary">
                                <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.productName">
                                    <!-- <el-link :underline="false" type="primary" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+goodsInfo.productId">{{$shareRedirectUrl+'?detailsType=good&id='+goodsInfo.productId}}</el-link> -->
                                    <div slot="reference" class="text-two text-left">{{ scope.row.productName }}</div>
                                </el-popover>
                            </el-link>
                            <span v-if="scope.row.attribute" class="line-clamp1 text-999 font-12 mt-10">{{ scope.row.attribute }}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品数量" prop="basketCount" width="100" />
            <el-table-column label="商品金额" prop="actualAmount" width="115">
                <template slot-scope="scope">
                    {{ scope.row.actualAmount | priceFilter }}
                </template>
            </el-table-column>
            <el-table-column label="商品佣金比例" prop="distRatio" min-width="100">
                <template slot-scope="scope">{{ scope.row.distRatio }}%</template>
            </el-table-column>
            <el-table-column label="商品佣金金额" prop="distCommissionCash" width="115">
                <template slot-scope="scope">
                    {{ scope.row.distCommissionCash | priceFilter }}
                </template>
            </el-table-column>
            <el-table-column label="售后状态" width="100">
                <template slot-scope="scope">
                    {{ scope.row.refundStatus | getRefundStatus }}
                </template>
            </el-table-column>
            <el-table-column label="结算状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.commissionSettleStatus == -10">已取消</span>
                    <span v-if="scope.row.commissionSettleStatus == 0" class="status-wait">待结算</span>
                    <span v-if="scope.row.commissionSettleStatus == 10">已结算</span>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderNumber" min-width="180" />
            <el-table-column prop="productName" label="操作" fixed="right" width="80">
                <template slot-scope="scope">
                    <span class="table__action"><el-link :underline="false" type="primary" @click="goto(scope.row.orderNumber)">查看</el-link></span>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" class="mt-30">
            <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
        </el-row>
    </div>
</template>

<script>
import common from '@/mixins/pages/commom'
export default {
    components: {},
    filters: {
        getRefundStatus(status) {
            switch (status) {
                case 0:
                    return '未申请售后'
                    break
                case 1:
                    return '售后处理中'
                    break
                case 2:
                    return '售后已完成'
                    break
            }
        }
    },
    mixins: [common],
    props: {
        searchParams: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            isMounted: true,
            url: {
                getData: '/order/admin/shop/order/bill/detailList'
            },
            fixFilters: {
                orderType: 3,
                id: this.$route.query.id
            },
            sonEffect: true //作用参考commom.js
        }
    },
    watch: {
        searchParams: {
            handler(newVal) {
                this.fixFilters = { ...this.fixFilters, ...newVal }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        goto(orderNumber) {
            this.$router.push({
                name: 'distrOrderDetail',
                query: {
                    orderNumber: orderNumber
                }
            })
        }
    }
}
</script>

<style></style>
