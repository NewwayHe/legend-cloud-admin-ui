<!-- /*
 * @Descripttion:用户列表
*/ -->
<template>
    <div>
        <el-card class="pl-30 pt-10 pb-10 border-none">
            <!-- 顶部信息 -->
            <el-row type="flex" justify="space-between" align="top">
                <el-row type="flex" align="middle">
                    <el-avatar
                        :key="userInfo.avatar"
                        :size="120"
                        :src="$photoServer + userInfo.avatar"
                        style="font-size: 80px"
                        icon="el-icon-user-solid"
                        class="mr-20"
                    />
                    <div class="font-main">
                        <p class="font-head">{{ userInfo.nickName }}</p>
                        <div class="mt-20">
                            <span>手机号码：</span>
                            {{ userInfo.mobile }}
                        </div>
                        <!-- <div class="mt-8"><span>电子邮箱：</span>-</div> -->
                        <div class="mt-8">
                            <span>注册时间：</span>
                            {{ userInfo.createTime }}
                        </div>
                        <div class="mt-8">
                            <span>电子邮箱：</span>
                            {{ userInfo.email || '-' }}
                        </div>
                    </div>
                </el-row>
            </el-row>
        </el-card>
        <!-- 内容部分 -->
        <el-row :gutter="15" class="mt-15">
            <el-container>
                <el-main class="pl-0">
                    <el-card class="h-100" :body-style="{ height: '100%' }">
                        <div class="h-50">
                            <el-row class="py-10 font-14" type="flex" justify="space-between" align="middle">
                                <span>会员角色</span>
                                <el-button type="primary" size="small" @click="$refs.dialogAddRole.showDialog()">新增</el-button>
                            </el-row>
                            <el-table :data="listinfo" size="mini" max-height="240" border>
                                <el-table-column label="名称" prop="roleName"></el-table-column>
                                <el-table-column label="角色名称" prop="roleCode"></el-table-column>
                                <el-table-column label="状态" prop="delFlag" min-width="60px">
                                    <template slot-scope="scope">
                                        {{ scope.row.delFlag ? '有效' : '失效' }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" prop="roleDesc"></el-table-column>
                                <el-table-column label="操作" align="center" min-width="60px">
                                    <template slot-scope="scope">
                                        <el-link :underline="false" type="primary" @click="delUser(scope.row.id)">删除</el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="h-50">
                            <el-row class="py-10 font-14">会员权限</el-row>
                            <el-table :data="userInfo.menuList" size="mini" max-height="240" border>
                                <el-table-column label="名称" prop="name"></el-table-column>
                                <el-table-column label="权限名称" prop="permission"></el-table-column>
                                <el-table-column label="备注" prop="menuDesc"></el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-main>
                <el-main class="pr-0" style="width: 50%">
                    <el-card>
                        <el-row slot="header" type="flex" justify="space-between" class="font-14">
                            <span>消费信息</span>
                            <span class="font-help text-999">最近消费时间：{{ userInfo.lastConsumptionTime }}</span>
                        </el-row>
                        <div class="text-center">
                            <el-row style="padding: 60px 0">
                                <el-col :span="12">
                                    <el-avatar :size="32" :src="require('@/assets/icons/userInfo/total_money.png')" />
                                    <div class="font-weight font-36">￥{{ userInfo.cumulativeConsumptionAmount }}</div>
                                    <span class="font-help text-999">累计消费金额</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-avatar :size="32" :src="require('@/assets/icons/userInfo/money.png')" />
                                    <div class="font-weight font-36">{{ userInfo.cumulativeOrderQuantity }}</div>
                                    <span class="font-help text-999">累计订单数量</span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                    <el-card class="mt-15">
                        <el-row slot="header" type="flex" justify="space-between" class="font-14">
                            <span>分销信息</span>
                            <span class="font-help text-999">申请时间：2019-12-12 10:00:00</span>
                        </el-row>
                        <div class="text-center">
                            <el-row style="padding: 60px 0">
                                <el-col :span="12">
                                    <el-avatar :size="32" :src="require('@/assets/icons/userInfo/order.png')" />
                                    <div class="font-weight font-36">￥{{ userInfo.accumulatedCommission }}</div>
                                    <span class="font-help text-999">累计获得佣金</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-avatar :size="32" :src="require('@/assets/icons/userInfo/man.png')" />
                                    <div class="font-weight font-36">{{ userInfo.cumulativeDevelopmentOfSubordinates }}</div>
                                    <span class="font-help text-999">累计发展下级</span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-main>
            </el-container>
            <!-- 右侧信息 -->
        </el-row>

        <dialogAddRole ref="dialogAddRole" :role-ids="roleIds" :userid="this.$route.query.userId" @update="getUserInfo"></dialogAddRole>
        <!-- 内容部分 -->
    </div>
</template>
<script>
import { userInfo } from '@/api/ModuleUser.js'
import dialogAddRole from './dialogAddRole'
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
    created() {
        this.getUserInfo()
    },
    methods: {
        // 删除会员角色
        delUser(id) {
            console.log(id)
            console.log(this.$route.query.userId)
            this.$confirm('此操作将移除该会员角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    userInfo
                        .delUserRole({
                            userId: this.$route.query.userId,
                            roleId: id
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.getUserInfo()
                                this.$message.success('移除成功')
                            }
                        })
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },
        getUserInfo() {
            if (this.$route.query.userId) {
                console.log(this.$route.query.userId)
                userInfo.userDetail(this.$route.query.userId).then((res) => {
                    if (res.code == 1) {
                        this.userInfo = res.data
                        this.listinfo = res.data.ordinaryRoleDTOList
                    }
                })
            }
        },
        // 跳转到添加会员角色框
        addRole() {
            this.$refs.dialogAddRole.showDialog()
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
::v-deep .el-divider {
    height: 100%;
    .el-divider--vertical {
        height: 100%;
    }
}
</style>
