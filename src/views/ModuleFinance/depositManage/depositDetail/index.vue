<!-- /*
 * @Descripttion:预存款明细
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 搜索查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="用户ID">
                        <el-input v-model="searchFilters.userId" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="searchFilters.nickName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label=" 手机号码">
                        <el-input v-model="searchFilters.mobile" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="收支类型">
                        <el-select v-model="searchFilters.operationType" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="收入" value="ADDITION" />
                            <el-option label="支出" value="DEDUCTION" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-select v-model="searchFilters.businessType" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="订单消费" value="ORDER_DEDUCTION" />
                            <el-option label="充值" value="PAYMENT_RECHARGE" />
                            <el-option label="订单退款" value="REFUND_COMPENSATION" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付状态">
                        <el-select v-model="searchFilters.state" clearable placeholder="全部">
                            <el-option label="全部" value="" />
                            <el-option label="已支付" :value="1" />
                            <el-option label="未支付" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="支付时间">
                        <el-date-picker
                            v-model="payDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="changeDate('payTime')"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="resetSearch">重置</el-button>
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
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
                    <el-table-column prop="userId" label="用户ID" />
                    <el-table-column prop="nickName" label="用户名" min-width="100" />
                    <el-table-column prop="mobile" label="手机号码" min-width="100" />
                    <el-table-column prop="serialNo" label="充值流水号" show-overflow-tooltip min-width="160" />
                    <el-table-column prop="amount" label="充值金额" show-overflow-tooltip width="115">
                        <template slot-scope="scope">
                            {{ scope.row.amount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="operationType" label="收支类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span :class="scope.row.operationType == 'ADDITION' ? 'status-pass' : 'status-wait'">
                                {{ scope.row.operationType == 'ADDITION' ? '收入' : '支出' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="businessType" label="交易类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.businessType == 'ORDER_DEDUCTION'">订单消费</span>
                            <span v-else-if="scope.row.businessType == 'PAYMENT_RECHARGE'">充值</span>
                            <span v-else-if="scope.row.businessType == 'REFUND_COMPENSATION'">订单退款</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip width="140" />
                    <el-table-column prop="updateTime" label="支付时间" show-overflow-tooltip width="140" />
                    <el-table-column prop="state" label="支付状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span :class="scope.row.state == 0 ? 'status-done' : 'status-pass'">
                                {{ scope.row.state === 0 ? '未支付' : '已支付' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.remarks || '-' }}
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
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: 'DepositDetail',
    components: {},
    filters: {
        getStatusStr(status) {
            let statusStr = {
                DISTRIBUTION_REWARDS: '佣金收益' // 分销奖励
                // SELF_DISTRIBUTION_REWARDS: '' ,     //自购返佣
                // PAYMENT_RECHARGE:   '',       //付款充值
                // PLATFORM_COMPENSATION:  '',      //平台返佣
                // ORDER_DEDUCTION: '',     //订单抵扣
                // ORDER_OVERTIME_REFUND: ',    //抵扣退还
                // CASH_WITHDRAWAL:'',      //现金提现
                // PLATFORM_DEDUCTION:'',   //平台扣除
                // REFUND_COMPENSATION:'',  //订单退款
            }
            return statusStr[status]
        }
    },
    mixins: [common, cud],
    data() {
        return {
            dialogForm: {
                formRule: {
                    productNo: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    productName: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    createUserCode: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            switchType: 'top',
            url: {
                getData: '/pay/admin/wallet/page',
                getExcel: '/pay/admin/wallet/excel'
            },
            date: '', // 时间
            payDate: '' // 支付时间
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },
    methods: {
        // 日期改变的时候触发
        changeDate(style) {
            if (style == 'payTime') {
                if (this.payDate) {
                    this.$set(this.searchFilters, 'payStartDate', this.$utils.time.parseTime(this.payDate[0], '{y}-{m}-{d} {h}:{i}:{s}'))
                    this.$set(this.searchFilters, 'payEndDate', this.$utils.time.parseTime(this.payDate[1], '{y}-{m}-{d} {h}:{i}:{s}'))
                } else {
                    this.$set(this.searchFilters, 'payStartDate', '')
                    this.$set(this.searchFilters, 'payEndDate', '')
                }
            } else {
                if (this.date) {
                    this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d} {h}:{i}:{s}'))
                    this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d} {h}:{i}:{s}'))
                } else {
                    this.$set(this.searchFilters, 'startDate', '')
                    this.$set(this.searchFilters, 'endDate', '')
                }
            }
        },
        resetSearch() {
            // 在这里做清除 否则会有延迟 导致 支付时间与创建时间的清空时机不一致
            this.date = ''
            this.payDate = ''
            this.searchFilters = this.$utils.object.deepClone(this.rawSearchFilters)
            this.dbnResetSearch()
        }
    }
}
</script>
