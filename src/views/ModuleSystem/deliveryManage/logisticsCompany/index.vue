<!-- /*
 * @Descripttion: 配送管理->物流公司
*/ -->
<template>
    <section>
        <el-card>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="公司名称">
                        <el-input v-model="searchFilters.name" placeholder="公司名称" />
                    </el-form-item>
                    <el-form-item label="公司编码">
                        <el-input v-model="searchFilters.companyCode" placeholder="公司编码" />
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
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" label="公司名称" />
                    <el-table-column prop="companyHomeUrl" label="公司网址" />
                    <el-table-column prop="companyCode" label="公司编码" />
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
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
            <el-alert type="warning" class="theme mt-20" :closable="false">
                <div style="line-height: 30px" class="text-999">
                    <p class="font-16 font-weight">说明</p>
                    <p>可以创建物流公司信息，用于设置配送方式模板；</p>
                </div>
            </el-alert>
            <!-- 新增-编辑 -->
            <el-dialog custom-class="dialog-form-small" :title="dialogForm.title" :visible.sync="dialogForm.isVisible">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    size="small"
                    label-width="98px"
                    label-position="right"
                >
                    <el-form-item label="物流名称：" prop="name">
                        <el-input v-model="dialogForm.formData.name" placeholder="例：顺丰速运" />
                    </el-form-item>
                    <el-form-item label="公司网址：" prop="companyHomeUrl">
                        <el-input v-model="dialogForm.formData.companyHomeUrl" placeholder="例：https://www.sf-express.com" />
                    </el-form-item>
                    <el-form-item label="公司编号：" prop="companyCode">
                        <el-input v-model="dialogForm.formData.companyCode" placeholder="例：shunfeng" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button :underline="false" type="primary" size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                    <el-button v-ls-loading :underline="false" type="primary" size="small" @click.stop="debounceSubmit('myForm')">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: 'LogisticsCompany',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                companyCode: ''
            },
            dialogForm: {
                formRule: {
                    name: [
                        {
                            required: true,
                            message: '请输入物流名称',
                            trigger: 'blur'
                        }
                    ],
                    companyHomeUrl: [
                        {
                            required: true,
                            message: '请输入公司网址',
                            trigger: 'blur'
                        }
                    ],
                    companyCode: [
                        {
                            required: true,
                            message: '请输入公司编号',
                            trigger: 'blur'
                        }
                    ],
                    queryUrl: [
                        {
                            required: true,
                            message: '请输入物流接口',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            url: {
                getData: '/order/admin/logistics/company/page',
                update: '/order/admin/logistics/company',
                delete: '/order/admin/logistics/company',
                create: '/order/admin/logistics/company'
            }
        }
    },
    mounted() {},
    methods: {}
}
</script>
