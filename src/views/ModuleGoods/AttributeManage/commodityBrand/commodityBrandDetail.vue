<template>
    <!-- mb-50 因为底部有操作按钮 -->
    <section class="mb-50">
        <div class="table">
            <el-card shadow>
                <el-table
                    ref="table"
                    v-loading="tableDetailListLoading"
                    :data="brandTable"
                    class="w-100 mb-50"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="brandName" label="品牌名称" align="center" />
                    <el-table-column prop="brandPic" label="品牌LOGO" align="center">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '4' }"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bigImage" label="品牌大图" align="center">
                        <template slot-scope="scope">
                            <ls-image
                                style="vertical-align: middle"
                                :src="scope.row.bigImage"
                                :options="{ w: '50', h: '50', br: '4' }"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="brief" label="品牌介绍" align="center" />
                    <el-table-column prop="commendFlag" label="是否推荐" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.commendFlag ? '是' : '否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="status-done">下线</span>
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                            <span v-if="scope.row.status == -1" class="status-wait">待审核</span>
                            <span v-if="scope.row.status == -2" class="status-veto">未通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="审核时间" align="center" />
                </el-table>

                <!--列表-->
                <p class="font text-333 mb-20">关联商品：</p>
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
                            <el-link class="line-clamp1" :underline="false" type="primary">{{ scope.row.name }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="店铺名称" width="140"/>
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
import { commodityBrandDetail } from '@/api/ModuleGoods'

export default {
    name: 'CommodityBrandDetail',
    components: {
    },
    mixins: [common, cud],
    data() {
        return {
            tableDetailListLoading: false, // 表格请求loading
            brandTable: [], // 店铺信息
            id: '',
            url: {
                getData: '/product/admin/product/page'
            },
            searchFilters: {
                brandId: this.$route.query.id,
				status:3//-10：未发布; 0：下架、1：上架、3：全部
            }
        }
    },
    mounted() {
        this.getData()
        this.id = this.$route.query.id
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        // 初始化页面
        init() {
            this.tableDetailListLoading = true
            commodityBrandDetail
                .brandDetail(this.id)
                .then((res) => {
                    this.tableDetailListLoading = false
                    this.brandTable = [res.data]
                })
                .catch((err) => {
                    this.tableDetailListLoading = false
                    console.log(err)
                })
        },
        goBack() {
            this.$router.push({
                name: 'commodityBrand'
            })
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