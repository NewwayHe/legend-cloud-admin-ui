<!--
    商品报表->商品销售排行
-->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>商品销售排行</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            商品销售排行包括，销售价、累计成交金额、累计成交量、累计访问次数、累计商品收藏量；<br />
                            统计维度，统计筛选时间段内所有渠道每个SKU商品的数据；<br />
                            销售价 = 该SKU最新的当前的销售价格；<br />
                            累计成交金额 =
                            以SKU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SKU商品被提交订单并支付的订单金额；若订单项完成了售后，则需要扣除数据；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；<br />
                            累计成交数量 =
                            以SKU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SKU商品被提交订单并支付的商品数量；成交量是统计订单项中的所有商品数量；若订单项完成了售后，则需要扣除数据；<br />
                            累计访问次数 =
                            以SPU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SPU商品被浏览的次数累加之和；一个用户ID/游客IP从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览不需要去重；<br />
                            累计商品收藏量 = 以SPU商品为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，SPU商品当前被收藏量累加之和；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item>
                        <el-select v-model="searchFilters.shopId" @change="changeShop" clearable filterable placeholder="全部店铺">
                            <el-option v-for="(item, index) in shopList" :key="item.id" :label="item.shopName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="goodId" clearable filterable placeholder="全部商品" @change="changeGood">
                            <el-option v-for="(item, index) in restaurants" :key="item.goodId" :label="item.goodName"
                                :value="item.goodId"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item><el-input placeholder="店铺名称" v-model="searchFilters.shopName"></el-input></el-form-item>
                    <el-form-item><el-input placeholder="商品名称" v-model="searchFilters.productName"></el-input></el-form-item> -->
                    <el-form-item>
                        <el-date-picker v-model="date" :clearable="false"  :picker-options="pickerOptions"  @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="table">
                <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark"
                    class="w-100" @selection-change="selectionChange" @sort-change="changeSort" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="shopName" label="店铺名称" width="140" />
                    <el-table-column prop="image" label="商品" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 60px" :src="scope.row.image" :options="{ w: '60', h: '60', br: '4' }"/>
                                <div class="ml-10 flex-col-between">
                                    <el-link :underline="false" type="primary">
                                        <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.productName">
                                            <!-- <el-link :underline="false" type="primary" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+goodsInfo.productId">{{$shareRedirectUrl+'?detailsType=good&id='+goodsInfo.productId}}</el-link> -->
                                            <div slot="reference" class="text-two text-left">{{ scope.row.productName }}</div>
                                        </el-popover>
                                    </el-link>
                                    <span class="text-999 mt-10 line-clamp2" v-if="scope.row.skuName">{{ scope.row.skuName }}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="销售价" sortable="custom" width="115">
                        <template slot-scope="scope">
                            {{ scope.row.price | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column label="累计成交金额" prop="dealAmount" sortable="custom" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.dealAmount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealGoodNum" label="累计成交数量" sortable="custom" min-width="120"/>
                    <el-table-column prop="viewNum" label="累计访问次数" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column prop="favoriteNum" label="累计商品收藏量" sortable="custom" min-width="130"/>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary" @click="toDataTrend(scope.row)">查看销售趋势</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
    </section>
</template>

<script>
    import common from '@/mixins/pages/commom'
    import cud from '@/mixins/pages/cud'
    import { psyApi } from '@/api/ModuleData'
    export default {
        name: 'salesRanking',
        data() {
            return {
                searchFilters: {},
                date: [],
                url: {
                    getData: '/product/admin/count/sale/order',
                    getExcel: '/product/admin/count/sale/order/excel'
                },
                shopList: {}, //店铺列表
                restaurants: [], //商品列表
                goodId: null, //商品id
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 3600 * 1000 * 24; // 选当前时间之前的时间
                    }
                }
            }
        },
        mixins: [common, cud],
        mounted() {
            this.getDate()
            this.getList()
        },
        methods: {
            //选中店铺
            changeShop(e) {
                let shopName = this.shopList.filter((item) => {
                    return item.id == e
                })[0].shopName
                console.log(shopName);
                console.log(e);
                this.goodId = null
                this.loadAll(e);
                this.searchFilters.shopName = shopName
            },
            //选中商品
            changeGood(e) {
                this.searchFilters.productId = e
            },
            //店铺list
            getList() {
                psyApi.getList().then((res) => {
                    this.shopList = res.data
                })
            },
            //商品list
            loadAll(id) {
                console.log(id, 'idd')
                psyApi
                    .getgoodList({
                        shopId: id
                    })
                    .then((res) => {
                        this.restaurants = res.data
                        // this.searchFilters.goodId = 666
                    })
            },
            getDate() {
                const end = new Date()
                const start = new Date()
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                this.date.push(start, end)
            },
            toDataTrend(row) {
                this.$router.push({
                    name: 'dataTrends',
                    query: {
                        productId: row.productId
                    }
                })
            },
            changeDate() {
                if (this.date) {
                    this.$set(this.searchFilters, 'startDate', this.date[0])
                    this.$set(this.searchFilters, 'endDate', this.date[1])
                } else {
                    this.$set(this.searchFilters, 'startDate', '')
                    this.$set(this.searchFilters, 'endDate', '')
                }
            }
        }
    }
</script>

<style></style>
