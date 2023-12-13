<!-- /*
 * @Descripttion:优惠券列表
*/ -->
<template>
    <section class="">
        <div class="table">
            <el-table ref="multipleTable" v-loading="tableListLoading" row-key="id" :data="tableList" tooltip-effect="dark" class="w-100">
                <template slot="empty">
                    <empty empty-type="pro" text="暂无活动信息" />
                </template>
                <el-table-column label="序号" type="index" width="55" align="center" />
                <el-table-column prop="couponCode" show-overflow-tooltip label="券号" align="center"></el-table-column>
                <el-table-column prop="mobile" label="用户手机号码" align="center" />
                <el-table-column prop="getTime" label="领取时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.getTime || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="useTime" label="使用时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.useTime || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="订单编号" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.orderNumber || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.status | getLabelText(couponStatus) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <span class="table__action flex-center">
                            <el-link v-if="scope.row.status == 1" :underline="false" type="primary" @click="forceInvalid(scope.row)">
                                强制失效
                            </el-link>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" class="mt-20">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </div>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import { couponApi } from '@/api/ModuleMarketing'
export default {
    components: {},
    mixins: [common],
    props: ['couponId'],
    data() {
        return {
            couponStatus: [
                { label: '未开始', value: 0 },
                { label: '未使用', value: 1 },
                { label: '已使用', value: 2 },
                { label: '已失效', value: -1 }
            ],
            fixFilters: {
                couponId: this.couponId
            },
            url: {
                getData: '/activity/admin/coupon/user'
            }
        }
    },
    mounted() {},
    methods: {
        //强制失效
        forceInvalid(row) {
            this.$confirm('强制失效后，优惠券无法正常使用，确定操作？', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    couponApi.updateInvalid({ id: row.id }).then((res) => {
                        if (res.code == 1) {
                            this.getData()
                            this.$message({ type: 'success', message: '操作成功!' })
                        }
                    })
                })
                .catch(() => {})
        }
    }
}
</script>
<style scoped>
body {
    height: 100%;
}
</style>
