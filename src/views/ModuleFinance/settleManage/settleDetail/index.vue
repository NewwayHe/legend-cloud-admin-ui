<!--
    结算管理->平台资金明细
-->
<template>
    <section class="">
        <el-card class="mb-20 headerNumber" :body-style="{padding:`20px 20px 10px 20px`}">
            <div class="text-left mr-60" style="margin-left: 20px; margin-right: 150px">
                <div class="d-flex a-center">
                    <img src="@/assets/images/price_icon.png" style="width: 30px; height: 30px" alt="" />
                    &nbsp;
                    <span class="font-14">平台总金额</span>
                </div>

                <div class="font-30 mt-15 text-left font-weight">{{ priceAmount.sumPlateAmount | priceFilter }}</div>
            </div>
            <div class="text-left" style="margin-right: 150px">
                <div class="d-flex a-center">
                    <img src="@/assets/images/price_icon.png" style="width: 30px; height: 30px" alt="" />
                    &nbsp;
                    <span class="font-14">平台总收入</span>
                </div>

                <div class="font-30 mt-15 text-left font-weight">{{ priceAmount.sumIncomeAmount | priceFilter }}</div>
            </div>
            <div class="text-left">
                <div class="d-flex a-center">
                    <img src="@/assets/images/price_icon.png" style="width: 30px; height: 30px" alt="" />
                    &nbsp;
                    <span class="font-14">平台总支出</span>
                </div>

                <div class="font-30 mt-15 text-left font-weight">{{ priceAmount.sumSpendAmount | priceFilter }}</div>
            </div>
        </el-card>

        <!-- 查询 -->
        <el-card shadow>
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="收支类型">
                        <el-select v-model="searchFilters.flowType" placeholder="收支类型" clearable>
                            <el-option label="收入" :value="1" />
                            <el-option label="支出" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-select v-model="searchFilters.dealType" placeholder="交易类型" clearable>
                            <el-option label="商家结算" :value="1" />
                            <el-option label="预存款提现" :value="2" />
                            <el-option label="订单退款" :value="3" />
                            <el-option label="定金退款" :value="4" />
                            <el-option label="预存款充值" :value="6" />
                            <el-option label="订单支付" :value="7" />
                            <el-option label="定金支付" :value="8" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="记录时间">
                        <el-date-picker
                            v-model="templateSearch.recDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="exportReport(searchFilters.flowType, searchFilters.dealType, templateSearch.recDate)">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" @selection-change="selectionChange" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="paySettlementSn" label="支付流水号" min-width="130">
                        <template slot-scope="scope">
                            {{ scope.row.paySettlementSn || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="收支类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.flowType == 1" class="status-pass">收入</span>
                            <span v-if="scope.row.flowType == 2" class="status-veto">支出</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="交易类型">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dealType == 1">商家结算</div>
                            <div v-if="scope.row.dealType == 2">预存款提现</div>
                            <div v-if="scope.row.dealType == 3">订单退款</div>
                            <div v-if="scope.row.dealType == 4">定金退款</div>
                            <div v-if="scope.row.dealType == 5">保证金支付</div>
                            <div v-if="scope.row.dealType == 6">预存款充值</div>
                            <div v-if="scope.row.dealType == 7">订单支付</div>
                            <div v-if="scope.row.dealType == 8">定金支付</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payType" label="支付方式" />
                    <el-table-column label="金额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.amount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="recDate" label="记录时间" width="140" />
                    <el-table-column prop="payTime" label="支付时间" width="140" />
                    <el-table-column prop="remark" label="备注" min-width="200" />
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary"><span @click="skipTypeDetail(scope.row.dealType, scope.row.detailId)">查看</span></el-link>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom';
import cud from '@/mixins/pages/cud.js';
import { settle } from '@/api/ModuleFinance.js';
export default {
    name: 'SettleDetail',
    components: {
    },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/shop/plate/capital/flow/page'
            },
            templateSearch: {
                recDate: [] // 记录时间
            },
            priceAmount: {
                sumPlateAmount: 0 // 平台总金额
            }
        };
    },
    created() {
        this.getSettleAmount();
    },

    methods: {
        // 时间改变
        changeDate() {
            if (this.templateSearch.recDate) {
                this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.templateSearch.recDate[0], '{y}-{m}-{d}'));
                this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.templateSearch.recDate[1], '{y}-{m}-{d}'));
            } else {
                this.$set(this.searchFilters, 'startDate', '');
                this.$set(this.searchFilters, 'endDate', '');
            }
        },
        // 平台总金额查询
        getSettleAmount() {
            settle.getSettleAmount().then(res => {
                if (res.code === 1) {
                    this.priceAmount = res.data;
                }
            });
        },
        // 导出
        exportReport(flowType, dealType, recDate) {
            console.log(recDate);

            settle
                .exportSettleAmount({
                    flowType,
                    dealType,
                    startDate: this.searchFilters.startDate,
                    endDate: this.searchFilters.endDate
                })
                .then(res => {
                    if (res.code == 1) {
                        this.$message.success('导出成功');
                    }
                });
        },
        // 查看（跳转详情）
        skipTypeDetail(type, detailId) {
            let name = '';
            let paramsKey = '';
            switch (Number(type)) {
                case 1:
                    name = 'settleInfo';
                    paramsKey = 'id';
                    break;

                case 7:
                    name = 'orderDetail';
                    paramsKey = 'DetailId';
                    break;
                default:
                    break;
            }

            this.$router.push({
                name,
                query: {
                    [paramsKey]: detailId
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .headerNumber .el-card__body {
    display: flex;
}
</style>
