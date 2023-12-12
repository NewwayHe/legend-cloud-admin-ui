<!--
    帮助文章
-->
<template>
    <section>
        <el-card>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="帮助栏目">
                        <el-select v-model="searchFilters.newsCategoryId" clearable filterable placeholder="请选择">
                            <el-option v-for="item in newsCategoryList" :key="item.id" :label="item.newsCategoryName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="searchFilters.newsTitle" placeholder="标题" />
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                            <el-option label="上线" :value="1" />
                            <el-option label="下线" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table">
                <!--列表-->
                <el-row class="mb-20">
                    <el-col>
                        <el-button type="primary" size="medium" @click="toAdd">新增</el-button>
                    </el-col>
                </el-row>
                <el-row class="mb-20">
                    <el-alert type="info" class="theme" :closable="false" show-icon>
                        <p>新增链接跳转，为新增文章的第二种方式，可通过外部链接跳转方式展示文章内容。</p>
                    </el-alert>
                </el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100 mb-20"
					header-row-class-name="headerRow"
                >
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="newsTitle" label="标题" />
                    <el-table-column prop="newsCategoryName" label="帮助栏目" />
                    <el-table-column prop="createTime" label="创建时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status" class="status-pass">上线</span>
                            <span v-else class="status-done">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="140">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="changeStatus(scope.row)">
                                    {{ scope.row.status ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">修改</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 bg-white">
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
                <el-alert type="warning" class="defalult mt-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>1、帮助文章会显示在帮助栏目标签下，所以需要先创建帮助栏目，新增帮助文章时选择帮助栏目；</p>
                        <p>2、 文章处于上线状态页面可见，处于下线状态页面不可见</p>
                        <p>3、帮助文章可以选择新增、链接跳转两种方式；</p>
                    </div>
                </el-alert>
            </div>

            <el-dialog title="链接" :visible.sync="dialogVisible" width="510px" custom-class="dialog-form">
                <div>
                    <el-form ref="form" size="small" label-width="95px" label-position="right" :model="form" :rules="rules">
                        <el-form-item label="显示页面" prop="displayPage">
                            <el-radio-group v-model="form.displayPage" @change="changeDisplayPage">
                                <el-radio :label="1">用户端帮助中心</el-radio>
                                <el-radio :label="2">商家端帮助中心</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="帮助栏目：" prop="newsCategoryId">
                            <el-select v-model="form.newsCategoryId" clearable filterable placeholder="请选择">
                                <el-option v-for="item in newsDisplayCategoryList" :key="item.id" :label="item.newsCategoryName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标题" prop="newsTitle">
                            <el-input v-model="form.newsTitle" placeholder="标题" />
                        </el-form-item>
                        <el-form-item label="链接" prop="url">
                            <el-input v-model="form.url" placeholder="链接" />
                        </el-form-item>
                        <el-form-item label="顺序" prop="seq">
                            <el-input v-model="form.seq" type="number" placeholder="顺序" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label="1">上线</el-radio>
                                <el-radio :label="0">下线</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                    <el-button v-ls-loading size="small" type="primary" @click="addLink">新 增</el-button>
                </span>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { helpArticle } from '@/api/ModuleStore'

export default {
    name: 'HelpArticle',
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                newsTitle: '',
                status: '',
                newsCategoryId: ''
            },
            date: '',
            url: {
                getData: '/shop/admin/news/page',
                delete: '/shop/admin/news'
            },
            newsCategoryList: [],
            newsDisplayCategoryList: [],
            dialogVisible: false,
            form: {
                newsCategoryId: '',
                newsTitle: '',
                url: '',
                seq: '',
                type: 2,
                status: 1,
                displayPage: 1
            },
            rules: {
                newsCategoryId: [
                    {
                        required: true,
                        message: '请选择栏目',
                        trigger: 'change'
                    }
                ],
                newsTitle: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入外链链接',
                        trigger: 'blur'
                    }
                ],
                seq: [
                    {
                        required: true,
                        message: '请输入顺序',
                        trigger: 'blur'
                    }
                ],
                displayPage: [
                    {
                        required: true,
                        message: '请选择显示页面',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.getAllNewsCategory()
        this.getDisplayNewsCategory()
    },
    methods: {
        // 获取所有栏目
        getAllNewsCategory() {
            helpArticle
                .newsCategory()
                .then((res) => {
                    this.newsCategoryList = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取相应栏目
        getDisplayNewsCategory() {
            helpArticle
                .newsDisplayCategory({
                    displayPage: this.form.displayPage
                })
                .then((res) => {
                    this.newsDisplayCategoryList = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        changeDisplayPage() {
            this.getDisplayNewsCategory()
            this.$set(this.form, 'newsCategoryId', '')
        },

        // 新增
        toAdd() {
            this.$router.push({
                path: '/ModuleStore/feedbackManage/helpArticleOperate',
                query: {
                    type: 'add'
                }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                path: '/ModuleStore/feedbackManage/helpArticleOperate',
                query: {
                    type: 'edit',
                    id: row.id
                }
            })
        },

        // 新增跳转链接
        addLink() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    helpArticle
                        .add(this.form)
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('新增成功')
                                this.getData()
                                this.dialogVisible = false
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
        },

        // 上/下线
        changeStatus(row) {
            this.$confirm(
                `${row.status ? '下线后，用户无法在应用中查看该文章。确定下线？' : '上线后，用户可在应用中查看该文章。确定上线？'}`,
                '消息提示',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    helpArticle
                        .updateStatus({
                            id: row.id,
                            status: Number(!row.status)
                        })
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.info('取消操作')
                })
        },

        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'beginTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'beginTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        }
    }
}
</script>
