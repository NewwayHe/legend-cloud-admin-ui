<!--
    用户报表->用户数量统计
-->
<template>
    <div>
        <el-card>
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>用户购买力排行</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            用户购买力排行包括，下单订单金额、下单订单数量、支付订单金额、支付订单数量、成交订单金额、成交订单数量、累计下单订单金额、累计下单订单数量、累计支付订单金额、累计支付订单数量、累计成交订单金额、累计成交订单数量；
                            <br />
                            统计维度包括，统计筛选时间段内所有渠道的数据；
                            <br />
                            下单订单金额 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交订单的订单项的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                            <br />
                            下单订单数量 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交订单的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；
                            <br />
                            支付订单金额 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交并完成支付的订单项的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                            <br />
                            支付订单数量 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交并完成支付的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；
                            <br />
                            成交订单金额 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交并完成支付的订单变为已完成状态的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；若完成时候需要扣除数据；
                            <br />
                            成交订单数量 =
                            统计筛选时间段内，第一天00:00:00至最后一天23:59:59，提交并完成支付的订单变为已完成状态的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；订单中只要其中一个订单项完成了售后扣除数据；
                            <br />
                            累计下单订单金额 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交订单的订单项的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                            <br />
                            累计下单订单数量 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交订单的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；
                            <br />
                            累计支付订单金额 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交并完成支付的订单项的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                            <br />
                            累计支付订单数量 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交并完成支付的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；
                            <br />
                            累计成交订单金额 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交并完成支付的订单变为已完成状态的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；若完成时候需要扣除数据；
                            <br />
                            累计成交订单数量 =
                            统计从商城产生数据日期开始，截至统计时间段的结束日期23:59:59，提交并完成支付的订单变为已完成状态的订单数量；若用户订单中合并了多个店铺的商品提交订单，则按照拆单之后的订单数量为准；订单中只要其中一个订单项完成了售后扣除数据；
                            <br />
                            客单价 = 统计时间段内，开始日期00:00:00至结束日期23:59:59，所有渠道的生成订单的数据；
                            <br />
                            计算公式：
                            <br />
                            客单价 = 累计成交金额/累计成交订单数量；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
            </el-row>

            <div class="search">
                <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                    <el-form-item><el-input v-model="searchFilters.userId" placeholder="用户ID" clearable></el-input></el-form-item>
                    <el-form-item><el-input v-model="searchFilters.mobile" placeholder="手机号码" clearable></el-input></el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date1"
                            type="daterange"
                            align="right"
                            :clearable="false"
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
                    header-row-class-name="headerRow"
                    @sort-change="changeSort"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="userId" label="用户ID " />
                    <el-table-column prop="nickName" label="昵称" min-width="100" />
                    <el-table-column prop="mobile" label="手机号码" min-width="100" />
                    <el-table-column prop="totalAmount" sortable="custom" label="下单订单金额" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.totalAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalQuantity" sortable="custom" label="下单订单数量" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.totalQuantity || 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payAmount" sortable="custom" label="支付订单金额" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.payAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payQuantity" sortable="custom" label="支付订单数量" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.payQuantity || 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealAmount" sortable="custom" label="成交订单金额" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.dealAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealQuantity" sortable="custom" label="成交订单数量" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.dealQuantity || 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationTotalAmount" sortable="custom" label="累计下单订单金额" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.cumulationTotalAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationTotalQuantity" sortable="custom" label="累计下单订单数量" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.cumulationTotalQuantity || 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationPayAmount" sortable="custom" label="累计支付订单金额" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.cumulationPayAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationPayQuantity" sortable="custom" label="累计支付订单数量" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.cumulationPayQuantity || 0 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationDealAmount" sortable="custom" label="累计成交订单金额" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.cumulationDealAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cumulationDealQuantity" sortable="custom" label="累计成交订单数量" min-width="140" />
                    <el-table-column prop="customerPrice" sortable="custom" label="客单价" min-width="115">
                        <template slot-scope="scope">
                            {{ scope.row.customerPrice | priceFilter }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" align="center"  fixed="right" width="180px" >
                  <template slot-scope="scope">
                    <span class="table__action">
                      <el-link :underline="false" type="primary">查看</el-link>
                      <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                      <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">修改</el-link>
                    </span>
                  </template>
                </el-table-column> -->
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
            date1: [],
            radio: '1',
            url: {
                getData: 'user/admin/count/purchasing/page',
                getExcel: 'user/admin/count/purchasing/page/excel',
                getChart: 'user/admin/count/purchasing/pic'
            },
            allList: {}
        }
    },
    created() {
        this.getDate()
    },
    methods: {
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date1.push(start, end)
            this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(start, '{y}-{m}-{d} {h}:{i}:{s}'))
            this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(end, '{y}-{m}-{d} {h}:{i}:{s}'))
        },
        changeDate() {
            if (this.date1) {
                this.$set(this.searchFilters, 'startDate', this.date1[0])
                this.$set(this.searchFilters, 'endDate', this.date1[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>

<style></style>
