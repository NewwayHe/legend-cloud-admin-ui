<template>
    <!-- mb-50因为底部有返回操作 -->
    <section class="mb-50">
        <el-card shadow>
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" placeholder="请输入" />
                    </el-form-item>

                    <el-form-item label="店铺名称">
                        <el-input v-model="searchFilters.shopName" placeholder="请输入" />
                    </el-form-item>

                    <el-form-item>
                        <el-button size="small" @click.stop="doSearch">搜索</el-button>
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
                    <el-table-column prop="pic" label="商品主图">
                        <template slot-scope="scope">
                            <ls-image class="v-middle" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="prodName" label="商品名称" show-overflow-tooltip width="280">
                        <template slot-scope="scope">
                            <el-link class="line-clamp1" :underline="false" type="primary">{{ scope.row.productName }}</el-link>
                        </template>
                    </el-table-column>

                    <el-table-column prop="shopName" label="店铺名称" width="140">
                        <template slot-scope="scope">{{ scope.row.shopName || '-' }}</template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                删除关联
                            </el-link>
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
            </div>
        </el-card>
        <Sticky>
            <el-button size="small" @click="goBack">返回</el-button>
        </Sticky>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { category } from '@/api/ModuleGoods'

export default {
    name: 'GroupDetail',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            tableDetailListLoading: false, // 表格请求loading
            categoryTable: [], // 类目信息
            id: '',
            url: {
                getData: '/product/admin/product/group/product',
                delete: '/product/admin/product/group/relation'
            },
            searchFilters: {
                groupId: this.$route.query.id
            }
        }
    },
    created() {
        this.isMounted = true
        this.id = this.$route.query.id
        this.init(this.$route.query.id)
    },
    methods: {
        // 初始化页面
        init(id) {
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
            this.$router.go(-1) //返回上一层
        }
    }
}
</script>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
