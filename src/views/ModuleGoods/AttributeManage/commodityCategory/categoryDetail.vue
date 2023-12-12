<template>
    <section class="mb-50">
        <div class="table">
            <el-card shadow>
                <el-table
                    ref="table"
                    v-loading="tableDetailListLoading"
                    border
                    :data="categoryTable"
                    class="w-100 mb-50"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="name" label="类目类型" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.grade == 1" class="ml-10">一级类目</span>
                            <span v-if="scope.row.grade == 2" class="ml-10">二级类目</span>
                            <span v-if="scope.row.grade == 3" class="ml-10">三级类目</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="类目名称" align="center" />
                    <el-table-column prop="seq" label="排序" align="center" />
                    <el-table-column prop="icon" label="PC端图标" align="center">
                        <template slot-scope="scope">
                            <ls-image class="v-middle" :src="scope.row.icon" :options="{ w: '50', h: '50', br: '4' }"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="aggName" label="关联规格参数分组" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.aggName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="returnValidPeriod" label="退货有效时间" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.returnValidPeriod">{{ scope.row.returnValidPeriod }}天</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="status-done">下线</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                        </template>
                    </el-table-column>
                </el-table>

                <!--列表-->
                <p class="font text-333 mb-20">类目下的商品：</p>
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
                    <el-table-column label="序号" type="index" width="48"/>
                    <el-table-column prop="pic" label="商品主图">
                        <template slot-scope="scope">
                            <ls-image class="v-middle" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称" show-overflow-tooltip width="280">
                        <template slot-scope="scope">
                            <el-link class="line-clamp1" :underline="false" type="primary">{{ scope.row.productName }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌">
                        <template slot-scope="scope">{{ scope.row.brandName || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价" width="224">
                        <template slot-scope="scope">
							￥{{ scope.row.price }}
						</template>
                    </el-table-column>
                    <el-table-column prop="buys" label="销量"/>
                    <el-table-column prop="shopName" label="店铺名称" width="140"/>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="status-done">下架</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上架</span>
                            <span v-if="scope.row.status == 2" class="status-veto">违规商品</span>
                            <span v-if="scope.row.status == 3" class="status-wait">待审核</span>
                            <span v-if="scope.row.status == 4" class="status-veto">审核拒绝</span>
                            <span v-if="scope.row.status == -1" class="status-veto">商家删除</span>
                            <span v-if="scope.row.status == -2" class="status-veto">商家永久删除</span>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" class="mt-30">
                    <el-pagination
                        :page-sizes="[10, 30, 50, 100, 500, 1000]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page.curPage"
                        :total="tableTotal"
                        @size-change="pageSizeChange"
                        @current-change="currentPageChange"
                    />
                </el-row>
            </el-card>
        </div>
        <Sticky>
            <el-button size="small" @click="goBack">返回</el-button>
        </Sticky>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { category } from '@/api/ModuleGoods'

export default {
    name: 'CategoryDetail',
    components: {
    },
    mixins: [common, cud],
    data() {
        return {
            tableDetailListLoading: false, // 表格请求loading
            categoryTable: [], // 类目信息
            id: '',
            url: {
                getData: '/product/admin/category/product?categoryId=' + this.$route.query.id
            },
            searchFilters: {
                categoryId: this.$route.params.id
            }
        }
    },
    created() {
        this.isMounted = true
    },
    mounted() {
        this.id = this.$route.query.id
        this.init(this.$route.query.id)
    },
    methods: {
        // 初始化页面
        init(id) {
            console.log(id, 'id')
            this.tableDetailListLoading = true
            category
                .detail(id)
                .then((res) => {
                    this.tableDetailListLoading = false
                    this.categoryTable = [res.data]
                })
                .catch((err) => {
                    this.tableDetailListLoading = false
                    console.log(err)
                })
        },

        // 返回列表页
        goBack() {
            this.$router.push({ name: 'commodityCategory' })
        }
    }
}
</script>
