<!-- /*
 * @Descripttion:违规商品列表
*/ -->
<template>
    <section>
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
                        <el-button size="small" @click.stop="exportData">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="changeStatus">
                            <el-radio-button label="4">所有</el-radio-button>
                            <el-radio-button label="2">违规商品</el-radio-button>
                            <el-radio-button label="3">锁定商品</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    @sort-change="changeSort"
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" width="42" reserve-selection v-if="searchFilters.opStatus != 4"/>
                    <el-table-column label="序号" type="index" width="48" fixed="left"/>
                    <el-table-column prop="pic" label="商品信息" min-width="280" fixed="left">
                        <template slot-scope="scope">
                            <div class="d-flex a-center line-h-md font-0">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 goodPic" :underline="false" type="primary" @click="proPreview(scope.row.id)">
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
                    <el-table-column prop="skuCount" label="SKU数量"/>
                    <el-table-column prop="min_price" label="销售价" sortable="custom" width="120">
                        <template slot-scope="scope">
                            ￥{{ scope.row.price }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量" sortable="custom" />
                    <el-table-column prop="siteName" label="店铺名称" width="140"/>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == 2" class="status-veto">违规商品</span>
                            <span v-if="scope.row.opStatus == 3" class="status-veto">锁定商品</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accusationContent" label="违规下架原因" min-width="110">
                        <template slot-scope="scope">{{ scope.row.accusationContent || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="updateTime" width="140" label="更新时间">
                        <template slot-scope="scope">
                            {{ scope.row.updateTime | formatDateTimeByDash}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="online(scope.row)">上架</el-link>
                                <el-link :underline="false" type="primary" @click.stop="toUnder(scope.row, scope.row.opStatus == 2 ? 3 : 2)">
                                    修改状态
                                </el-link>
                                <el-link :underline="false" type="primary" @click="auditHistory(scope.row)">审核历史</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-col class="text-nowrap flex-start">
						<el-button size="mini" class="allCheck" v-if="searchFilters.opStatus != 4">
							<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						</el-button>
						<el-button v-if="searchFilters.opStatus == 2" size="small" @click="toBatchUnder(2)">批量锁定</el-button>
						<el-button v-if="searchFilters.opStatus == 3" size="small" @click="toBatchUnder(3)">批量下架</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>

		<el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
		    <el-form ref="myForm" :model="dialogForm.formData" label-width="98px" label-position="right" size="small">
		        <el-form-item label="操作：" >
		            <el-radio v-model="type" :label="2">违规锁定</el-radio>
		            <el-radio v-model="type" :label="3">违规下架</el-radio>
					<div class="el-form-item__error">{{ type === 3 ? '违规下架：商家可以编辑商品' : '违规锁定：商家不可以编辑商品'}}</div>
		        </el-form-item>
		        <el-form-item label="下架类型：" prop="typeId" :rules="{ required: true, message: '请选择下架类型', trigger: 'change' }">
		            <el-select v-model="dialogForm.formData.typeId" clearable placeholder="请选择">
		                <el-option v-for="item of allType" :key="item.id" :label="item.name" :value="item.id" />
		            </el-select>
		        </el-form-item>
		        <el-form-item label="处理意见：" prop="handleInfo" :rules="{ required: true, message: '请填写处理意见', trigger: 'blur' }">
		            <el-input v-model="dialogForm.formData.handleInfo" type="textarea" placeholder="处理意见" />
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
		        <ls-button size="small" type="primary" :asyncFunction="underGoods">确 定</ls-button>
		    </div>
		</el-dialog>
		<dialogAuditHistoryTable ref="auditHistoryDialog" :product-id="currentProdId" />
		<dialogPreview ref="dialogPreview" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { report, GoodsManage } from '@/api/ModuleGoods'
import dialogAuditHistoryTable from '../components/dialogAuditHistoryTable'
import dialogPreview from '@/components/iphonePreview/dialogPreview'

export default {
    name: 'ViolationsGood',
    components: {
        dialogAuditHistoryTable,
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            allType: [], // 举报类型
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                opStatus: '4'
            },
            currentProdId: '',
            shopList: [],
            brandList: [],
            auditList: [], // 提交审核的数组
            url: {
                getData: '/product/admin/product/accusationPage'
            },
            underList: [],
            type: 2
        }
    },
    watch: {},
    created() {
        if (this.$route.query.shopId) {
            this.searchFilters.shopId = this.$route.query.shopId
        }
    },
    mounted() {
        this.getShop()
        this.getBrand()
        this.getTypeAll()
    },
    methods: {
        //违规商品上架
        online(row) {
            let idList = []
            idList.push(row.id)
            this.$confirm('商品上架后，用户可以在商城中查看商品。确定上架？', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    GoodsManage.productOnline({
                        idList: idList
                    }).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '上架成功!'
                        })
                        this.getData()
                    })
                })
                .catch(() => {})
        },
        proPreview(id) {
            this.$refs.dialogPreview.showDialog({id:id})
        },
        auditHistory(row) {
            this.currentProdId = row.id
            this.$refs.auditHistoryDialog.showDialog()
        },
        // 获取所有举报类型
        getTypeAll() {
            report
                .getAccusationTypeAll()
                .then((res) => {
                    this.allType = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 打开下架
        toUnder(row, status) {
            this.type = status
            this.dialogForm.isVisible = true
            this.dialogForm.formData = {
                handleInfo: ''
            }
            this.underList = [row.id]
        },
        // 批量打开下架
        toBatchUnder(status) {
            if (!this.mulSels?.length) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.type = status
            this.dialogForm.isVisible = true
            this.dialogForm.formData = {
                handleInfo: ''
            }
            this.underList = this.mulSels
        },
        // 商品下架
        underGoods() {
            return new Promise((resolve)=>{
                this.$refs['myForm'].validate((valid) => {
                    if (valid) {
                        // 违规下架
                        const params = {
                            illegalOff: this.type == 2 ? 2 : 1,
                            ids: this.underList,
                            typeId: this.dialogForm.formData.typeId,
                            handleInfo: this.dialogForm.formData.handleInfo,
                            content: this.dialogForm.formData.handleInfo
                        }
                        report.batchAccusation(params).then((res) => {
                            if (res.code) {
                                this.$message.success(this.type == 2 ? '下架成功' : '锁定成功')
                                this.getData()
                                this.dialogForm.isVisible = false
                            }
                        }).finally(()=>{
                                return resolve()
                            })
                    } else {
                        return resolve()
                    }
                })
            })
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
        // 导出
        exportData() {
            GoodsManage.productExport({
                name: this.searchFilters.name,
                shopId: this.searchFilters.shopId,
                status: this.searchFilters.status,
                brandId: this.searchFilters.brandId,
                opStatus: this.searchFilters.opStatus,
                productIdList: this.mulSels.join(),
            })
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
            this.getData()
        }
    }
}
</script>
