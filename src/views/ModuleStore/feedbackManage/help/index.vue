<!--
    帮助栏目
-->
<template>
    <section>
        <el-card>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="栏目名称">
                        <el-input v-model="searchFilters.newsCategoryName" placeholder="栏目名称" />
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
                    <el-col><el-button type="primary" size="medium" @click="toAdd">新增</el-button></el-col>
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
                    <el-table-column prop="displayPage" label="显示页面">
                        <template slot-scope="scope">
                            <span>{{ scope.row.displayPage | showWhere }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="newsCategoryName" label="栏目名称" />
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
                                <el-link :underline="false" type="primary" @click.stop="toEdit(scope.row)">修改</el-link>
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
                        <p>1、帮助栏目可对帮助文章进行分类管理；</p>
                        <p>2、上线状态的帮助栏目才可显示在用户端中；</p>
                    </div>
                </el-alert>
            </div>

            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.data.id ? '编辑' : '新增'" custom-class="dialog-form-small" :visible.sync="isVisible">
                <el-form ref="myForm" :model="dialogForm.data" :rules="dialogForm.formRule" label-width="98px" label-position="right" size="small">
                    <el-form-item label="栏目名称：" prop="newsCategoryName">
                        <el-input v-model="dialogForm.data.newsCategoryName" placeholder="栏目名称" maxlength="10" show-word-limit />
                    </el-form-item>
                    <el-form-item label="顺序：" prop="seq">
                        <el-input
                            v-model="dialogForm.data.seq"
                            type="number"
                            placeholder="顺序"
                            oninput="if(value.length>6)value=value.slice(0,10)"
                            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                        />
                    </el-form-item>
                    <el-form-item label="显示页面：">
                        <el-checkbox-group v-model="dialogForm.data.displayPage">
                            <el-checkbox :label="1">用户端帮助中心</el-checkbox>
                            <el-checkbox :label="2">商家端帮助中心</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-radio-group v-model="dialogForm.data.status">
                            <el-radio :label="1">上线</el-radio>
                            <el-radio :label="0">下线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer font-0">
                    <el-button size="small" @click.stop="isVisible = false">取 消</el-button>
                    <ls-button v-ls-loading size="small" type="primary" :asyncFunction="sureSubmit">确 定</ls-button>
                </div>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { helpCategory } from '@/api/ModuleStore'

export default {
    name: 'Help',
    filters: {
        showWhere(value) {
            const name = {
                0: '-',
                1: '用户端帮助中心',
                2: '商家端帮助中心',
                3: '用户端帮助中心,商家端帮助中心'
            }
            return name[value]
        }
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                newsCategoryName: '',
                status: ''
            },
            date: '',
            url: {
                getData: '/shop/admin/news/category/page',
                delete: '/shop/admin/news/category'
            },
            dialogForm: {
                data: {
                    id: '',
                    newsCategoryName: '',
                    seq: '',
                    displayPage: [],
                    status: ''
                },
                formRule: {
                    newsCategoryName: [
                        {
                            required: true,
                            message: '请输入栏目名称',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '请选择状态',
                            trigger: 'blur'
                        }
                    ],
                    seq: [
                        {
                            required: true,
                            message: '请输入顺序',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            isVisible: false
        }
    },
    methods: {
        // 新增
        toAdd() {
            this.isVisible = true
            this.dialogForm.data = Object.assign(
                {},
                {
                    id: '',
                    newsCategoryName: '',
                    seq: '',
                    displayPage: [],
                    status: 1
                }
            )
        },
        // 编辑
        toEdit(row) {
            this.isVisible = true
            this.dialogForm.data = Object.assign({}, this.dialogForm.data, row)
            let showPageList = []
            if (Number(row.displayPage) == 0) {
                showPageList = [0]
            } else if (Number(row.displayPage) == 3) {
                showPageList = [1, 2]
            } else {
                showPageList = [Number(row.displayPage)]
            }
            this.$set(this.dialogForm.data, 'displayPage', showPageList)
        },

        // 提交
        sureSubmit() {
            return new Promise(resolve=>{
                this.$refs.myForm.validate(async(valid) => {
                    if (valid) {
                        let pageNum = 0
                        if (this.dialogForm.data.displayPage.length > 1) {
                            pageNum = 3
                        } else if (this.dialogForm.data.displayPage.length == 0) {
                            pageNum = 0
                        } else {
                            pageNum = Number(this.dialogForm.data.displayPage[0])
                        }
                        this.$set(this.dialogForm.data, 'displayPage', pageNum)
                        if (this.dialogForm.data.id) {
                            await this.edit()
                        } else {
                            await this.add()
                        }
                        resolve()
                    }else{
                        resolve()
                    }
                })
            })
            
        },

        add() {
            return new Promise(async resolve=>{
                console.log('before APII')
                helpCategory.add(this.dialogForm.data).then((res) => {
                    this.isVisible = false
                    this.$message.success('新增成功')
                    this.getData()
                }).finally(_=>{
                    resolve()
                })
                console.log('After APII')
            })
        },

        edit() {
            return new Promise(async resolve=>{
                helpCategory.edit(this.dialogForm.data).then((res) => {
                    console.log(res)
                    this.isVisible = false
                    this.$message.success('编辑成功')
                    this.getData()
                }).finally(_=>{
                    resolve()
                })
            })
        },

        // 上/下线
        changeStatus(row) {
            this.$confirm(
                `${row.status ? '下线后，用户无法在应用中查看该栏目。确定下线？' : '上线后，用户可在应用中查看该栏目。确定上线？'}`,
                '消息提示',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    helpCategory
                        .updateStatus({
                            id: row.id,
                            status: Number(!row.status)
                        })
                        .then((res) => {
                            console.log(res)
                            this.$message.success('操作成功')
                            this.getData()
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
