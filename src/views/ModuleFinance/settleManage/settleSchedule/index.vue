<!-- /*
 * @Descripttion: 结算管理->结算档期
*/ -->
<template>
    <section class="">
        <el-card shadow>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="结算档期">
                        <el-input v-model="searchFilters.flag" placeholder="结算档期" />
                    </el-form-item>
                    <el-form-item label="档期时间">
                        <el-date-picker v-model="searchFilters.startTime" type="date" placeholder="档期时间" value-format="yyyy-MM-dd" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="exportReport(searchFilters.flag, searchFilters.startTime)">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table">
                <el-alert type="info" class="theme mb-20" :closable="false" show-icon>
                    结算档期是指平台设定一定周期内跟商家结算的时间，每个周期算一个档期，如7天，那么7天算一个档期
                </el-alert>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="flag" label="结算档期" width="140"/>
                    <el-table-column label="应结总额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.resultTotalAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单总额" min-width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.orderAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台佣金总额" min-width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.commisTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="分销佣金总额" min-width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.distCommisTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="退单总额" min-width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.orderReturnTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="红包总额" min-width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.redpackTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="recDate" label="创建时间" width="140"/>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary">
                                <router-link :to="{ name: 'settleBill', query: { flag: scope.row.flag } }">查看</router-link>
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
                <el-alert type="warning" class="defalult mt-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>1. 当前商家结算日为: 每周 ，每次结算会形成一个结算档期</p>
                        <p>2. 账单计算公式：</p>
                        <p>&emsp; 订单金额(含运费) - 退单金额 - 平台佣金 - 分销佣金 + 优惠券总额 - 退单优惠券金额 + 预售定金</p>
                        <p>
                            3. 账单处理流程为：系统出账 > 商家确认 > 平台审核 > 财务支付(完成结算)
                            4个环节，其中平台审核和财务支付需要平台介入，请予以关注
                        </p>
                    </div>
                </el-alert>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { settle } from '@/api/ModuleFinance.js'
export default {
    name: 'SettleSchedule',
    components: { },
    filters: {
        // 日期过滤
        datefilter(val) {
            console.log(val)
            return val.substr(0, 10)
        }
    },

    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/order/admin/bill/period/page'
            }
        }
    },
    methods: {
        // 导出
        exportReport(flag, startTime) {
            settle
                .exportSettleData({
                    flag,
                    startTime
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success('导出成功')
                    }
                })
        }
    }
}
</script>
