<!-- /*
 * @Descripttion:系统日志
*/ -->
<template>
    <section class="">
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="参数名称">
                        <el-select v-model="searchFilters.groupBy" clearable placeholder="请选择">
                            <el-option label="所有配置" value="" />
                            <el-option label="系统配置" value="SYS" />
                            <el-option label="商城配置" value="SHOP" />
                            <el-option label="短信配置" value="SMS" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnResetSearch">重置</el-button>
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
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="paramKey" label="参数key" />
                    <el-table-column prop="paramValue" label="参数值" />
                    <el-table-column prop="paramName" label="参数描述" />
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="edit">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </div>
            <el-dialog :title="dialogForm.title" custom-class="dialog-form" width="420px" :visible.sync="dialogForm.isVisible">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="95px"
                    label-position="right"
                    size="small"
                >
                    <el-form-item label="参数描述" prop="paramName">
                        <el-input v-model="dialogForm.formData.paramName" placeholder="参数描述" />
                    </el-form-item>
                    <el-form-item label="参数key" prop="paramKey">
                        <span>{{ dialogForm.formData.paramKey }}</span>
                    </el-form-item>
                    <el-form-item label="参数值" prop="paramValue">
                        <el-input v-model="dialogForm.formData.paramValue" placeholder="参数值" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: 'DataDict',
    components: { },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/basic/admin/system/param/page',
                update: '/basic/admin/system/param'
            },
            dialogForm: {
                formRule: {
                    paramName: [
                        {
                            required: true,
                            message: '请输入参数描述',
                            trigger: 'blur'
                        }
                    ],
                    paramValue: [
                        {
                            required: true,
                            message: '请输入参数值',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        }
    },
    mounted() {},
    methods: {}
}
</script>
