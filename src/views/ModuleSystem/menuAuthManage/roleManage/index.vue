<template>
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-card>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="角色名称：">
                        <el-input v-model="searchFilters.roleName" placeholder="请输入角色名称" />
                    </el-form-item>
                    <el-form-item label="角色类型：">
                        <el-select v-model="searchFilters.roleType" placeholder="请选择角色类型" clearable>
                            <el-option label="平台角色" value="A" />
                            <el-option label="普通用户角色" value="U" />
                            <el-option label="商家角色" value="S" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="table">
            <el-card class="mb-20">
                <!--列表-->
                <el-row class="mb-20">
                    <el-button style="height: 32px" type="primary" size="small" @click="handleCreate">新增</el-button>
                </el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
                >
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="roleName" label="角色名称" />
                    <el-table-column label="角色类型">
                        <template slot-scope="scope">
                            {{ roleType[scope.row.roleType] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.delFlag">正常</span>
                            <span v-else style="color: red">删除</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click.stop="handlePre(scope.row, scope.column, scope.$index)"
                                >
                                    权限
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-20">
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
            </el-card>
        </div>
        <!-- 新增-编辑 -->
        <el-dialog :title="dialogForm.title" custom-class="dialog-form" width="480px" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="95px" label-position="right" size="small">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="dialogForm.formData.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色类型" prop="roleType">
                    <el-select v-model="dialogForm.formData.roleType" placeholder="请选择角色类型" clearable>
                        <el-option label="平台角色" value="A" />
                        <el-option label="普通用户角色" value="U" />
                        <el-option label="商家角色" value="S" />
                    </el-select>
                </el-form-item>
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input v-model="dialogForm.formData.roleCode" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="状态" prop="delFlag">
                    <el-radio-group v-model="dialogForm.formData.delFlag">
                        <el-radio :label="true">上线</el-radio>
                        <el-radio :label="false">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色描述" prop="roledesc">
                    <el-input v-model="dialogForm.formData.roledesc" type="textarea" placeholder="请输入角色描述信息" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加角色 -->
        <dialog-add-role ref="addRole" />
        <!-- 权限配置 -->
        <dialog-add-pre ref="addPre" :role-id="roleId" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { menuAuthManage } from '@/api/ModuleSystem'
import dialogAddRole from './components/dialogAddRole'
import dialogAddPre from './components/dialogAddPre'
export default {
    components: {
        dialogAddRole,
        dialogAddPre
    },
    mixins: [common, cud],
    data() {
        return {
            roleId: '',
            roleType: {
                A: '平台角色',
                U: '普通用户角色',
                S: '商家角色'
            },
            searchFilters: { type: '' },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            roleTreeData: [],
            roleList: [],
            dialogForm: {
                formData: {
                    delFlag: true
                },
                formRule: {
                    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                    roleType: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
                    roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
                }
            },
            url: {
                getData: '/user/user/admin/role/page',
                update: '/user/admin/role',
                delete: '/user/admin/role',
                create: '/user/admin/role'
            }
        }
    },
    created() {
        // this.getRoleTree()
    },
    mounted() {},
    methods: {
        handlePre(row = {}) {
            this.$refs.addPre.showDialog()
            this.roleId = row.id
        },
        getCheckedKeys() {
            console.log(this.$refs.tree.getCheckedKeys())
        },
        getRoleTree() {
            menuAuthManage.getMenuList().then((res) => {
                if (res.code === 1) {
                    this.roleTreeData = res.data
                }
            })
        },
        getRoleList(id) {
            menuAuthManage.getRoleList(id).then((res) => {
                if (res.code === 1) {
                    this.roleList = res.data
                }
            })
        }
    }
}
</script>
