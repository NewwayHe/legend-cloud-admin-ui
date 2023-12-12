<template>
    <div class="search mt-20">
        <el-card shadow="never">
            <div slot="header">
                <span>订单地区分布</span>
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
                <map-chart />
            </el-row>
        </el-card>
    </div>
</template>
<script>
import mapChart from './childCompoents/mapChart'
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    components: {
        mapChart
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
