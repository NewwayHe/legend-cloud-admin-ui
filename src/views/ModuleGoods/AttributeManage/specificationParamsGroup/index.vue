<!-- /*
 * @Descripttion:规格参数管理
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 指引 -->
			<step><p><span>创建规格参数组，关联规格、参数、参数组、品牌后，将该规格参数分组关联到类目。</span></p></step>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" label-width="120px">
                    <el-form-item label="规格参数分组标题">
                        <el-input v-model="searchFilters.name" placeholder="规格名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="toAdd">新增</el-button>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48"/>
                    <el-table-column prop="name" label="规格参数分组标题" show-overflow-tooltip/>
                    <el-table-column prop="specificationStr" label="关联规格" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.specificationStr || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paramStr" label="关联参数" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.paramStr || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paramStr" label="关联参数组" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.paramGroupStr || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandStr" label="关联品牌" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.brandStr || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="categoryStr" label="关联类目" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.categoryStr || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="250" >
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="checkDetail(scope.row)">查看</el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
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
				</LsSticky>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import Step from '../components/Step'

export default {
    name: 'SpecificationParamsGroup',
    components: {
        Step
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: ''
            },
            url: {
                getData: '/product/admin/productPropertyAgg/page',
                delete: '/product/admin/productPropertyAgg' // 删除
            }
        }
    },
    mounted() {},
    methods: {
        // 查看详情
        checkDetail(row) {
            this.$router.push({
                name: `speParGroupDetail`,
                query: {
                    id: row.id
                }
            })
        },

        // 新增
        toAdd() {
            this.$router.push({
                name: 'speParaGroupOper',
                query: {
                    type: 'add'
                }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                name: 'speParaGroupOper',
                query: {
                    id: row.id,
                    type: 'edit'
                }
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