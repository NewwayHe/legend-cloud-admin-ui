<template>
    <div>
        <el-card>
            <el-row slot="header" type="flex" justify="space-between" align="middle">
                <el-col class="d-flex a-center">
                    <span>商品概况</span>
                    <span class="text-999 font-14">（数据截止：{{ date }})</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            商品概况包括，商品SPU总数、商品SKU总数、在售SKU总数、商品SPU访问次数；
                            <br />
                            统计维度包括，统计截至当天的前一天23:59:59的数据，包括昨日新增（昨天一天24小时）、本周新增（最近七天）、本月新增（最近三十天）、累计总数（系统所有的累计）数据；
                            <br />
                            商品SPU总数 = 统计累计到前一天23:59:59商家发布后的所有商品，只需要剔除被商家永久删除的SPU商品数量；
                            <br />
                            商品SKU总数 = 统计累计到前一天23:59:59商家发布后的所有商品，只需要剔除被商家永久删除的SKU商品数量；
                            <br />
                            在售SKU总数 = 统计累计到前一天23:59:59商家上线&&平台上架的可以在用户端中正常销售的SKU商品数量；
                            <br />
                            商品SPU访问总数 = 统计累计到前一天23:59:59
                            一个用户/游客从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览不需要去重；
                            <br />
                            昨日新增 = 统计前一天24小时内内新增的数据；（统计时间为前一天00:00:00至23:59:59）
                            <br />
                            本月新增 = 统计前三十天新增的数据；（统计时间前一天23:59:59往前推一共三十天）
                            <br />
                            累计总数 = 统计截至当天的前一天23:59:59的所有累计数据（统计系统开始到前一天23:59:59）；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
                <el-button type="text" class="p-0" @click="jump('productSurvey')">查看详情</el-button>
            </el-row>
            <el-row v-loading="isLoading" type="flex" justify="space-around" class="mb-50 mt-50">
                <el-col type="flex" align="middle">
                    <el-row class="font-14">商品SPU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ spuList.spuTotalNum }}</el-row>
                    <el-row class="font-14">日 +{{ spuList.spuTotalNumByDay }}</el-row>
                    <el-row class="font-14 mt-10 mb-10">周 +{{ spuList.spuTotalNumByWeek }}</el-row>
                    <el-row class="font-14">月 +{{ spuList.spuTotalNumByMonth }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">商品SKU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ skuList.skuTotalNum }}</el-row>
                    <el-row class="font-14">日 +{{ skuList.skuTotalNumByDay }}</el-row>
                    <el-row class="font-14 mt-10 mb-10">周 +{{ skuList.skuTotalNumByWeek }}</el-row>
                    <el-row class="font-14">月 +{{ skuList.skuTotalNumByMonth }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">在售SKU总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ skuSaleList.skuTotalNumOnSale }}</el-row>
                    <el-row class="font-14">日 +{{ skuSaleList.skuTotalNumByDayOnSale }}</el-row>
                    <el-row class="font-14 mt-10 mb-10">周 +{{ skuSaleList.skuTotalNumByWeekOnSale }}</el-row>
                    <el-row class="font-14">月 +{{ skuSaleList.skuTotalNumByMonthOnSale }}</el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">商品SPU访问量</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ spuClickList.spuClickTotalNum }}</el-row>
                    <el-row class="font-14">日 +{{ spuClickList.spuClickNumByDay }}</el-row>
                    <el-row class="font-14 mt-10 mb-10">周 +{{ spuClickList.spuClickNumByWeek }}</el-row>
                    <el-row class="font-14">月 +{{ spuClickList.spuClickNumByMonth }}</el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-row :gutter="10" type="flex">
            <el-col :span="12">
                <el-card class="mt-15">
                    <el-row slot="header" type="flex" justify="space-between" align="middle">
                        <el-col class="d-flex a-center">
                            <span>搜索概况</span>
                            <span class="text-999 font-14">（数据截止：{{ date }})</span>
                            <el-tooltip class="item" placement="right">
                                <div slot="content">
                                    统计截至当天的前一天23:59:59的，最近7天搜索数据并且显示排名前五的关键词；
                                    <br />
                                    统计维度包括，每个端搜索关键词的词频；
                                </div>
                                <i class="el-icon-question text-main font-16 ml-5"></i>
                            </el-tooltip>
                        </el-col>
                        <el-button type="text" class="p-0" @click="jump('searchSurvey')">查看详情</el-button>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-radio-group v-model="radio3" size="small" class="text-center" @change="changeRadio">
                            <el-radio label="" border>全部</el-radio>
                            <!-- <el-radio label="MP" border>公众号端</el-radio> -->
                            <el-radio label="MINI" border>小程序端</el-radio>
                            <!-- <el-radio label="APP" border>APP端</el-radio> -->
                            <el-radio label="H5" border>H5端</el-radio>
                        </el-radio-group>
                    </el-row>
                    <el-row type="flex" justify="space-between" class="mt-50">
                        <el-col>
                            <wordcloud :chart-list="wordcloudList" />
                        </el-col>
                        <el-col>
                            <div class="table">
                                <el-table ref="multipleTable" :data="searchData" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                                    <template slot="empty">
                                        <empty empty-type="pro" />
                                    </template>
                                    <el-table-column label="序号" type="index" width="100" align="center" />
                                    <el-table-column prop="word" label="关键词" align="center" />
                                    <el-table-column prop="frequency" label="词频" align="center" />

                                    <!-- <el-table-column label="操作" align="center"  fixed="right" width="180px" >
                                        <template slot-scope="scope">
                                            <span class="table__action">
                                            <el-link :underline="false" type="primary">查看</el-link>
                                            <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                                            <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">修改</el-link>
                                            </span>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12" class="mt-15">
                <el-card class="h-100">
                    <el-row slot="header" type="flex" justify="space-between" align="middle">
                        <el-col class="d-flex a-center">
                            <span>类目概况</span>
                            <span class="text-999 font-14">（数据截止：{{ date }})</span>
                            <el-tooltip class="item" placement="right">
                                <div slot="content">
                                    统计截至当天的前一天23:59:59的，一级类目商品SKU数量排名前五的一级类目排名；
                                    <br />
                                    统计一级类目下关联的二级类目/三级类目下的所有商品SKU数量；
                                    <br />
                                    统计所有商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                                </div>
                                <i class="el-icon-question text-main font-16 ml-5"></i>
                            </el-tooltip>
                        </el-col>
                        <el-button type="text" class="p-0" @click="jump('categorySurvey')">查看详情</el-button>
                    </el-row>
                    <el-row class="h-32"></el-row>
                    <el-row type="flex" justify="space-between" align="middle">
                        <el-col>
                            <chart :chart-list="chartList" />
                        </el-col>
                        <el-col class="h-100">
                            <div class="table">
                                <el-table ref="multipleTable" :data="skuCategory" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                                    <template slot="empty">
                                        <empty empty-type="pro" />
                                    </template>
                                    <el-table-column label="序号" type="index" width="100" />
                                    <el-table-column prop="categoryName" label="类目名称" align="center" />
                                    <el-table-column prop="skuNum" label="商品数量" align="center" />

                                    <!-- <el-table-column label="操作" align="center"  fixed="right" width="180px" >
                                        <template slot-scope="scope">
                                            <span class="table__action">
                                            <el-link :underline="false" type="primary">查看</el-link>
                                            <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                                            <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">修改</el-link>
                                            </span>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { pssApi } from '@/api/ModuleData'
