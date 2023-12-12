<!--
    商品报表->商品销售排行->趋势图
-->
<template>
    <el-card>
        <el-row slot="header">
            <span>数据趋势</span>
            <el-tooltip class="item" placement="right">
                <div slot="content">
                    数据趋势包括，当天成交金额、累计成交金额、当天成交量、累计成交商品数量、当天访问次数、累计访问次数、当天商品收藏量、累计商品收藏量；<br />
                    统计维度，统计筛选时间段内所有渠道每个SKU商品的数据；<br />
                    当天成交金额 =
                    以单个SKU商品为维度，统计筛选时间段内，当天24小时内SKU商品被提交订单并支付的订单金额；若订单项完成了售后，则需要扣除数据；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；<br />
                    累计成交金额 = 以单个SKU商品为维度，统计筛选时间段内，包括当天和前几天的成交金额累加之和；<br />
                    当天成交商品数量 = 以单个SKU商品为维度，统计筛选时间段内，当天24小时内SKU商品被提交订单并支付的商品数量；成交量是统计订单项中的所有商品数量；若订单项完成了售后，则需要扣除数据；<br />
                    累计成交商品数量 = 以单个SKU商品为维度，统计筛选时间段内，包括当天和前几天的成交量累加之和；<br />
                </div>
                <i class="el-icon-question text-main font-16 ml-5 "></i>
            </el-tooltip>
        </el-row>
        <el-row type="flex" align="middle" class="search">
            <el-form :inline="true" size="small">
                <el-form-item>
                    <el-date-picker v-model="date" @change="changeDate" start-placeholder="开始日期" range-separator="至"
                        end-placeholder="结束日期" type="daterange" placeholder="上牌时间" value-format="yyyy-MM-dd HH:mm:ss"
                        :clearable="false" />
                </el-form-item>
                <el-form-item>
                    <el-button @click.stop="dbnSearch">搜索</el-button>
                    <!-- <el-button @click.stop="dbnExcel">导出报表</el-button> -->
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <line-chart :chart-data="lineChartData" />
        </el-row>
        <el-row class="table">
            <el-table ref="multipleTable" height="460" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark"
                class="w-100" @sort-change="changeSort" header-row-class-name="headerRow">
                <template slot="empty">
                    <empty />
                </template>
                <el-table-column label="序号" type="index" width="48" />
                <el-table-column prop="time" label="统计日期" width="140"/>
                <el-table-column prop="dealAmount" label="当天成交金额">
                    <template slot-scope="scope">
                        {{ scope.row.dealAmount | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalDealAmount" label="累计成交金额">
                    <template slot-scope="scope">
                        {{ scope.row.totalDealAmount | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="dealGoodNum" label="当天成交商品数量">
                    <template slot-scope="scope">
                        {{ scope.row.dealGoodNum || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalDealGoodNum" label="累计成交商品数量">
                    <template slot-scope="scope">
                        {{ scope.row.totalDealGoodNum || '-' }}
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </el-card>
</template>

<script>
import common from './mixins/commom';
import LineChart from './components/lineChart';
import { debounce } from '@/utils/utils.js';
// import { dtsApi } from '@/api/ModuleData'
/* 
    这里写的有点坑 wangyu自己写了一份commom
    用全局的commom tableList拿的是res.data 而不是res.data.resultList... 后端也没有统一接口化
 */
export default {
    name: 'dataTrends',
    mixins: [common],
    components: {
        LineChart,
    },
    data() {
        return {
            url: {
                getData: '/product/admin/count/trend/deal',
                getLine: '/product/admin/count/trend/line'
            },
            date: [],
            isMounted: true,
        };
    },
    created() {
        this.$set(this.searchFilters, 'productId', this.$route.query.productId);
        this.getDate();
    },
    methods: {
        // dbnExcel: debounce(function() {
        //     dtsApi.getExcel({ 
        //         ...this.fixFilters,
        //         ...this.searchFilters,
        //         ...this.page,
        //         ...this.orderBy
        //     });
        // }),
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startDate', this.date[0]);
                this.$set(this.searchFilters, 'endDate', this.date[1]);
            } else {
                this.$set(this.searchFilters, 'startDate', '');
                this.$set(this.searchFilters, 'endDate', '');
            }
        },
        getDate() {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.date.push(start, end);
        }
    }
};
</script>

<style></style>
