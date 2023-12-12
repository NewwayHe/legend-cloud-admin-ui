<!-- /*
 * @Descripttion:销售分析
*/ -->
<template>
    <div>
        <!-- 顶部信息 -->
        <!-- 内容部分 -->
        <el-row :gutter="10">
            <!-- 左侧信息 -->
            <el-col :span="12">
                <el-card>
                    <el-row slot="header" type="flex" justify="space-between" class="font-14">
                        <span>订单转化率</span>
                    </el-row>
                    <div class="text-center">
                        <el-row>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/total_money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">访问总次数</span>
                            </el-col>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">订单总数</span>
                            </el-col>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">订单转化率</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card class="mt-15">
                    <el-row slot="header" type="flex" justify="space-between" class="font-14">
                        <span>平均订单金额</span>
                    </el-row>
                    <div class="text-center">
                        <line-chart height="300px" :chart-data="lineChartData" />
                    </div>
                </el-card>
            </el-col>
            <!-- 左侧信息 -->
            <!-- 右侧信息 -->
            <el-col :span="12">
                <el-card>
                    <el-row slot="header" type="flex" justify="space-between" class="font-14">
                        <span>注册会员购买率</span>
                    </el-row>
                    <div class="text-center">
                        <el-row>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/total_money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">会员总数（只统计有效用户）</span>
                            </el-col>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">会员订单数</span>
                            </el-col>
                            <el-col :span="8">
                                <el-avatar :size="32" :src="require('@/assets/icons/userInfo/money.png')" />
                                <div class="font-weight font-36">0.00</div>
                                <span class="font-help text-999">注册会员购买率</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>

                <el-card class="mt-15">
                    <el-row slot="header" type="flex" justify="space-between" class="font-14">
                        <span>平均会员订单量</span>
                    </el-row>
                    <div class="text-center">
                        <line-chart height="300px" :chart-data="lineChartData" />
                    </div>
                </el-card>
            </el-col>
            <!-- 右侧信息 -->
        </el-row>
        <!-- 内容部分 -->
    </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart'
const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
}

export default {
    name: 'SaleAnalys',
    components: {
        LineChart
    },
    data() {
        return {
            lineChartData: lineChartData.newVisitis,
            activeName: 'second',
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
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
