<!-- /*
 * @Descripttion:用户列表
*/ -->
<template>
    <section>
        <el-card class="border-none">
            <!-- 顶部信息 -->
            <div slot="header" class="font-14">
                <span>基本资料</span>
            </div>
            <el-row type="flex" justify="space-between" align="bottom">
                <el-row type="flex" align="middle">
                    <el-avatar :key="userInfo.avatar" :size="120" :src="$photoServer + userInfo.avatar" icon="el-icon-user-solid" class="mr-20" />
                    <div class="font-main">
                        <p class="font-head">{{ userInfo.username }}</p>
                        <div class="mt-20">
                            <span>手机号码：</span>
                            {{ userInfo.mobile }}
                        </div>
                        <div class="mt-8">
                            <span>注册时间：</span>
                            {{ userInfo.createTime }}
                        </div>
                    </div>
                </el-row>
            </el-row>
        </el-card>
        <!-- 顶部信息 -->
        <!-- 内容部分 -->
        <el-row :gutter="10" class="mt-15">
            <!-- 用户角色 -->
            <el-col>
                <el-card class="el-card-p0">
                    <el-row slot="header" type="flex" justify="space-between" align="middle" class="font-14">
                        <span>用户角色</span>
                        <el-button size="mini" type="primary" @click="addRole">添加</el-button>
                    </el-row>
                </el-card>
                <div class="bg-fff font-main p-15 table">
                    <el-table ref="multipleTable" :data="listinfo" border class="font-help text-333 self__table" header-row-class-name="headerRow">
                        <el-table-column prop="roleName" label="角色名称" align="center" />
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <span :class="scope.row.delFlag ? 'status-pass' : 'status-done'">{{ scope.row.delFlag ? '有效' : '无效' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="roleName" label="备注" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.roleDesc == null ? '--' : 'scope.row.roleDesc' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" width="180">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="delUser(scope.row.id)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <!-- 店铺信息 -->
            <el-col v-if="userInfo.shopId" class="mt-15 el-card-p0">
                <el-card>
                    <div slot="header" class="font-14">
                        <span>店铺信息</span>
                    </div>
                    <div class="p-20">
                        <span class="font-14 text-primary cursor-pointer" @click="goShopUserInfo">查看 ></span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <dialogAddRole
            ref="dialogAddRole"
            type="shop"
            :role-ids="roleIds"
            :shop-user-id="this.$route.query.shopUserId"
            @update="getUserInfo"
        ></dialogAddRole>
    </section>
</template>
<script>
import { userInfo } from '@/api/ModuleUser.js'
import dialogAddRole from './components/dialogAddRole'

export default {
    name: 'Userinfo',
    components: {
        dialogAddRole
    },
    data() {
        return {
            activeName: 'second',
            userInfo: {},
            listinfo: []
        }
    },
    computed: {
        roleIds() {
            return this.listinfo.map((item) => {
                return item.id
            })
        }
    },
    // mixins: [common],
    created() {
        this.getUserInfo()
    },
    methods: {
        // 跳转店铺信息
        goShopUserInfo() {
            this.$router.push({ name: 'storeDetail', query: { id: this.userInfo.shopId } })
        },

        // 获取商家用户信息
        getUserInfo() {
            if (this.$route.query.shopUserId === undefined) {
                this.$route.query.shopUserId = '1'
            }
            userInfo.shopUserDetail(this.$route.query.shopUserId).then((res) => {
                if (res.code == 1) {
                    console.log(res.data.shopId)
                    this.userInfo = res.data
                    this.listinfo = res.data.shopRoleDTOList
                }
            })
        },
        // 打开添加会员角色框
        addRole() {
            this.$refs.dialogAddRole.showDialog()
        },
        // 删除会员角色
        delUser(id) {
            this.$confirm('此操作将移除该会员角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    userInfo.delShopUserRole({ userId: this.$route.query.shopUserId, roleId: id }).then((res) => {
                        if (res.code == 1) {
                            this.getUserInfo()
                            this.$message.success('移除成功')
                        }
                    })
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .self__table {
    &.el-table thead {
        color: #000;
    }
}
::v-deep .el-card-p0 .el-card__body {
    padding: 0;
}
</style>
