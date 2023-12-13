<!-- /*
 * @Descripttion:店铺列表
*/ -->
<template>
    <section>
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="店铺名称">
                        <el-input v-model="searchFilters.shopName" placeholder="店铺名称" />
                    </el-form-item>
                    <el-form-item label="联系人手机">
                        <el-input v-model="searchFilters.contactPhone" placeholder="联系人手机" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="上线" :value="1" />
                            <el-option label="下线" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="changeStatus">
                            <el-radio-button>所有店铺</el-radio-button>
                            <el-radio-button label="0">待审核</el-radio-button>
                            <el-radio-button label="1">已通过</el-radio-button>
                            <el-radio-button label="-1">未通过</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row class="mb-20">
                    <el-alert type="info" class="theme" :closable="false" show-icon>
                        <p>说明：店铺需要审核通过并且为上线状态时，才可正常营业。</p>
                    </el-alert>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    header-row-class-name="headerRow"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="shopName" label="店铺名称" width="140" />
                    <el-table-column label="店铺图片" width="180">
                        <template slot-scope="scope">
                            <ls-image :options="{ w: '45', h: '45', br: '50' }" :src="scope.row.shopAvatar" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="contactName" label="联系人" />
                    <el-table-column prop="contactPhone" label="联系人手机" min-width="100" />
                    <el-table-column prop="productNum" label="商品数量" />
                    <el-table-column label="累计销售总额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.salesAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="salesOrderCount" label="累计销售订单数" min-width="120" />
                    <el-table-column label="累计退款金额" width="115">
                        <template slot-scope="scope">
                            <div>{{ scope.row.refundAmount | priceFilter }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == 0" class="status-wait">待审核</span>
                            <span v-else-if="scope.row.opStatus == -1" class="status-done">未通过</span>
                            <span v-else class="status-pass">通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="店铺状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                            <span v-else class="status-done">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <template v-if="scope.row.opStatus == 0">
                                    <el-link :underline="false" type="primary" @click="showAuditDialog(scope.row, scope.column, scope.$index)">
                                        审核
                                    </el-link>
                                </template>
                                <template v-else>
                                    <el-link
                                        v-if="scope.row.opStatus == 1 && scope.row.status == 1"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="updateStatus(scope.row, 0)"
                                    >
                                        下线
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.opStatus == 1 && scope.row.status == 0"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="updateStatus(scope.row, 1)"
                                    >
                                        上线
                                    </el-link>
                                </template>
                                <el-link :underline="false" type="primary">
                                    <router-link :to="{ name: 'storeDetail', query: { id: scope.row.id } }">查看</router-link>
                                </el-link>
                                <el-link :underline="false" type="primary">
                                    <el-dropdown size="medium" @command="setClick">
                                        <el-link style="padding: 0" :underline="false" type="primary">设置</el-link>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{ type: 'editStoreType', params: scope.row }">修改店铺类型</el-dropdown-item>
                                            <el-dropdown-item :command="{ type: 'setCommission', params: scope.row }">设置分佣比例</el-dropdown-item>
                                            <el-dropdown-item :command="{ type: 'editStoreStatus', params: scope.row }">
                                                编辑商品审核
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-col class="text-nowrap flex-start">
                        <el-button size="mini" class="allCheck">
                            <el-checkbox
                                v-model="checkAll"
                                label="全选"
                                size="small"
                                :indeterminate="checkHalf"
                                :disabled="!selectableList.length"
                                @change="selAll"
                            />
                        </el-button>
                        <el-button size="small" @click="batchAudit">批量审核</el-button>
                        <el-button size="small" @click="batchUpdate(1)">批量上线</el-button>
                        <el-button size="small" @click="batchUpdate(0)">批量下线</el-button>
                    </el-col>
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>

        <dialog-audit
            :id="storeId"
            ref="auditDialog"
            url="/shop/admin/shop/detail/audit"
            :user-params="{ ids: 'idList', status: 'opStatus', content: 'auditOpinion' }"
            @finish="finishAudit"
        />
        <dialog-set-commission :id="storeId" ref="dialogSetCommission" :commission-rate="storeCommissionRate" />
        <dialog-edit-store-type :id="storeId" ref="dialogEditStoreType" :shop-type="shopType" />
        <dialogEditStoreStatus :id="storeId" ref="dialogEditStoreStatus" :prod-require-audit="storeProdRequireAudit" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import DialogAudit from '@/comCommon/dialogAudit'
import dialogSetCommission from './components/dialogSetCommission'
import dialogEditStoreType from './components/dialogEditStoreType'
import dialogEditStoreStatus from './components/dialogEditStoreStatus'
import { storeManage } from '@/api/ModuleUser.js'
export default {
    name: 'StoreList',
    components: {
        DialogAudit,
        dialogSetCommission,
        dialogEditStoreType,
        dialogEditStoreStatus
    },
    mixins: [common, cud],
    data() {
        return {
            storeId: '', // 用户ID
            shopType: '', // 店铺类型
            storeProdRequireAudit: '', // 商品是否需要审核
            storeCommissionRate: '', // 佣金结算比例
            searchFilters: {
                type: ''
            },
            url: {
                getData: '/shop/admin/shop/detail/page'
            },
            isBatchAudit: null //是否批量审核 null为批量 非null及为row值时 代表单审核
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },

    methods: {
        // 显示审核
        showAuditDialog(row) {
            this.isBatchAudit = row
            this.storeId = [row.id]
            this.$refs.auditDialog.showDialog()
        },
        // 下拉选择
        setClick(params) {
            this.storeId = params.params.id
            this.shopType = params.params.shopType
            this.storeCommissionRate = params.params.commissionRate
            this.storeProdRequireAudit = params.params.prodRequireAudit
            if (params.type === 'setCommission') {
                this.$refs.dialogSetCommission.showDialog()
            } else if (params.type === 'editStoreStatus') {
                this.$refs.dialogEditStoreStatus.showDialog()
            } else {
                this.$refs.dialogEditStoreType.showDialog()
            }
        },
        // 更新用户状态状态
        updateStatus(row, i) {
            this.$confirm(
                `${row.lockFlag ? '用户下线后，用户无法在商城中购买商品。确定下线？' : '商品上线后，用户可以在商城中购买商品。确定上线？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                storeManage
                    .BatchUserStatus({
                        ids: [row.id],
                        status: i
                    })
                    .then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.getData()
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        this.$message.error(err.msg)
                    })
            })
        },
        // 批量上下线
        batchUpdate(i) {
            if (!this.mulSels?.length) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            this.$confirm(
                `${i == 0 ? '用户下线后，用户无法在商城中购买商品。确定下线？' : '商品上线后，用户可以在商城中购买商品。确定上线？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                storeManage
                    .BatchUserStatus({
                        ids: this.mulSels,
                        status: i
                    })
                    .then((res) => {
                        if (res.code == 1) {
                            this.$message.success('批量修改成功')
                            this.getData()
                        }
                    })
            })
        },
        // 批量审核
        batchAudit() {
            if (!this.mulSels?.length) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            this.isBatchAudit = null
            this.storeId = this.mulSels
            this.$refs.auditDialog.showDialog()
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },
        // 审核完成后要清空mulSels
        finishAudit() {
            if (!this.isBatchAudit) {
                //批量审核
                this.mulSels = []
                this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
            } else {
                //单审
                let index = this.mulSels.indexOf(this.storeId[0])
                if (index > -1) {
                    this.mulSels.splice(index, 1)
                    this.$refs.multipleTable.toggleRowSelection(this.isBatchAudit, false)
                }
            }
            this.storeId = this.mulSels
            this.getData()
        }
    }
}
</script>
