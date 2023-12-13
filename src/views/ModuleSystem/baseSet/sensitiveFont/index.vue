<!-- /*
 * @Descripttion:敏感字配置
*/ -->
<template>
    <section class="">
        <el-card>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="敏感字">
                        <el-input v-model="searchFilters.words" placeholder="请输入敏感字" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="handleCreate">新增</el-button>
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
                    <el-table-column prop="words" label="敏感字" />
                    <el-table-column label="操作" align="center" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row class="mt-30" type="flex" justify="end">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </div>
            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.title" :visible.sync="dialogForm.isVisible" custom-class="dialog-form" width="420px">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="95px"
                    label-position="right"
                    size="small"
                >
                    <el-form-item label="标题" prop="words">
                        <el-input v-model="dialogForm.formData.words" placeholder="标题" maxlength="20" show-word-limit />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                    <el-button v-ls-loading size="small" type="primary" @click.stop="debounceSubmit('myForm')">确 定</el-button>
                </div>
            </el-dialog>
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
            dialogForm: {
                formRule: {
                    words: [
                        {
                            required: true,
                            message: '请输入敏感字',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            url: {
                getData: '/basic/admin/sensitiveWord/getSensitiveWord',
                update: '/basic/admin/sensitiveWord',
                delete: '/basic/admin/sensitiveWord',
                create: '/basic/admin/sensitiveWord'
            }
        }
    },
    mounted() {},
    methods: {}
}
</script>
