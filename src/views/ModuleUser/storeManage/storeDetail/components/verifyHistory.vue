<!-- /*
 * @Descripttion:会员订单
*/ -->
<template>
    <el-card>
        <section class="formWarp table">
            <el-form ref="form" :model="form" size="small">
                <el-form-item>
                    <el-table
                        ref="multipleTable"
                        v-loading="tableListLoading"
                        style="width: 900px"
                        :data="tableList"
                        border
                        size="small"
                        tooltip-effect="dark"
                        header-row-class-name="headerRow"
                    >
                        <template slot="empty">
                            <empty empty-type="pro" />
                        </template>
                        <el-table-column prop="auditTime" label="审核日期" align="center" />
                        <el-table-column label="审核结果" align="center">
                            <template slot-scope="scope">
                               <span :class="scope.row.opStatus == 1 ? 'status-pass' : 'status-veto'"> {{ scope.row.opStatus == 1 ? '已通过' : '不通过' }} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="auditOpinion" label="审核意见" align="center" />
                    </el-table>
                </el-form-item>
            </el-form>
        </section>
    </el-card>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: 'VipOrder',
    components: { },
    mixins: [common, cud],
    data() {
        return {
            form: {},
            url: {
                getData: `/shop/admin/shop/detail/${this.$route.query.id}/audit/history`
            },
            isMounted: true
        }
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.self__table {
    &.el-table thead {
        color: #000;
    }
}
</style>
