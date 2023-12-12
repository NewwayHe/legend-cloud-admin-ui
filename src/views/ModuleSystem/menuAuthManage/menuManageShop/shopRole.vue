<!--
 * @Description: 菜单权限->商家角色
 * @FilePath: \admin\src\views\ModuleSystem\menuAuthManage\roleManage\index.vue
-->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="角色名称">
                        <el-input v-model="searchFilters.name" placeholder="请输入角色名称" />
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
                    <el-button type="primary" size="medium" @click="handleCreate">新增</el-button>
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
                    <el-table-column prop="roleName" label="角色名称" />
                    <el-table-column label="创建时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.delFlag" class="status-pass">上线</span>
                            <span v-else class="status-done">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
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
                                <el-link
                                    v-if="!scope.row.delFlag"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleDel(scope.row, scope.column, scope.$index)"
                                >
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
            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible" @close="dialogClose">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="98px"
                    label-position="right"
                    size="small"
                >
                    <el-form-item label="角色名称：" prop="roleName">
                        <el-input v-model="dialogForm.formData.roleName" placeholder="请输入角色名称" maxlength="20" show-word-limit />
                    </el-form-item>
                    <el-form-item label="角色编码：" prop="roleCode">
                        <el-input v-model="dialogForm.formData.roleCode" placeholder="请输入角色编码" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item label="状态：" prop="delFlag">
                        <el-radio-group v-model="dialogForm.formData.delFlag">
                            <el-radio :label="true">上线</el-radio>
                            <el-radio :label="false">下线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="角色描述：" prop="roledesc">
                        <el-input
                            v-model="dialogForm.formData.roleDesc"
                            type="textarea"
                            placeholder="请输入角色描述信息"
                            maxlength="50"
                            show-word-limit
                        />
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
        </el-card>
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
            isMounted: true,
            roleId: '',
            searchFilters: {
                type: ''
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            roleTreeData: [],
            roleList: [],
            dialogForm: {
                formData: {
                    roleName: '',   //角色名称
                    roleCode: '',   //角色编码
                    roledesc: '',   //角色描述信息
                    delFlag: true
                },
                formRule: {
                    roleName: [
                        {
                            required: true,
                            message: '请输入角色名称',
                            trigger: 'blur'
                        }
                    ],
                    roleCode: [
                        {
                            required: true,
                            message: '请输入角色编码',
                            trigger: 'blur'
                        }
                    ],
                    delFlag: [
                        {
                            required: true,
                            message: '请选择状态',
                            trigger: 'change'
                        }
                    ]
                }
            },
            url: {
                getData: '/user/admin/shop/role/page',
                update: '/user/admin/shop/role',
                delete: '/user/admin/shop/role',
                create: '/user/admin/shop/role'
            }
        }
    },
    created() {},
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
        },
        // 新增/编辑关闭弹窗需要重置表单
        dialogClose() {
            let originData = this.$options.data.call(this);
            this.dialogForm.formData = originData.dialogForm.formData;
        }
    }
}
</script>
