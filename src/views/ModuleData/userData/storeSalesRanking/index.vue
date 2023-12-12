<!--
    用户报表->店铺销售排行
-->
<template>
    <div>
        <el-card>
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>店铺销售排行</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            统计商城所有店铺销售数据排行；
                            <br />
                            交易额：已完成订单的金额；
                            <br />
                            成交订单数：用户提交的订单变为已完成状态（剔除完成售后）的订单数量；
                            <br />
                            成交数量：用户提交的订单变为已完成状态（剔除完成售后）的订单中的商品数量；
                            <br />
                            退货数：所有申请退款的订单中商品数量加之和；
                            <br />
                            缺货率：缺货率=商品达到库存预警的商品数量 / 上线状态的商品数量；
                            <br />
                            订单响应时间：订单处理的时间平均值；
                            <br />
                            下架率：下架率=商品被后台下架数量 / 上线商品数量
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
            </el-row>

            <div class="search">
                <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                    <el-form-item>
                        <el-select v-model="id" clearable filterable placeholder="全部店铺" @change="changeShop">
                            <el-option v-for="(item, index) in shopList" :key="index" :label="item.shopName" :value="item.shopName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            :clearable="false"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="changeDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
            <chart height="700px" :all-list="allList" />

            <div class="table mt-20">
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @sort-change="changeSort"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="shopName" label="店铺名称" width="140">
                        <template slot-scope="scope">
                            <el-popover
                            trigger="hover"
                            placement="top"
                            width="450"
                            :title="scope.row.shopName"
                            >
                                <el-link type="primary" target="_blank" :underline="false" :href="$shareRedirectUrl+'?detailsType=shop&shopId='+scope.row.shopId" >{{$shareRedirectUrl+'?detailsType=shop&shopId='+scope.row.shopId}}</el-link>
                                <el-link slot="reference" type="primary" :underline="false">{{scope.row.shopName}}</el-link>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealAmount" label="交易额" width="115">
                        <template slot-scope="scope">
                            {{ scope.row.dealAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealOrderNum" label="成交订单数">
                        <template slot-scope="scope">
                            {{ scope.row.dealOrderNum || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealGoodNum" sortable="custom" label="成交数量">
                        <template slot-scope="scope">
                            {{ scope.row.dealGoodNum || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="refundAmount" sortable="custom" label="退款金额" width="115">
                        <template slot-scope="scope">
                            {{ scope.row.refundAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="refundOrderNum" sortable="custom" label="售后订单数" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.refundOrderNum || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="outStockRate" sortable="custom" label="缺货率" >
                        <template slot-scope="scope">
                            {{ scope.row.outStockRate || 0 }}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderResponseTime" sortable="custom" label="订单响应时间" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.orderResponseTime || 0 }}h
                        </template>
                    </el-table-column>
                    <el-table-column prop="undercarriageRate" sortable="custom" label="下架率">
                        <template slot-scope="scope">
                            {{ scope.row.undercarriageRate || 0 }}%
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-row type="flex" justify="end" class="mt-30">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { urgApi } from '@/api/ModuleData'
import { psyApi } from '@/api/ModuleData'
import common from './mixins/commom'
import chart from './components/ColumnChart'
export default {
    name: 'UserRanking',
    components: {
        chart
    },
    mixins: [common],
    data() {
        return {
            id: '',
            mobile: '',
            date: [],
            radio: '1',
            shopList: {},
            url: {
                getData: '/user/admin/count/shop/sale/page',
                getExcel: '/user/admin/count/shop/sale/page/excel',
                getChart: '/user/admin/count/shop/sale/pic'
            },
            allList: {}
        }
    },
    created() {
        this.isMounted = true
        this.getDate()
        this.getList()
    },
    methods: {
        changeShop(e) {
            console.log(e)
            this.searchFilters.shopName = e
        },
        //店铺list
        getList() {
            psyApi.getList().then((res) => {
                this.shopList = res.data
            })
        },
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date.push(start, end)
        },
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

<style></style>
