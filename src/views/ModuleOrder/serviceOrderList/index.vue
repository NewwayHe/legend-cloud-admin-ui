<!--
    售后订单管理
-->
<template>
    <section class="h-100">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="退款列表" name="refundOrderList" lazy>
                    <refundOrderList />
                </el-tab-pane>
                <el-tab-pane label="退货列表" name="returnOrderList" lazy>
                    <returnOrderList />
                </el-tab-pane>
                <el-tab-pane label="商家申请列表" name="shopApplication" lazy>
                    <shopApplication />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </section>
</template>
<script>
import refundOrderList from './tabsPage/refundOrderList'
import returnOrderList from './tabsPage/returnOrderList'
import cancelOrderList from './tabsPage/cancelOrderList'
import shopApplication from './tabsPage/shopApplication'

export default {
    name: 'ServiceOrderList',
    components: {
        returnOrderList,
        refundOrderList,
        cancelOrderList,
        shopApplication
    },
    data() {
        return {
            activeName: 'refundOrderList'
        }
    },
    methods: {
        handleClick() {
            // TODO
            //
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs {
    .el-tabs__header.is-top {
        margin-bottom: 20px;
    }
}
</style>
