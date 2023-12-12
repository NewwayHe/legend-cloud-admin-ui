<!-- /*
 * @Descripttion:管理员列表
*/ -->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="管理员账号">
                        <el-input v-model="searchFilters.username" placeholder="用户名" />
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="searchFilters.roleName" placeholder="角色名称" />
                    </el-form-item>
                    <el-form-item label="部门名称">
                        <el-input v-model="searchFilters.deptName" placeholder="部门名称" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.lockFlag" placeholder="请选择" clearable>
                            <el-option label="上线" :value="true" />
                            <el-option label="下线" :value="false" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
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
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="username" label="用户名" />
                    <el-table-column label="部门">
                        <template slot-scope="scope">
                            {{ scope.row.deptName || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户角色">
                        <template slot-scope="scope">
                            <el-tag v-for="(item, index) in scope.row.roleList" :key="index" style="margin: 0 5px; margin-top: 5px" type="success">
                                {{ item.roleName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.lockFlag" class="status-pass">有效</span>
                            <span v-else class="status-veto">锁定</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link
                                    :underline="false"
                                    icon="el-icon-edit"
                                    type="primary"
                                    @click.stop="handleEdit(scope.row, scope.column, scope.$index)"
                                >
                                    修改
                                </el-link>
                                <el-link
                                    :underline="false"
                                    icon="el-icon-delete"
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
            <dialog-add-admin ref="addAdmin" @finish="getData" />
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import dialogAddAdmin from './components/dialogAddAdmin'
export default {
    name: 'AdminList',
    components: {
        dialogAddAdmin
    },
    mixins: [common, cud],
    data() {
        return {
            dialogForm: {
                formRule: {
                    productNo: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    productName: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    createUserCode: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            searchFilters: {
                roleName: ''
            },
            url: {
                getData: '/user/admin/platform/user/page',
                delete: '/user/admin/platform/user'
            }
        }
    },
    created() {
        console.log(this.$route)
        if (this.$route.query.roleName) {
            this.searchFilters.roleName = this.$route.query.roleName
        }
    },
    mounted() {},
    methods: {
        handleCreate() {
            this.$refs.addAdmin.showDialog()
            this.$refs.addAdmin.ruleForm = {
                lockFlag: true
            }
        },
        handleEdit(row) {
            this.$refs.addAdmin.showDialog()
            this.$refs.addAdmin.ruleForm = {
                id: row.id,
                roleIdList: row.roleList.map((item) => item.id * 1),
                lockFlag: row.lockFlag,
                username: row.username,
                deptId: row.deptId
            }
        }
    }
}
</script>
