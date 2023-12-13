<!-- /*
 * @Descripttion:浏览记录
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="页面">
                        <el-select v-model="searchFilters.page" placeholder="请选择" clearable>
                            <el-option label="商品页" :value="0" />
                            <el-option label="店铺页" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
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
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column label="页面">
                        <template slot-scope="scope">
                            {{ scope.row.page == 0 ? '商品' : '店铺' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="productName" label="商品名称" width="280">
                        <template slot-scope="scope">
                            {{ scope.row.productName == null ? '-' : scope.row.productName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ip" label="ip" />
                    <el-table-column label="国家">
                        <template slot-scope="scope">
                            {{ scope.row.country == null ? '未知' : scope.row.country }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="area" label="地区" />
                    <el-table-column prop="createTime" label="日期" width="140" />
                </el-table>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </LsSticky>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    components: {},
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/user/admin/user/detail/visitLogPage'
            },
            isMounted: true,
            searchFilters: { productName: '', page: '', userId: '' }
        }
    },
    watch: {},
    created() {
        this.searchFilters.userId = this.$route.query.userId
    },
    mounted() {},
    methods: {}
}
</script>
