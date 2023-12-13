<!-- 退款金额 -->
<template>
    <div class="table">
        <el-table
            ref="multipleTable"
            v-loading="tableListLoading"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100"
            header-row-class-name="headerRow"
        >
            <template slot="empty">
                <empty empty-type="pro" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column label="订单编号" prop="orderNumber" min-width="180" />
            <el-table-column label="下单时间" prop="orderTime" width="140" />
            <el-table-column label="售后编号" prop="refundNumber" min-width="180" />
            <el-table-column label="申请时间" prop="createTime;" width="140" />
            <el-table-column label="退款金额" width="115">
                <template slot-scope="scope">
                    <div>{{ scope.row.refundAmount | priceFilter }}</div>
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary">
                        <router-link :to="{ name: 'settleInfo', query: { id: scope.row.id } }">查看</router-link>
                    </el-link>
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
                orderType: 2,
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
    }
}
</script>

<style></style>
