<!-- /*
 * @Descripttion:商品分组
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-card shadow>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="分组名称">
                        <el-input v-model="searchFilters.propName" placeholder="类目名称" />
                    </el-form-item>
                    <el-form-item label="分组类型">
                        <el-select v-model="searchFilters.type" filterable placeholder="请选择" clearable>
                            <el-option v-for="item in categoryOption" :key="item.key" :label="item.value" :value="item.key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.type" clearable filterable placeholder="请选择">
                            <el-option v-for="item in statusOption" :key="item.key" :label="item.value" :value="item.key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="table">
            <el-card class="mb-15" shadow>
                <el-row class="mb-20">
                    <step />
                </el-row>
                <el-row class="mb-20">
                    <el-button type="primary" size="small">新增一级类目</el-button>
                </el-row>
                <el-row class="mb-20">
                    <el-alert type="warning" class="theme" :closable="false" show-icon>
                        <p>
                            商品类目,用于管理商品,需要先创建一级类目,再创建二级类目,再创建三级类目
                        </p>
                    </el-alert>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="name" label="分组名称" />
                    <el-table-column label="分组类型" />
                    <el-table-column label="分组描述" />
                    <el-table-column label="操作" align="center"  fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary">编辑</el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link type="primary">关联商品</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-20">
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
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import Step from '../components/Step'

export default {
    name: 'CommodityGroup',
    components: {
        Step
    },
    mixins: [common, cud],
    data() {
        return {
            categoryOption: [
                {
                    key: 'TXT',
                    value: '系统定义分组'
                },
                {
                    key: 'TXT1',
                    value: '自定义分组'
                }
            ],
            statusOption: [
                {
                    key: '1',
                    value: '上线'
                },
                {
                    key: '0',
                    value: '下线'
                }
            ],
            searchFilters: {
                attributeType: 'S',
                propName: '',
                type: ''
            },
            url: {
                getData: '/product/admin/brand/page'
            }
        }
    },
    watch: {},
    mounted() {},
    methods: {}
}
</script>
