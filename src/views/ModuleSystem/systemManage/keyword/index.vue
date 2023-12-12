<!-- /*
 * @Descripttion:关键字屏蔽
*/ -->
<template>
    <section class="">
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="敏感字">
                        <el-input v-model="searchFilters.words" placeholder="请输入敏感字" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnResetSearch">重置</el-button>
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
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="creator" label="创建人" />
                    <el-table-column prop="words" label="敏感字" />
                    <el-table-column show-overflow-tooltip prop="isGlobal" label="是否全局敏感字">
                        <template slot-scope="scope">
                            {{ scope.row.isGlobal ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
						<template slot-scope="scope">
							<span class="edit table__action">
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
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </div>
        </el-card>

        <!-- 新增-编辑 -->
        <el-dialog custom-class="dialog-form-small" :title="dialogForm.title" :visible.sync="dialogForm.isVisible">
            <el-form
                ref="myForm"
                :model="dialogForm.formData"
                :rules="dialogForm.formRule"
                size="small"
                label-width="120px"
                label-position="right"
                @submit.native.prevent 
                @keyup.enter.native="()=>{}"
            >
                <el-form-item label="敏感字：" prop="words">
                    <el-input v-model="dialogForm.formData.words" placeholder="敏感字" />
                </el-form-item>
                <el-form-item label="是否全局敏感字：" prop="isGlobal">
                   <el-radio-group v-model="dialogForm.formData.isGlobal">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :underline="false" type="primary" size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button v-ls-loading :underline="false" type="primary" size="small" @click.stop="debounceSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: 'keyword',
    components: {},
    mixins: [common, cud],
    watch: {
        tableList(nv) {
            console.log('nv--',nv)
        }
    },
    data() {
        return {
            searchFilters: {
                words: '',
            },
            url: {
                getData: 'basic/sensWord/page',
                update: 'basic/sensWord',
                delete: 'basic/sensWord',
                create: 'basic/sensWord',

            },
            editVisible: false,
            dialogForm: {
                formData: {
                    words: '',
                    isGlobal: true,
                },
                formRule: {
                    words: [
                        {
                            required: true,
                            message: '请输入敏感字',
                            trigger: 'blur'
                        }
                    ],
                    isGlobal: [
                        {
                            required: true,
                            message: '请选择',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        }
    },
    mounted() {},
    methods: {
    }
}
</script>
