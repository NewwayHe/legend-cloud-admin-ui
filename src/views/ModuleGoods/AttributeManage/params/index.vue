<!-- /*
 * @Descripttion:参数管理
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 指引 -->
            <step>
                <p>
                    <span>一个商品可以设置多种参数（例：产地、分辨率、功率等）</span>
                    <imgPreview placement="bottom-start" :src="require('@/assets/images/exampleImgs/ggcsfz.png')" />
                </p>
            </step>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="参数标题">
                        <el-input v-model="searchFilters.propName" placeholder="参数标题" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20 font-0">
                    <el-button type="primary" size="medium" @click="toAdd">新增</el-button>
                    <el-button v-show="showSimilar" type="primary" size="medium" class="v-bottom" style="height: 36px" @click="showSimilarDialog">
                        <span>
                            类似导入
                            <el-popover
                                class="ml-3"
                                placement="bottom-start"
                                popper-class="atooltip"
                                trigger="hover"
                                content="类似导入：选择已有的规格，并新增一个规则，自动填充选择的规格信息"
                            >
                                <i slot="reference" class="iconfont icon-explain d-inline-block font-14" style="transform: rotate(180deg)"></i>
                            </el-popover>
                        </span>
                    </el-button>
                </el-row>

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
                    <el-table-column prop="propName" label="参数标题" />
                    <el-table-column prop="memo" label="参数副标题" />
                    <el-table-column prop="prodPropStr" label="参数值" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.prodPropStr || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop label="关联的规格参数分组" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="line-clamp1">{{ scope.row.propertyAggStr || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="showGroupDialog(scope.row)">关联规格参数分组</el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link
                                    v-if="!scope.deleteFlag"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleDel(scope.row, scope.column, scope.$index)"
                                >
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

            <dialog-similar ref="similarDialog" url="/product/admin/productProperty/page" attribute-type="P" @chooseItem="exportSimilar" />

            <dialog-group ref="groupDialog" :item-id="chooseItem" source="param" @relateGroup="saveRelatedGroup" />
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { params } from '@/api/ModuleGoods'
import DialogSimilar from '../components/dialogSimilar'
import DialogGroup from '../components/dialogGroup'
import Step from '../components/Step'

export default {
    name: 'Params',
    components: {
        DialogSimilar,
        DialogGroup,
        Step
    },
    mixins: [common, cud],
    data() {
        return {
            showSimilar: true, // 是否显示类似导入按钮
            searchFilters: {
                attributeType: 'P',
                propName: ''
            },
            url: {
                getData: '/product/admin/productProperty/page',
                delete: '/product/admin/productProperty' // 删除
            },
            chooseItem: ''
        }
    },
    watch: {
        tableList() {
            if (this.tableList.length === 0) {
                this.showSimilar = false
            } else {
                this.showSimilar = true
            }
        }
    },
    mounted() {},
    methods: {
        // 类似导入Dialog
        showSimilarDialog() {
            this.$refs.similarDialog.dialogShow()
        },

        // 显示关联分组参数Dialog
        showGroupDialog(row) {
            this.chooseItem = row.id
            this.$refs.groupDialog.dialogShow()
        },

        // 保存关联参数分组
        saveRelatedGroup(selectedRow) {
            console.log('选择保存的关联组', selectedRow)
            params
                .paramsAgg({
                    aggIdlist: selectedRow.reduce((item, next) => {
                        item.push(next.id)
                        return item
                    }, []),
                    propId: this.chooseItem
                })
                .then((res) => {
                    this.$refs.groupDialog.dialogClose()
                    this.$message.success('关联成功')
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 新增
        toAdd() {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/paramsOperate',
                query: {
                    type: 'add'
                }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/paramsOperate',
                query: {
                    type: 'edit',
                    id: row.id
                }
            })
        },

        // 类似导入
        exportSimilar(row) {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/paramsOperate',
                query: {
                    type: 'similar',
                    id: row.id
                }
            })
            this.$refs.similarDialog.dialogClose()
        }
    }
}
</script>
<style lang="scss">
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
