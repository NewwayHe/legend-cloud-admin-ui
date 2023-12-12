<!-- /*
 * @Descripttion:商品审核列表
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.name" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="店铺名称">
                        <el-select v-model="searchFilters.shopId" clearable filterable placeholder="请选择">
                            <el-option v-for="item in shopList" :key="item.id" :label="item.shopName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="searchFilters.brandId" clearable filterable placeholder="请选择">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <!-- <el-button size="small" @click.stop="exportData">导出数据</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="changeStatus">
                            <el-radio-button label="0">待审核商品</el-radio-button>
                            <!-- <el-radio-button label="1">审核通过商品</el-radio-button> -->
                            <el-radio-button label="-1">审核拒绝商品</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!--列表-->
				<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10" :underline="false" type="primary" @click="proPreview(scope.row)">
                                            <span class="line-clamp2">{{ scope.row.name }}</span>
                                        </el-link>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="skuCount" label="SKU数量" />
                    <el-table-column sortable prop="price" label="销售价" width="224">
                        <template slot-scope="scope">
                            <span>￥{{ scope.row.price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="buys" label="销量" />
                    <el-table-column prop="siteName" label="店铺名称" width="140"/>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == -1 || scope.row.draftStatus == -1" class="status-veto">审核不通过</span>
                            <span v-if="scope.row.draftStatus == 0" class="status-wait">待审核</span>
                            <span v-if="(scope.row.opStatus == 1 && scope.row.draftStatus==null) || scope.row.draftStatus == 1" class="status-pass">通过审核</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" width="140" label="更新时间">
                        <template slot-scope="scope">
							{{ scope.row.updateTime | formatDateTimeByDash}}
						</template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="140">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link v-if="scope.row.draftStatus === 0" :underline="false" type="primary" @click.stop="auditItem(scope.row)">审核</el-link>
                                <el-link :underline="false" type="primary" @click="auditHistory(scope.row.id)">审核历史</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-col class="text-nowrap flex-start">
						<template v-if="searchFilters.opStatus == 0">
						    <el-button size="mini" class="allCheck">
						        <el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						    </el-button>
						    <el-button size="small" @click="batchAudit">批量审核</el-button>
						</template>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
		<dialog-audit
		    :id="auditList"
		    ref="auditDialog"
		    url="/product/admin/product/audit"
		    :user-params="{ ids: 'idList', status: 'opStatus', content: 'auditOpinion' }"
		    @finish="finish"
		/>
		<dialogAuditHistoryTable ref="auditHistoryDialog" :product-id="currentProdId" />
		<dialogPreview ref="dialogPreview"/>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { GoodsManage } from '@/api/ModuleGoods'
import DialogAudit from '@/comCommon/dialogAudit'
import groupManage from '../components/groupManages'
import dialogAuditHistoryTable from '../components/dialogAuditHistoryTable'
import dialogPreview from '@/components/iphonePreview/dialogPreview'

export default {
    name: 'AduitList',
    components: {
        DialogAudit,
        groupManage,
        dialogAuditHistoryTable,
        dialogPreview,
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                opStatus: '0' // 审核状态
            },
            currentProdId: '',
            shopList: [],
            brandList: [],
            auditList: [], // 提交审核的数组
            url: {
                getData: '/product/admin/product/auditPage'
            }
        }
    },
    watch: {
    },
    mounted() {
        this.getShop()
        this.getBrand()
    },
    methods: {
        proPreview(row) {
            this.$refs.dialogPreview.showDialog({id:row.id,viewDraft:true});
        },
        auditHistory(id) {
            this.currentProdId = id
            this.$refs.auditHistoryDialog.showDialog()
        },
        // 获取所有店铺
        getShop() {
            GoodsManage.getShopAllOnline()
                .then((res) => {
                    if (res.code) {
                        this.shopList = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error(err.msg)
                })
        },

        // 获取所有品牌
        getBrand() {
            GoodsManage.getBrandAllOnline()
                .then((res) => {
                    if (res.code) {
                        this.brandList = res.data
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error(err.msg)
                })
        },

        showAuditDialog() {
            this.$refs.auditDialog.showDialog()
        },

        // 审核单个
        auditItem(row) {
            this.auditList = []
            this.auditList.push(row.id)
            console.log('one', this.auditList)
            this.showAuditDialog()
        },

        // 批量审核
        batchAudit() {
            // console.log(this.mulSels)
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.auditList = this.mulSels
            console.log('barch', this.auditList)
            this.showAuditDialog()
        },

        // 更新商品状态
        updateStatus(row) {
            this.$confirm(
                `${row.status ? '商品下架后，用户无法在商城中查看商品。确定下架？' : '商品上架后，用户可以在商城中查看商品。确定上架？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    GoodsManage.updateStatus({
                        id: row.id,
                        status: Number(!row.status)
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
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 导出
        exportData() {
            GoodsManage.productExport(
                {
                    name: this.searchFilters.name,
                    shopId: this.searchFilters.shopId,
                    status: this.searchFilters.status,
                    brandId: this.searchFilters.brandId
                },
                this
            )
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
            this.getData()
        },
		finish(){
			this.getData()
			this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
		} 
    }
}
</script>
