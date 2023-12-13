<!-- /*
 * @Descripttion:结算账单
*/ -->
<template>
    <section>
        <el-card shadow>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="结算档期"><el-input v-model="searchFilters.flag" placeholder="结算档期" /></el-form-item>
                    <el-form-item label="结算单号"><el-input v-model="searchFilters.sn" placeholder="结算单号" /></el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="exportReport(searchFilters.flag, searchFilters.sn)">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button>所有结算单</el-radio-button>
                            <el-radio-button label="1">待确认</el-radio-button>
                            <el-radio-button label="2">待审核</el-radio-button>
                            <el-radio-button label="3">待结算</el-radio-button>
                            <el-radio-button label="4">已完成</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-alert type="info" class="theme mb-20" :closable="false" show-icon>
                    平台跟商家结算方式是账单在商家和平台确认后，平台线下转账给到商家，这里只是记账
                </el-alert>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    row-key="id"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column prop="flag" label="结算档期/时间" width="160">
                        <template slot-scope="scope">
                            <div>{{ scope.row.flag }}</div>
                            <span>{{ scope.row.startDate | dateFilter }} ~ {{ scope.row.endDate | dateFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sn" label="结算单号" min-width="180" />
                    <el-table-column label="订单金额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.orderAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="运费" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.shippingTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="退单金额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.orderReturnTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台佣金" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.commisTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="分销佣金" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.distCommisTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="红包总额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.redpackTotals | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="应结金额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.resultTotalAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="出账日期" width="140">
                        <template slot-scope="scope">
                            <div>{{ scope.row.createDate || 0 | dateFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" class="status-wait">待确认</span>
                            <span v-if="scope.row.status == 2" class="status-wait">待审核</span>
                            <span v-if="scope.row.status == 3" class="status-wait">待结算</span>
                            <span v-if="scope.row.status == 4">已完成</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="shopName" label="店铺名称" width="140" />
                    <el-table-column prop="shopId" label="店铺ID" />
                    <el-table-column label="操作" align="center" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status == 1 || scope.row.status == 4" :underline="false" type="primary">
                                <router-link :to="{ name: 'settleInfo', query: { id: scope.row.id } }">查看</router-link>
                            </el-link>
                            <el-link v-if="scope.row.status == 2" :underline="false" type="primary">
                                <router-link :to="{ name: 'settleInfo', query: { id: scope.row.id } }">审核</router-link>
                            </el-link>
                            <el-link v-if="scope.row.status == 3" :underline="false" type="primary">
                                <router-link :to="{ name: 'settleInfo', query: { id: scope.row.id } }">结算</router-link>
                            </el-link>
                        </template>
                    </el-table-column>
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
                <el-alert type="warning" class="defalult mt-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>1. 当前商家结算日为: 每周 ，每次结算会形成一个结算档期</p>
                        <p>2. 账单计算公式：</p>
                        <p>&emsp;订单金额(含运费) - 退单金额 - 平台佣金 - 分销佣金 + 优惠券总额 - 退单优惠券金额 + 预售定金</p>
                        <p>
                            3. 账单处理流程为：系统出账 > 商家确认 > 平台审核 > 财务支付(完成结算)
                            4个环节，其中平台审核和财务支付需要平台介入，请予以关注
                        </p>
                    </div>
                </el-alert>
            </div>
            <dialog-audit
                :id="billId"
                ref="auditDialog"
                url="/shop/admin/shop/detail/audit"
                :user-params="{ ids: 'idList', status: 'opStatus', content: 'auditOpinion' }"
                @finish="getData"
            />
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { settle } from '@/api/ModuleFinance.js'
import DialogAudit from '@/comCommon/dialogAudit'

export default {
    name: 'SettleBill',
    components: {
        DialogAudit
    },

    filters: {
        // 日期过滤
        dateFilter(val) {
            return val.substr(0, 10)
        }
    },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/order/admin/shop/order/bill/page'
            },
            searchFilters: {
                flag: '' // 档期
            },
            billId: '' // 用户ID
        }
    },
    created() {
        if (this.$route.query.flag) this.searchFilters.flag = this.$route.query.flag // 档期
    },
    methods: {
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },
        // 导出
        exportReport(flag, sn) {
            settle
                .exportSettleBillData({
                    flag,
                    sn
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
