<!-- /*
 * @Descripttion: 充值管理
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
                    <el-form-item label="支付方式：">
                        <el-select v-model="searchFilters.style" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="支付宝" :value="1" />
                            <el-option label="微信" :value="2" />
                            <el-option label="通联支付" :value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付状态">
                        <el-select v-model="searchFilters.state" clearable placeholder="全部">
                            <el-option label="全部" value="" />
                            <el-option label="已支付" :value="1" />
                            <el-option label="未支付" :value="2" />
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
                        <el-button size="small" @click.stop="dbnResetSearch">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <!-- 表格列表 -->
        <el-card>
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
                <el-table-column label="序号" type="index" width="100" align="center" />
                <el-table-column prop="userId" label="用户ID" align="center" />
                <el-table-column prop="nickName" label="昵称" align="center" />
                <el-table-column prop="mobile" label="手机号码" align="center" />
                <el-table-column prop="serialNo" label="充值流水号" align="center" show-overflow-tooltip />
                <el-table-column prop="amount" label="充值金额" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.amount | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="支付方式" align="center" show-overflow-tooltip>
                    <template>
                        <span>未提供</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip />
                <el-table-column prop="updateTime" label="支付时间" align="center" show-overflow-tooltip />
                <el-table-column prop="state" label="支付状态" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="scope.row.state == 0 ? 'warning' : ''">{{ scope.row.state === 0 ? '未支付' : '已支付' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="操作" align="center"   show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" @click="showSeeDialog(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" class="mt-20">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
            <seeDialog :info="infoData" :show-dialog-visible.sync="showDialogVisible" @changeDialog="changeDialogVisible"></seeDialog>
        </el-card>
    </section>
</template>

<script>
import { deposit } from '@/api/ModuleFinance.js'
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
// 引入查看对话框
import seeDialog from './seeDialog/seeDialog'
export default {
    components: {
        seeDialog
    },
    filters: {
        getStatusStr(status) {
            let statusStr = {
                PAYMENT_RECHARGE: '充值',
                CASH_WITHDRAWAL: '提现',
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
            // 搜索参数
            searchFilters: {
                userId: '', // 用户id
                nickName: '', // 昵称
                mobile: '', // 手机号码
                productName: '', // 支付方式
                state: '' // 支付状态
            },
            // 调用接口搜索
            url: {
                getData: '/pay/admin/wallet/page/?businessType=PAYMENT_RECHARGE'
            },
            date: '', // 时间
            payDate: '', // 支付时间
            // checkAll: false, // 全选状态
            showDialogVisible: false, // 控制封装组件对话框的
            tableList: [], // 表格数据
            infoData: {} // 传递给查看对话框组件的数据
        }
    },
    created() {
        // this.getTableList();
    },
    methods: {
        // 监听封装组件关闭了对话框 让showDialogVisible = false
        changeDialogVisible() {
            // 隐藏对话框
            this.showDialogVisible = false
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
        },
        // 点击查看的时候把数据传递过去对话框组件
        showSeeDialog(row) {
            // 把数据准备好然后传递给对话框组件
            this.infoData = {
                mode: '充值',
                serialNo: row.serialNo,
                nickName: row.nickName,
                amount: row.amount,
                createTime: row.createTime,
                updateTime: row.updateTime,
                bank: '未提供',
                banUser: '未提供',
                openUser: '未提供'
            }
            // 显示对话框
            this.showDialogVisible = true
        }
    }
}
</script>

<style></style>
