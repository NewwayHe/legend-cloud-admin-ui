<!-- /*
 * @Descripttion: 行业管理
*/ -->
<template>
    <section class="">
        <el-card>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="行业">
                        <el-input v-model="searchFilters.name" placeholder="请输入行业" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                   <el-col><el-button type="primary" size="medium" @click="handleCreate">新增</el-button></el-col>
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
                        <empty empty-type="pro" text="暂无行业" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" label="行业" />
                    <el-table-column prop="seq" label="排序" />
                    <el-table-column label="操作" fixed="right" width="200px">
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
                    <el-form-item label="行业" prop="name">
                        <el-input v-model="dialogForm.formData.name" placeholder="行业" maxlength="20" show-word-limit />
                    </el-form-item>
                    <el-form-item label="排序" prop="seq">
						<lsInput v-model="dialogForm.formData.seq" :precision="0" :min="1" :max="9999999"/>
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
    name: 'Industry',
    components: { },
    mixins: [common, cud],
    data() {
        return {
            dialogForm: {
                formRule: {
                    name: [
                        {
                            required: true,
                            message: '请输入行业名称',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            url: {
                getData: '/shop/admin/industry/directory/page',
                update: '/shop/admin/industry/directory',
                delete: '/shop/admin/industry/directory',
                create: '/shop/admin/industry/directory'
            }
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },
    methods: {}
}
</script>
