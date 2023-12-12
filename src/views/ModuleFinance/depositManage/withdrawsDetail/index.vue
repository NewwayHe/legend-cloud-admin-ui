<!-- /*
 * @Descripttion:提现管理
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 搜索查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="用户ID">
                        <el-input v-model="searchFilters.userId" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="searchFilters.nickName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label=" 手机号码">
                        <el-input v-model="searchFilters.mobile" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="支付状态">
                        <el-select v-model="searchFilters.state" clearable placeholder="全部">
                            <el-option label="全部" value="" />
                            <el-option label="已支付" value="1" />
                            <el-option label="未支付" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
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
                        <empty empty-type="pro" text="暂无提现记录" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="userId" label="用户ID" show-overflow-tooltip/>
                    <el-table-column label="昵称/电话" min-width="100">
                        <template slot-scope="scope">
                            <p>{{ scope.row.nickName }}</p>
                            <p>{{ scope.row.mobile }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="提现金额" prop="amount" width="115">
                        <template slot-scope="scope">
                            {{ scope.row.amount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip width="140" />
                    <el-table-column label="审核时间" prop="updateTime" show-overflow-tooltip width="140">
                        <template slot-scope="scope">
                            {{ scope.row.updateTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.opStatus == -1 ? 'status-veto' : scope.row.opStatus == 1 ? 'status-pass' : 'status-wait' ">{{ scope.row.opStatus === -1 ? '拒绝' : scope.row.opStatus === 1 ? '通过' : '待审核' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.state === 1 ? 'status-pass' : scope.row.state === 0 ? 'status-done' : scope.row.state === 2 ? 'status-wait' : 'status-veto'">
                                {{ scope.row.state === 1 ? '已支付' : scope.row.state === 0 ? '-' : scope.row.state === 2 ? '处理中' : '支付失败' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.remarks || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link type="primary" :underline='false' @click="showSeeDialog(scope.row)">查看</el-link>
                                <el-link v-if="scope.row.opStatus != -1 && scope.row.opStatus != 1" type="primary" :underline='false' @click="examine(scope.row)">审核</el-link>
                                <el-link
                                    v-if="(scope.row.state === -999 || scope.row.state === -1) && scope.row.opStatus === 1"
                                    :underline="false"
                                    type="primary"
                                    @click="compensate(scope.row)"
                                >
                                    重新支付
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </div>
            <seeDialog :info="infoData" :show-dialog-visible.sync="showDialogVisible" @changeDialog="changeDialogVisible"></seeDialog>
            <dialog-audit
                :id="auditList"
                ref="isVisible"
                :user-params="{ ids: 'id', status: 'opinion', content: 'refuseReason' }"
                url="/pay/admin/wallet/audit"
                @finish="getData"
            ></dialog-audit>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
// 引入查看对话框
import seeDialog from '../components/seeDialog/seeDialog.vue'
import DialogAudit from '@/comCommon/dialogAudit'
import { settle } from '@/api/ModuleFinance'
export default {
    name: 'WithdrawsDetail',
    components: {
        seeDialog,
        DialogAudit
    },
    mixins: [common, cud],
    data() {
        return {
            switchType: 'top',
            url: {
                getData: '/pay/admin/wallet/page',
                getExcel: '/pay/admin/wallet/excel',
            },
            showDialogVisible: false, // 控制封装组件对话框的
            infoData: {}, // 传递给查看对话框组件的数据
            date: '', // 时间
            auditList: [] // 提交审核的数组
        }
    },
    watch: {},
    mounted() {},
    methods: {
        //查看。点击查看的时候把数据传递过去对话框组件
        showSeeDialog(row) {
            // 把数据准备好然后传递给对话框组件
            this.infoData = {
                mode: '提现',
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
        },
        // 审核
        examine(row) {
            this.auditList = []
            this.auditList.push(row.id)
            this.$refs.isVisible.showDialog()
        },
        // 重新支付
        compensate(row) {
            settle.compensate(row.id).then((res) => {
                if (res.code) {
                    this.$message.success('操作成功')
                    this.getData()
                }
            })
        },
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
        }
    }
}
</script>

<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style >
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
