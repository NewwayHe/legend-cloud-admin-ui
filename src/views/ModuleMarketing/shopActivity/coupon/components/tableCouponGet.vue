<!-- /*
 * @Descripttion:优惠券-领取信息组件
*/ -->
<template>
    <el-card class="table" shadow>
        <el-table
            ref="multipleTable"
            v-loading="tableListLoading"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100 border-left border-right rounded-5"
            size="mini"
            row-key="id"
            header-row-class-name="headerRow"
        >
            <template slot="empty">
                <empty empty-type="pro" text="暂无领取信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="couponCode" show-overflow-tooltip label="券号" />
            <el-table-column prop="mobile" show-overflow-tooltip label="用户手机号" />
            <el-table-column show-overflow-tooltip label="领取时间" width="140">
                <template slot-scope="scope">{{ scope.row.getTime }}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="使用时间" width="140">
                <template slot-scope="scope">{{ scope.row.useTime || '-' }}</template>
            </el-table-column>
            <el-table-column prop="orderNumber" show-overflow-tooltip label="订单编号">
                <template slot-scope="scope">{{ scope.row.orderNumber || '-' }}</template>
            </el-table-column>
            <el-table-column prop="status" show-overflow-tooltip label="状态">
                <template slot-scope="scope">
                    <span :class="'0,1'.includes(scope.row.status) ? 'status-wait' : 'status-done'">{{ scope.row.status | getStatus() }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" class="mt-30" :span="9">
            <pagination
                :current-page="searchFilters.curPage"
                :total="tableTotal"
                :auto-scroll="false"
                @size-change="pageSizeChange"
                @current-change="currentPageChange"
            />
        </el-row>
    </el-card>
</template>
<script>
import common from '@/mixins/pages/commom'
export default {
    components: {},
    filters: {
        getStatus(status) {
            let lableTest = {
                // '-2':'已删除',
                '-1': '已失效',
                0: '未开始',
                1: '未使用',
                2: '已使用'
                // '3':'已结束',
            }
            return lableTest[status]
        }
    },
    mixins: [common],
    props: ['couponId'],
    data() {
        return {
            tableList: [],
            searchFilters: {
                couponId: ''
            },
            url: {
                getData: '/activity/admin/coupon/user'
            }
        }
    },
    computed: {},
    watch: {},
    created() {
        this.isMounted = true
        if (this.couponId) {
            this.searchFilters.couponId = this.couponId
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.table {
    ::v-deep .el-card__body {
        padding: 0px;
    }
}
</style>
