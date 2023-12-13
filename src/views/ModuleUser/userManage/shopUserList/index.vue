<!-- /*
 * @Descripttion:商家用户列表
*/ -->
<template>
    <section>
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="用户ID">
                        <el-input v-model="searchFilters.userId" placeholder="用户ID" />
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="searchFilters.mobilePhone" placeholder="手机号码" />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.lockFlag" placeholder="请选择" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="有效" :value="true" />
                            <el-option label="无效" :value="false" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-alert type="info" class="theme" :closable="false" show-icon>
                        <p>说明：用户分为两种类型：用户、商家；用户状态为有效时，用户才可正常使用；若状态为失效。用户不可正常登录使用。</p>
                    </el-alert>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                    row-key="id"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column type="selection" reserve-selection width="42" />
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="id" label="用户ID" />
                    <el-table-column prop="mobile" label="手机号码" />
                    <el-table-column prop="createTime" label="注册时间" width="140" />
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.lockFlag ? 'status-pass' : 'status-done'">{{ scope.row.lockFlag ? '有效' : '无效' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link
                                    v-if="scope.row.lockFlag"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="updateStatus(scope.row, scope.column, scope.$index)"
                                >
                                    下线
                                </el-link>
                                <el-link v-else :underline="false" type="primary" @click.stop="updateStatus(scope.row, scope.column, scope.$index)">
                                    上线
                                </el-link>
                                <el-link :underline="false" type="primary" @click="goUserInfo(scope.row, scope.column, scope.$index)">查看</el-link>
                                <el-link :underline="false" type="primary">
                                    <el-dropdown size="medium" @command="setClick">
                                        <el-link style="padding: 0" :underline="false" type="primary">设置</el-link>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{ type: 'editPwd', params: scope.row }">修改密码</el-dropdown-item>
                                            <el-dropdown-item :command="{ type: 'setCommission', params: scope.row }">发送站内信息</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <el-col class="text-nowrap flex-start">
                        <el-button size="mini" class="allCheck">
                            <el-checkbox
                                v-model="checkAll"
                                label="全选"
                                size="small"
                                :indeterminate="checkHalf"
                                :disabled="!selectableList.length"
                                @change="selAll"
                            />
                        </el-button>
                        <el-button size="small" @click="batchUpdate(1)">批量上线</el-button>
                        <el-button size="small" @click="batchUpdate(0)">批量下线</el-button>
                    </el-col>
                    <pagination
                        :current-page="page.curPage"
                        :page-size="page.pageSize"
                        :total="tableTotal"
                        @size-change="pageSizeChange"
                        @current-change="currentPageChange"
                    />
                </el-row>
            </LsSticky>
        </el-card>

        <!-- 新增-编辑 -->
        <el-dialog title="修改密码" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="98px" size="small" label-position="right">
                <el-form-item label="新密码：" prop="password">
                    <el-input v-model="dialogForm.formData.password" type="password" placeholder="请输入新密码" maxlength="16" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :async-function="() => editPwdSumbit('myForm')">确 定</ls-button>
            </div>
        </el-dialog>
        <!-- 站内信 -->
        <el-dialog title="站内信" custom-class="dialog-form-small" :visible.sync="dialogForminfo.isinfoVisible">
            <el-form
                ref="myinfo"
                :model="dialogForminfo.formData"
                :rules="dialogForminfo.formRule"
                label-width="98px"
                size="small"
                label-position="right"
            >
                <el-form-item label="内容：" prop="info">
                    <el-input
                        v-model="dialogForminfo.formData.info"
                        type="textarea"
                        maxlength="450"
                        placeholder="请输入信息"
                        :autosize="{ minRows: 3, maxRows: 7 }"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForminfo.isinfoVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :async-function="() => editInfoSumbit('myinfo')">确 定</ls-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { userList } from '@/api/ModuleUser.js'
export default {
    name: 'ShopUserList',
    components: {},
    mixins: [common, cud],
    data() {
        const validatePassword = (rule, value, callback) => {
            if (this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback()
            } else {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            }
        }
        return {
            dialogForm: {
                isVisible: false,
                formData: {
                    password: ''
                },
                formRule: {
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
                }
            },
            dialogForminfo: {
                isinfoVisible: false,
                formData: {
                    info: ''
                },
                formRule: {
                    info: [{ required: true, message: '请输入内容！', trigger: 'blur' }]
                }
            },
            url: {
                getData: '/user/admin/shop/user/page'
            },
            page: {
                // 表格页码
                pageSize: 20
            }
        }
    },
    mounted() {},
    methods: {
        // 查看详情
        goUserInfo(row) {
            this.$router.push({ name: 'shopUserInfo', query: { shopUserId: row.id } })
        },
        // 更新用户状态状态
        updateStatus(row) {
            this.$confirm(
                `${row.lockFlag ? '用户下线后，用户无法在商城中购买商品。确定下线？' : '商品上线后，用户可以在商城中购买商品。确定上线？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                userList
                    .editUserStatus(row.id)
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
        },
        // 批量上下线
        batchUpdate(i) {
            if (!this.mulSels?.length) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            this.$confirm(
                `${i == 0 ? '用户下线后，用户无法在商城中购买商品。确定下线？' : '商品上线后，用户可以在商城中购买商品。确定上线？'}`,
                '消息确认',
                {
                    type: 'warning'
                }
            ).then(() => {
                userList.editBatchShopUserStatus({ ids: this.mulSels, status: i }).then((res) => {
                    if (res.code == 1) {
                        this.$message.success('批量修改成功')
                        this.getData()
                    }
                })
            })
        },

        // 修改密码
        editPwdSumbit() {
            return new Promise((resolve) => {
                this.$refs.myForm.validate((valid) => {
                    if (valid) {
                        userList
                            .editShopUserPwd(this.dialogForm.formData)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.dialogForm.isVisible = false
                                    this.$message.success('修改成功')
                                }
                            })
                            .finally((_) => resolve())
                    } else {
                        resolve()
                    }
                })
            })
        },
        // 发布站内信
        editInfoSumbit() {
            return new Promise((resolve) => {
                this.$refs.myinfo.validate((valid) => {
                    if (valid) {
                        userList
                            .addShopUserInfo({ shopUserId: this.dialogForminfo.formData.id, content: this.dialogForminfo.formData.info })
                            .then((res) => {
                                if (res.code == 1) {
                                    this.dialogForminfo.isinfoVisible = false
                                    this.$message.success('发布成功')
                                }
                            })
                            .finally((_) => resolve())
                    } else {
                        resolve()
                    }
                })
            })
        },
        setClick(info) {
            if (info.type === 'editPwd') {
                this.dialogForm.formData.password = ''
                this.dialogForm.formData.id = info.params.id
                this.dialogForm.isVisible = true
            } else {
                this.dialogForminfo.formData.info = ''
                this.dialogForminfo.formData.id = info.params.id
                this.dialogForminfo.isinfoVisible = true
            }
        }
    }
}
</script>
