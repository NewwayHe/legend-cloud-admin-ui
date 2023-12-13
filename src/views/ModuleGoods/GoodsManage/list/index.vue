<!-- /*
 * @Descripttion:商品列表
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称"><el-input v-model="searchFilters.name" placeholder="商品名称" /></el-form-item>
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
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col class="flex-start">
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button label="3">所有商品</el-radio-button>
                            <el-radio-button label="1">上架商品</el-radio-button>
                            <el-radio-button label="0">下架商品</el-radio-button>
                            <el-radio-button label="-10">未发布商品</el-radio-button>
                        </el-radio-group>
                        <el-button class="ml-15" type="primary" size="medium" @click="showGroupDialog()">分组管理</el-button>
                    </el-col>
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
                    @sort-change="changeSort"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" width="42" reserve-selection />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.name">
                                    <template slot="reference">
                                        <el-link class="ml-10 goodPic" :underline="false" type="primary" @click="proPreview(scope.row)">
                                            <span class="line-clamp2">{{ scope.row.name }}</span>
                                        </el-link>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌">
                        <template slot-scope="scope">
                            {{ scope.row.brandName || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="skuCount" label="SKU数量" width="80" />
                    <el-table-column prop="min_price" label="销售价" sortable="custom" width="180">
                        <template slot-scope="scope">￥{{ scope.row.price }}</template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量" sortable="custom" />
                    <el-table-column prop="stocks" label="库存" sortable="custom" />
                    <el-table-column prop="siteName" label="店铺名称" width="140" />
                    <el-table-column prop="updateTime" width="140" label="更新时间">
                        <template slot-scope="scope">
                            {{ scope.row.updateTime | formatDateTimeByDash }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == -10" class="status-veto">未提审</span>
                            <span v-if="scope.row.status == 0" class="status-veto">下架</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上架</span>
                            <span v-if="scope.row.status == 2" class="status-veto">违规商品</span>
                            <span v-if="scope.row.status == -1" class="status-veto">商家删除</span>
                            <span v-if="scope.row.status == -2" class="status-veto">商家永久删除</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="draftStatus" label="草稿状态" align="left">
                        <template slot-scope="scope">
                            <!-- -10:未发布 -1: 拒绝、0: 待审核、1: 通过 -->
                            <template v-if="[-10, 0, -1, 1].includes(scope.row.draftStatus)">
                                <span v-if="scope.row.draftStatus == -10" class="status-veto">未发布</span>
                                <span v-if="scope.row.draftStatus == 0" class="status-veto">待审核</span>
                                <span v-if="scope.row.draftStatus == -1" class="status-veto">拒绝</span>
                                <span v-if="scope.row.draftStatus == 1" class="status-pass">通过</span>
                            </template>
                            <span v-else>没有草稿</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="备注" align="center" show-overflow-tooltip width="150px">
                        <template slot-scope="scope">
                            <el-tag v-for="item in scope.row.tagList" :key="item" class="ml-5">{{ item }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="140">
                        <template slot-scope="scope">
                            <span class="table__action flex-start">
                                <el-link v-if="scope.row.status == 1" :underline="false" type="primary" @click.stop="toUnder(scope.row)">
                                    下架
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
                        <template v-if="searchFilters.status == 0 || searchFilters.status == 1 || searchFilters.status == 3">
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
                            <el-button v-if="searchFilters.status != 0" size="small" @click="batchUpdate(0)">批量下架</el-button>
                        </template>
                    </el-col>
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </el-card>

        <el-dialog
            :title="dialogForm.title"
            custom-class="dialog-form-small"
            :visible.sync="dialogForm.isVisible"
            destroy-on-close
            :close-on-click-modal="false"
        >
            <el-form ref="myForm" :model="dialogForm.formData" label-width="98px" label-position="right" size="small">
                <el-form-item label="操作：">
                    <el-radio v-model="type" :label="1">违规下架</el-radio>
                    <el-radio v-model="type" :label="2">违规锁定</el-radio>
                    <div class="el-form-item__error">{{ type === 1 ? '违规下架：商家可以编辑商品' : '违规锁定：商家不可以编辑商品' }}</div>
                </el-form-item>
                <el-form-item label="下架类型：" prop="typeId" :rules="{ required: true, message: '请选择下架类型', trigger: 'change' }">
                    <el-select v-model="dialogForm.formData.typeId" clearable placeholder="请选择">
                        <el-option v-for="item of allType" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理意见：" prop="handleInfo" :rules="{ required: true, message: '请填写处理意见', trigger: 'blur' }">
                    <el-input
                        v-model="dialogForm.formData.handleInfo"
                        type="textarea"
                        placeholder="处理意见"
                        maxlength="50"
                        show-word-limit
                        autosize
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="underGoods">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分组管理 -->
        <group-manage ref="groupDialog" :show-tip="false" @relateGroup="saveRelatedGroup" />

        <dialog-audit :id="mulSels" ref="auditDialog" url="/product/admin/product/batchUpdateStatus" :audit-id-list="auditList" @finish="getData" />

        <dialogAuditHistoryTable ref="auditHistoryDialog" :product-id="currentProdId" />

        <dialogPreview ref="dialogPreview" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { report, GoodsManage } from '@/api/ModuleGoods'
import DialogAudit from '@/comCommon/dialogAudit'
import groupManage from '../components/groupManages'
import dialogAuditHistoryTable from '../components/dialogAuditHistoryTable'
import dialogPreview from '@/components/iphonePreview/dialogPreview'

export default {
    name: 'GoodsManageList',
    components: {
        DialogAudit,
        groupManage,
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
                opStatus: '1',
                status: '3' // 商品状态
            },
            shopList: [],
            brandList: [],
            auditList: [], // 提交审核的数组
            url: {
                getData: '/product/admin/product/page',
                getExcel: '/product/admin/product/export'
            },
            underList: [],
            singleUnder: null, //单行下架时记录当前行 用于清除当前行的勾选
            type: 1,
            currentProdId: ''
        }
    },
    watch: {},
    activated() {},
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
        proPreview(row) {
            this.$refs.dialogPreview.showDialog({ id: row.id, viewDraft: [0, -1, '0', '-1'].includes(row.opStatus) ? true : false })
        },
        auditHistory(row) {
            this.currentProdId = row.id
            this.$refs.auditHistoryDialog.showDialog()
        },
        // 获取所有举报类型
        getTypeAll() {
            report.getAccusationTypeAll().then((res) => {
                if (res.code) {
                    this.allType = res.data
                }
            })
        },
        // 打开下架
        toUnder(row) {
            const { status } = row
            this.type = 2
            this.dialogForm.title = status == 0 ? '上架' : status == 1 ? '下架' : ''
            this.dialogForm.formData = {
                handleInfo: ''
            }
            this.singleUnder = row
            this.underList = [row.id]
            this.dialogForm.isVisible = true
        },
        // 批量打开下架
        toBatchUnder() {
            if (!this.mulSels?.length) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.dialogForm.isVisible = true
            this.dialogForm.formData = {
                handleInfo: ''
            }
            this.underList = this.mulSels
        },
        // 商品下架
        underGoods() {
            this.$refs['myForm'].validate((valid) => {
                if (valid) {
                    // 违规下架
                    const params = {
                        illegalOff: this.type,
                        ids: this.underList,
                        typeId: this.dialogForm.formData.typeId,
                        handleInfo: this.dialogForm.formData.handleInfo,
                        content: this.dialogForm.formData.handleInfo
                    }
                    report.batchAccusation(params).then((res) => {
                        if (res.code) {
                            !!this.singleUnder && this.$refs.multipleTable.toggleRowSelection(this.singleUnder, false) && (this.singleUnder = null)
                            this.$message.success(this.type == 1 ? '下架成功' : '锁定成功')
                            this.getData()
                            this.dialogForm.isVisible = false
                        }
                    })
                }
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

        // 显示审核Dialog
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
            console.log(this.mulSels)
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.auditList = []
            this.mulSels.forEach((ele) => {
                this.auditList.push(ele.id)
            })
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
            ).then(() => {
                GoodsManage.batchUpdateStatus({
                    ids: [row.id],
                    status: Number(!row.status)
                }).then((res) => {
                    if (res.code) {
                        this.$message.success('操作成功')
                        this.getData()
                    }
                })
            })
        },

        // 批量上下架
        batchUpdate(status) {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }

            this.$confirm(
                `${status ? '商品上架后，用户可以在商城中查看商品。确定上架？' : '商品下架后，用户无法在商城中查看商品。确定下架？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    GoodsManage.batchUpdateStatus({
                        ids: this.mulSels,
                        status: status
                    })
                        .then((res) => {
                            if (res.code) {
                                this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
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
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.$refs.multipleTable.clearSelection() //清除表格选择勾选行
            this.getData()
        },

        // 保存商品关联分组
        saveRelatedGroup(selectedRow) {
            console.log('selectedRow........', selectedRow)
            const prodIdsArry = []
            selectedRow.forEach((item) => {
                prodIdsArry.push(item.id)
            })
            let x1 = prodIdsArry.map(String)
            x1 = x1.join(',')

            const mulSels = this.mulSels.join(',')

            GoodsManage.relationGroup({
                groupIds: x1,
                productIds: mulSels
            })
                .then((res) => {
                    console.log(res)
                    this.$refs.groupDialog.dialogClose()
                    this.$message.success('关联成功')
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 弹出分组管理弹窗
        showGroupDialog() {
            console.log('.............%o', this.mulSels)
            if (!this.mulSels?.length) {
                this.$message.warning('请选择一项商品')
                return
            }
            this.$refs.groupDialog.dialogShow()
        }
    }
}
</script>