import chart from './charts/chart.vue'
import wordcloud from './charts/wordcloud.vue'
export default {
    name: 'ProductStatistics',
    components: {
        chart,
        wordcloud
    },
    data() {
        return {
            radio3: '',
            spuList: {},
            skuList: {},
            skuSaleList: [],
            spuClickList: [],
            searchData: [],
            skuCategory: [],
            chartList: [],
            wordcloudList: [],
            isLoading: true,
            date: ''
        }
    },
    mounted() {
        this.allRequest()
        this.getSearchData()
        this.getSkuCategory()
        this.getDate()
    },
    methods: {
        getDate() {
            const day1 = new Date()
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
            this.date = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate() + ' 23:59:59'
        },
        jump(e) {
            this.$router.push({
                name: e
            })
        },
        //商品SPU总数
        getSpu() {
            return pssApi.getSpu()
        },
        //商品SKU总数
        getSku() {
            return pssApi.getSku()
        },
        //在售SKU总数
        getSkuSale() {
            return pssApi.getSkuSale()
        },
        //SPU访问量
        getSpuClick() {
            return pssApi.getSpuClick()
        },
        allRequest() {
            this.isLoading = true
            Promise.all([this.getSpu(), this.getSku(), this.getSkuSale(), this.getSpuClick()]).then((res) => {
                console.log(res, 'resaaa')
                this.isLoading = false
                this.spuList = res[0].data
                this.skuList = res[1].data
                this.skuSaleList = res[2].data
                this.spuClickList = res[3].data
            })
        },
        //搜索概况
        getSearchData(e) {
            pssApi.getSearchData(e).then((res) => {
                let list = []
                res.data.map((item) => {
                    list.push({
                        name: item.word,
                        value: item.frequency
                    })
                })
                this.wordcloudList = list
                this.searchData = res.data.slice(0, 5)
            })
        },
        //分类概况s
        getSkuCategory() {
            pssApi.getSkuCategory().then((res) => {
                this.skuCategory = res.data
                res.data.map((item) => {
                    this.chartList.push({
                        value: item.skuNum,
                        name: item.categoryName
                    })
                })
            })
        },
        changeRadio(e) {
            this.getSearchData({
                source: e
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
