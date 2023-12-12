<template>
    <div class="search mt-20">
        <el-card shadow="never">
            <div slot="header">
                <span>订单端口分布</span>
            </div>
            <el-form :inline="true" :model="searchFilters" size="small">
                <el-form-item label="店铺：">
                    <el-input v-model="searchFilters.product" placeholder="商品名称" />
                </el-form-item>
                <el-form-item label="统计日期：">
                    <el-date-picker v-model="searchFilters.firstLicenseTime" type="month" placeholder="上牌时间" value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-row class="mt-50">
                <el-col :span="8">
                    <pie-chart />
                </el-col>
                <el-col :span="16">
                    <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableData" tooltip-effect="dark" border class="w-100">
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
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import PieChart from './childCompoents/PieChart2'

export default {
    components: {
        PieChart
    },
    mixins: [common, cud],
    data() {
        return {
            tableData: [],
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
