<!--
    公告管理
-->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="标题">
                        <el-input v-model="searchFilters.title" placeholder="标题" />
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
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.type" size="large" @change="dbnSearch">
                            <el-radio-button label="">所有公告</el-radio-button>
                            <el-radio-button :label="0">买家公告</el-radio-button>
                            <el-radio-button :label="1">卖家公告</el-radio-button>
                        </el-radio-group>
						<el-button class="ml-15" type="primary" size="medium" @click="toAdd">新增</el-button>
                    </el-col>
                </el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
					header-row-class-name="headerRow"
                >
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="type" label="公告类型">
                        <template slot-scope="scope">
                            {{ scope.row.type == 1 ? '卖家公告' : '买家公告' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" />
                    <el-table-column label="生效时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.startTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="失效时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.endTime || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.status == 1 ? 'status-pass' : 'status-done'">{{ scope.row.status == 1 ? '上线' : '下线' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="140">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link v-if="!scope.row.status == 1" :underline="false" type="primary" @click="updateStatus(scope.row)">
                                    上线
                                </el-link>
                                <el-link v-else :underline="false" type="primary" @click="updateStatus(scope.row)">下线</el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="toEdit(scope.row, scope.column, scope.$index)">修改</el-link>
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
            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.title" custom-class="dialog-form" width="850px" :visible.sync="dialogForm.isVisible">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="95px"
                    label-position="right"
                    size="small"
                >
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="dialogForm.formData.title" placeholder="标题" />
                    </el-form-item>
                    <el-form-item label="公告类型" prop="type">
                        <el-select v-model="dialogForm.formData.type" class="w-100" placeholder="请选择" clearable>
                            <el-option label="买家公告" value="0" />
                            <el-option label="卖家公告" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公告状态" prop="status">
                        <el-radio-group v-model="dialogForm.formData.status">
                            <el-radio label="1">上线</el-radio>
                            <el-radio label="0">下线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="有效时间">
                        <el-date-picker v-model="dialogForm.formData.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="失效时间">
                        <el-date-picker v-model="dialogForm.formData.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <TinyMce v-if="dialogForm.isVisible" v-model="dialogForm.formData.content" width="700" height="200" />
                        <!-- <el-input v-model="dialogForm.formData.content" placeholder="内容" /> -->
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
import setting from '@/settings'
import TinyMce from '@/components/TinyMceNew'
import { notice } from '@/api/ModuleStore.js'
export default {
    name: 'Notice',
    components: {
        TinyMce
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                type: ''
            },
            typeLink: setting.linkTag,
            dialogForm: {
                formRule: {
                    title: [
                        {
                            required: true,
                            message: '请输入标题名称',
                            trigger: 'blur'
                        }
                    ],
                    type: [
                        {
                            required: true,
                            message: '请输入公告类型',
                            trigger: 'blur'
                        }
                    ],
                    content: [
                        {
                            required: true,
                            message: '请输入公告内容',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            switchType: 'top',
            url: {
                getData: '/shop/admin/pub/page',
                update: '/shop/admin/pub',
                delete: '/shop/admin/pub',
                create: '/shop/admin/pub',
            }
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },
    methods: {
        // 新增
        toAdd() {
            this.$router.push({
                path: '/ModuleStore/messageManage/noticeOperate',
                query: {
                    type: 'add'
                }
            })
        },
        // 编辑
        toEdit(row) {
            this.$router.push({
                path: '/ModuleStore/messageManage/noticeOperate',
                query: {
                    type: 'edit',
                    id: row.id
                }
            })
        },
        // 更新商品状态
        updateStatus(row) {
            this.$confirm(`${row.status ? '确定下线？' : '确定上线？'}`, '提示', {
                type: 'warning'
            })
                .then(() => {
                    notice
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
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {
                    // this.$message.info('取消删除')
                })
        }
    }
}
</script>
