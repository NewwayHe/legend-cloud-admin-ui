<!-- /*
 * @Descripttion:充值明细
*/ -->
<template>
    <section>
        <el-card shadow>
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
                    <el-form-item label="支付方式">
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
                        <el-button size="small" @click.stop="resetSearch">重置</el-button>
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
                    <el-table-column prop="productName" label="支付方式" show-overflow-tooltip>
                        <template>
                            <span>未提供</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="140" show-overflow-tooltip />
                    <el-table-column prop="updateTime" label="支付时间" width="140" show-overflow-tooltip />
                    <el-table-column prop="state" label="支付状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span :class="scope.row.state == 0 ? 'status-done' : 'status-pass'">
                                {{ scope.row.state === 0 ? '未支付' : '已支付' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productName" label="操作" show-overflow-tooltip fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showSeeDialog(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-30">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
                <seeDialog :info="infoData" :show-dialog-visible.sync="showDialogVisible" @changeDialog="changeDialogVisible"></seeDialog>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
// 引入查看对话框
import seeDialog from '../components/seeDialog/seeDialog.vue'
export default {
    name: 'RechargeDetail',
    components: {
        seeDialog
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
                getData: '/pay/admin/wallet/page'
                // getExcel: '/user/admin/count/amount/page/excel', // 有接口的时候更换
            },
            showDialogVisible: false, // 控制封装组件对话框的
            infoData: {}, // 传递给查看对话框组件的数据
            date: '', // 时间
            payDate: '' // 支付时间
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },
    methods: {
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

<style scoped></style>
