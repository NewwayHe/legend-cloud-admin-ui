<!-- /*
 * @Descripttion:商品分组
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 指引 -->
            <div class="lead">
                <h3>商品分组</h3>
                <div>
                    <p>一个商品可以添加多个商品分组，可以对商品进行分组管理</p>
                </div>
                <div class="font-0">
                    <el-button type="text" size="small" @click="$router.push({ name: 'goodReative' })">设置分组</el-button>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc"></span>
                    <el-button type="text" class="text-333" size="small">添加商品，对商品进行分组管理</el-button>
                    <span class="mx-10 font-14 iconfont icon-a-nextstep text-ccc"></span>
                    <el-button type="text" class="text-333" size="small">首页装修商品列表组件添加分组，直接填充分组的商品列表</el-button>
                </div>
            </div>
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="分组名称">
                        <el-input v-model="searchFilters.name" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="分组类型">
                        <el-select v-model="searchFilters.type" clearable placeholder="请选择">
                            <el-option label="系统定义" :value="0" />
                            <el-option label="自定义" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" type="primary" @click="handleCreate">新增</el-button>
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
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" label="分组名称" show-overflow-tooltip />
                    <el-table-column prop="type" label="分组类型">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.type == 0" :underline="false">系统定义</el-link>
                            <el-link v-if="scope.row.type == 1" :underline="false">自定义</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="分组描述" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.description || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="250">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 1" class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    编辑
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="checkDetail(scope.row)">查看商品</el-link>
                                <el-link :underline="false" type="primary" @click="showGroupDialog(scope.row)">关联商品</el-link>
                            </span>
                            <span v-else class="">-</span>
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

            <!-- 关联分组 -->
            <correlation-check ref="groupDialog" :item-id="chooseItem" :show-tip="false" @relateGroup="saveRelatedGroup" />

            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible" destroy-on-close>
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="98px"
                    label-position="right"
                    size="small"
                >
                    <el-form-item label="分组名称：" prop="name">
                        <el-input v-model="dialogForm.formData.name" maxlength="20" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-radio-group v-model="dialogForm.formData.sort">
                            <el-radio label="createTime">按照发布时间排序</el-radio>
                            <el-radio label="buys">按照销量排序</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input v-model="dialogForm.formData.description" maxlength="50" placeholder="请输入" />
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
import { goodsGroup } from '@/api/ModuleGoods'
import correlationCheck from './components/correlationCheck'
export default {
    name: 'GoodReative',
    components: {
        correlationCheck
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                name: '',
                type: ''
            },
            url: {
                getData: '/product/admin/product/group/page',
                create: '/product/admin/product/group',
                update: '/product/admin/product/group',
                delete: '/product/admin/product/group'
            },
            dialogForm: {
                formRule: {
                    name: { required: true, message: '请输入分组名称', trigger: 'blur' },
                    sort: { required: true, message: '请选择排序类型', trigger: 'change' }
                },
                formData: {
                    sort: 'buys'
                }
            },
            chooseItem: ''
        }
    },
    methods: {
        // 关联商品
        showGroupDialog(row) {
            console.log('........... %o', row)
            this.chooseItem = row.id
            this.$refs.groupDialog.dialogShow()
        },

        // 保存关联分组
        saveRelatedGroup(paramsList) {
            console.log('选择保存的关联组', paramsList, this.chooseItem)
            let x1 = paramsList.map(String)
            let str = x1.join(',')
            goodsGroup
                .groupRelation({
                    productIds: str,
                    groupId: this.chooseItem
                })
                .then((res) => {
                    if (!res.code) {
                        return
                    }
                    this.$refs.groupDialog.dialogClose()
                    this.$message.success('关联成功')
                    this.getData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 查看商品
        checkDetail(row) {
            this.$router.push({
                name: 'goodGroupDetail',
                query: { id: row.id }
            })
        }
    }
}
</script>
