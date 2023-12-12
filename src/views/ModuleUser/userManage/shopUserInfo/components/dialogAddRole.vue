<template>
    <el-dialog title="会员角色" custom-class="dialog-form-small" :visible.sync="dialogVisible">
        <el-row>
            <el-form :inline="true" :model="dialogSearchFilters" size="small" label-width="98px" class="font-0" @submit.native.prevent @keyup.enter.native="dialogSearch">
                <el-form-item label="角色名称：" style="margin-bottom:0;">
                    <el-input v-model="dialogSearchFilters.name" placeholder="角色名称" />
                </el-form-item>
                <el-form-item style="margin-right: 0;">
                    <el-button size="small" type="primary" @click.stop="dialogSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="mt-15">
            <el-table ref="multipleTable" v-loading="tableListLoading" :data="templateList" tooltip-effect="dark" class="w-100 dialog-form-table" size='small' header-row-class-name="headerRow">
                <el-table-column prop="roleName" label="角色名称" align="center" />
                <el-table-column label="有效状态" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.delFlag ? 'status-pass' : 'status-done'">{{ scope.row.delFlag ? '有效' : '无效' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效状态" align="center">
                    <template slot-scope="scope">
                        <el-link :underline="false" type="primary" @click="updateUser(scope.row, userRoleId.includes(scope.row.id))">
                            {{ userRoleId.includes(scope.row.id) ? '取消关联' : '关联' }}
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" class="dialog-paging mt-10">
            <pagination
                small
                layout="prev, pager, next"
                :page-size="dialogPage.pageSize"
                :page-sizes="[5, 10, 15]"
                :total="dialogPage.total"
                @size-change="dialogPageSizeChange"
                @current-change="dialogPageChange"
            />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { userInfo } from '@/api/ModuleUser.js'
export default {
    props: {
        roles: {
            // 用户拥有的角色id列表
            type: [String, Number, Array]
        },
        // dialog的title
        type: {
            // 用户类型
            type: String,
            default: 'user' //user 普通用户 shop 商家用户
        },
        roleIds: {
            // 用户类型
            type: Array,
            default: [] //user 普通用户 shop 商家用户
        },
        // 会员id
        shopUserId: {
            type: [String, Number]
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogPage: {
                curPage: 1,
                pageSize: 5,
                total: 0
            },
            dialogSearchFilters: {
                name: ''
            },
            templateList: [],
            tableListLoading: false,
            tempTransId: '',

            userRoleId: [] // 角色Id集合
        }
    },

    computed: {},
    watch: {
        roleIds(newValue) {
            this.userRoleId = newValue
        }
    },

    created() {},
    methods: {
        dialogSearch() {
            this.getTemplateList()
        },
        // 保存
        submitForm() {
            this.dialogVisible = false
            userInfo.updateShopUserRole({ userId: this.shopUserId, roleIds: this.userRoleId }).then((res) => {
                this.$emit('update')
            })
        },
        // 获取关联角色列表
        getTemplateList() {
            userInfo
                .shopRolePage({
                    userId: this.shopUserId,
                    ...this.dialogSearchFilters,
                    ...this.dialogPage
                })
                .then((res) => {
                    if (res.code) {
                        this.templateList = res?.data?.resultList || []
                        this.dialogPage.total = res?.data?.total || 0
                    }
                })
        },
        dialogPageSizeChange(size) {
            this.dialogPage.pageSize = size
            this.getTemplateList()
        },
        dialogPageChange(p) {
            this.dialogPage.curPage = p
            this.getTemplateList()
        },
        showDialog() {
            this.dialogVisible = true
            this.getTemplateList()
        },
        // 指定用户更新关联角色
        updateUser(row, flag) {
            console.log(row)
            console.log(flag)
            console.log(this.userRoleId)
            if (!flag) {
                this.userRoleId.push(row.id)
            } else {
                this.userRoleId = this.userRoleId.filter((item) => {
                    return item != row.id
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    >.el-form-item:first-child {     //搜索框占满
        flex: 1;
        display: flex;
        ::v-deep .el-form-item__content {
            flex: 1;
        }
    }
}
</style>
