<template>
    <div>
        <el-card shadow="never">
            <div class="search">
                <div slot="header">
                    <span>数据趋势</span>
                </div>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="店铺名称：">
                        <el-input v-model="searchFilters.product" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="统计日期：">
                        <el-date-picker
                            v-model="searchFilters.firstLicenseTime"
                            type="month"
                            placeholder="上牌时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" justify="end" class="mb-20">
                    <el-button size="small">开启辅助线</el-button>
                    <el-button size="small">关闭辅助线</el-button>
                    <el-button size="small">清空辅助线</el-button>
                    <el-button size="small">数据视图</el-button>
                    <el-button size="small">折线图</el-button>
                    <el-button size="small">柱状图</el-button>
                    <el-button size="small">还原</el-button>
                    <el-button size="small">保存图片</el-button>
                </el-row>
                <line-chart :chart-data="lineChartData" />
                <!--列表-->
                <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableData" tooltip-effect="dark" class="w-100">
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="productName" label="统计日期" />
                    <el-table-column prop="productName" label="订单数量" />
                    <el-table-column prop="productName" label="订单金额" />
                    <el-table-column prop="productName" label="操作" align="center" >
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary">查看</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-20">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>

                <el-alert title="成功提示的文案" type="warning" class="theme" :closable="false" show-icon />
                <el-alert type="warning" class="defalult" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>单价，是指该商品SKU价格</p>
                        <p>累计成交额，统计所有已完成状态订单中该商品SKU的销售金额；</p>
                        <p>累计成交数，统计所有已完成状态订单中该商品SKU的销售数量；</p>
                        <p>商品收藏量，统计该商品被用户收藏的数量；</p>
                    </div>
                </el-alert>
            </div>
        </el-card>
    </div>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import LineChart from './childCompoents/LineChart'

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
    components: {
        LineChart
    },
    mixins: [common, cud],
    data() {
        return {
            tableData: [],
            lineChartData: lineChartData.newVisitis,
            url: {
                getData: 'https://www.fastmock.site/mock/1f96ea7950663d0c9931f18605f61453/pages/page',
                update: '/custPhoneInfoService/update',
                delete: '/custPhoneInfoService/deleteById',
                create: '/custPhoneInfoService/create',
                mulDel: '/custPhoneInfoService/mulDelete' // 注意返回去的是id的数组['asb','sdf']
            }
        }
    }
}
</script>
