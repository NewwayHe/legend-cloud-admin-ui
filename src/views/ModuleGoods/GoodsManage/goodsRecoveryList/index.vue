<!-- /*
 * @Descripttion:商品回收站
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{padding:`20px 20px 0 20px`}">
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
                        <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.delStatus" size="large" @change="changeStatus">
                            <el-radio-button label="-1">被删除商品</el-radio-button>
                            <el-radio-button label="-2">永久删除商品</el-radio-button>
                        </el-radio-group>
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
                    @sort-change="changeSort"
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                    :key="searchFilters.delStatus"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" width="42" reserve-selection v-if="searchFilters.delStatus != -1"/>
                    <el-table-column label="序号" type="index" width="48"/>
                    <el-table-column prop="pic" label="商品信息" width="280">
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
                    <el-table-column prop="brandName" label="品牌" >
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="skuCount" label="SKU数量" />
                    <el-table-column prop="min_price" label="销售价" sortable="custom">
                        <template slot-scope="scope">
                            ￥{{ scope.row.price }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量" sortable="custom" />
                    <el-table-column prop="stocks" label="库存" sortable="custom" />
                    <el-table-column prop="siteName" label="店铺名称" width="140"/>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.delStatus === 1 ? 'status-done' : 'status-veto'">
                                {{ scope.row.delStatus === -2 ? '永久删除' : scope.row.delStatus === -1 ? '删除' : '正常' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" width="140" label="更新时间">
                        <template slot-scope="scope">
							{{ scope.row.updateTime | formatDateTimeByDash}}
						</template>
                    </el-table-column>
                    <el-table-column v-if="searchFilters.delStatus != -1" label="操作" fixed="right" width="180" >
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="updateDelStatus(scope.row, false)">永久删除</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-col class="text-nowrap flex-start">
						<el-button v-if="searchFilters.delStatus != -1" size="mini" class="allCheck">
						    <el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						</el-button>
						<el-button v-if="searchFilters.delStatus != -1" size="small" @click="batchUpdate(false)">批量永久删除</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
		<dialogPreview ref="dialogPreview"/>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import dialogPreview from '@/components/iphonePreview/dialogPreview'
import { GoodsManage } from '@/api/ModuleGoods'
export default {
    name: 'GoodsRecoveryList',
    components: {
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                shopId: '',
                brandId: '',
                delStatus: '-1'
            },
            shopList: [],
            brandList: [],
            url: {
                getData: '/product/admin/product/page',
                delete: '/product/admin/product/batchUpdateDelStatus',
                mulDel: '/product/admin/product/batchUpdateDelStatus',
                getExcel: '/product/admin/product/recycleBin/export'
            },
            underList: [],
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
    },
    methods: {
        proPreview(row) {
            this.$refs.dialogPreview.showDialog({id:row.id,viewDraft:[0,-1,'0','-1'].includes(row.opStatus)?true:false});
        },
        // 获取所有店铺
        getShop() {
            GoodsManage.getShopAllOnline()
                .then((res) => {
                    if (res.data) {
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
        // 更新被删除商品状态
        updateDelStatus(row, flag) {
            this.$confirm(
                `${flag ? '商品恢复后统一设置为下架状态，需要手动上架，确定恢复商品？' : '永久删除商品后不可恢复，确定删除？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                console.log('ok')
                GoodsManage.batchUpdateDelStatus({
                    ids: [row.id],
                    status: Number(flag ? 1 : -3)
                }).then((res) => {
                    if (res.code) {
                        this.$message.success('操作成功')
                        this.getData()
                    }
                })
            })
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            // 由于在el-table上使用key值来动态渲染选择列 导致了clearSelection清除的不是同一个table 
            // 所以改为清除数组有效
            // this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
            this.mulSels = []
            this.getData()
        },
        // 批量更新商品
        batchUpdate(status) {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }

            this.$confirm(`${status ? '是否批量恢复商品？' : '是否批量永久删除商品'}`, '消息确认', {
                type: 'warning'
            })
                .then(() => {
                    GoodsManage.batchUpdateDelStatus({
                        ids: this.mulSels,
                        status: status ? 1 : -3
                    }).then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.getData()
                        }
                    })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        }
    }
}
</script>
