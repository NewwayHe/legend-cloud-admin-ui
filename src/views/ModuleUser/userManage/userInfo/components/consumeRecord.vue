<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="下单时间">
                        <el-date-picker
                            v-model="date"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
                </el-form>
            </div>
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
                    <el-table-column label="交易类型">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type == 'PAYMENT_GOODS'">商品交易</div>
                            <div v-if="scope.row.type == 'REFUND'">退款</div>
                            <div v-if="scope.row.type == 'OTHER'">其他</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tradeExplain" label="交易说明" width="400" show-overflow-tooltip />
                    <el-table-column prop="bizOrderNo" label="业务编号/第三方交易单号" min-width="125" />
                    <el-table-column label="金额">
                        <template slot-scope="scope">
                            {{ scope.row.amount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payTypeName" label="收/付款方式" />
                    <el-table-column prop="createTime" label="交易时间" width="140" />
                </el-table>
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
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
export default {
    components: {},
    mixins: [common],
    data() {
        return {
            url: {
                getData: '/user/admin/user/detail/customerBill'
            },
            date: [],
            searchFilters: {},
            isMounted: true
        }
    },
    watch: {},
    created() {
        if (this.$route.query.userId) {
            this.fixFilters.ownerId = this.$route.query.userId
        }
    },
    mounted() {},
    methods: {
        // 时间改变
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startDate', this.date[0])
                this.$set(this.searchFilters, 'endDate', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>
