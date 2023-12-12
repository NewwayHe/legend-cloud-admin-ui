<!-- /*
 * @Descripttion: 余额明细
*/ -->
<template>
    <section class="">
        <!-- 搜索查询 -->
        <div class="search">
            <el-card shadow>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="用户ID：">
                        <el-input v-model="searchFilters.userId" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="昵称：">
                        <el-input v-model="searchFilters.nickName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label=" 手机号码：">
                        <el-input v-model="searchFilters.mobile" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="收支类型：">
                        <el-select v-model="searchFilters.operationType" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="收入" value="ADDITION" />
                            <el-option label="支出" value="DEDUCTION" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易类型：">
                        <el-select v-model="searchFilters.businessType" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="订单消费" value="ORDER_DEDUCTION" />
                            <el-option label="充值" value="PAYMENT_RECHARGE" />
                            <el-option label="订单退款" value="" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付状态">
                        <el-select v-model="searchFilters.state" clearable placeholder="全部">
                            <el-option label="全部" value="" />
                            <el-option label="已支付" :value="1" />
                            <el-option label="未支付" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间：">
                        <el-date-picker
                            v-model="date"
                            style="width: 250px"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="支付时间：">
                        <el-date-picker
                            v-model="payDate"
                            style="width: 250px"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate('payTime')"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card>
            <!-- 表格列表 -->
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="tableList"
                tooltip-effect="dark"
                class="w-100"
                @selection-change="selectionChange"
            >
                <template slot="empty">
                    <empty empty-type="pro" text="暂无数据" />
                </template>
                <el-table-column label="序号" type="index" width="100" />
                <el-table-column prop="userId" label="用户ID" />
                <el-table-column prop="nickName" label="昵称" />
                <el-table-column prop="mobile" label="手机号码" />
                <el-table-column prop="serialNo" label="充值流水号" show-overflow-tooltip />
                <el-table-column prop="productName" label="收支类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="scope.row.operationType == 'ADDITION' ? 'success' : 'warning'">
                            {{ scope.row.operationType === 'ADDITION' ? '收入' : '支出' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="businessType" label="交易类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.businessType | getStatusStr }}
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.amount | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
                <el-table-column prop="updateTime" label="支付时间" show-overflow-tooltip />
                <el-table-column prop="state" label="支付状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="scope.row.state == 0 ? 'warning' : ''">{{ scope.row.state === 0 ? '未支付' : '已支付' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
            </el-table>
            <el-row type="flex" justify="end" class="mt-20">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </el-card>
    </section>
</template>

<script>
import { deposit } from '@/api/ModuleFinance.js'
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    components: {
    },
    filters: {
        getStatusStr(status) {
            let statusStr = {
                PAYMENT_RECHARGE: '充值', // 付款充值
                CASH_WITHDRAWAL: '提现', // 现金提现
                '': '订单消费',
                '': '订单退款',
                '': '定金支付',
                '': '定金退还', //
                DISTRIBUTION_REWARDS: '佣金收益' // 分销奖励
            }
            return statusStr[status]
        }
    },
    mixins: [common, cud],
    data() {
        return {
            isMounted: true,
            // 搜索参数
            searchFilters: {
                userId: '', // 用户id
                nickName: '', // 昵称
                mobile: '', // 手机号码
                operationType: '', // 收支类型
                businessType: '', // 交易类型
                status: 0 // 支付状态
            },
            // 调用接口搜索
            url: {
                getData: '/pay/admin/wallet/page'
            },
            date: '', // 时间
            payDate: '' // 支付时间
        }
    },
    created() {
        this.getTableList()
    },
    methods: {
        // 获取余额明细表单数据
        getTableList() {
            deposit.walletPage().then((res) => {
                if (res.code) {
                    this.tableList = res?.data?.resultList || []
                }
            })
        },
        // 日期改变的时候触发
        changeDate(style) {
            if (style == 'payTime') {
            } else {
                if (this.date) {
                    this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d} {h}:{i}:{s}'))
                    this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d} {h}:{i}:{s}'))
                } else {
                    this.$set(this.searchFilters, 'startDate', '')
                    this.$set(this.searchFilters, 'endDate', '')
                }
            }
        }
    }
}
</script>

<style>
.success {
    color: rgb(103, 194, 58);
}
.warning {
    color: rgb(230, 162, 60);
}
</style>
