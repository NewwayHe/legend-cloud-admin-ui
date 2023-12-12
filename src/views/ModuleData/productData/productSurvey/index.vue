<!--
    商品报表->商品概况
-->
<template>
    <div>
        <el-card class="mb-15">
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>商品概况</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            默认显示截至前一天23:59:59的商城中所有商家的商品数据（商品SPU总数、商品SKU总数、在售SKU总数）；<br />
                            商品SPU总数：统计时间段内新增的SPU数量累加之和（扣除永久删除的商品数量）；<br />
                            商品SSKU总数：统计时间段内新增的SKU数量累加之和（扣除永久删除的商品数量）；<br />
                            在售SKU总数：统计时间段内新增的在售SKU数量累加之和（只统计商家上线&&平台上架的商品数量）
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5 "></i>
                    </el-tooltip>
                </el-col>
            </el-row>

            <div class="search">
                <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                    <el-form-item>
                        <el-select v-model="id" clearable filterable placeholder="全部店铺">
                            <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="date1" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-row v-loading="isLoading" type="flex" class="mt-60 mb-50">
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{detail.spuNum}}</el-row>
                    <el-row class="text-center mb-5 font-14">商品SPU总数</el-row>
                </el-col>
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{detail.skuNum}}</el-row>
                    <el-row class="text-center mb-5 font-14">商品SKU总数</el-row>
                </el-col>
                <el-col>
                    <el-row class="text-center font-weight font-36 mb-10">{{detail.skuNumSale}}</el-row>
                    <el-row class="text-center mb-5 font-14">在售SKU总数</el-row>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="mb-15">
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>商品访问</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            默认显示截至前一天23:59:59的最近七天所有渠道的数据；</br>
                            可切换渠道或者筛选单个商品在时间段内的数据
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5 "></i>
                    </el-tooltip>
                </el-col>
            </el-row>

            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" label-width="0">
                    <el-form-item>
                        <el-select v-model="searchFilters.shopId" clearable filterable placeholder="全部店铺" @change="changeShop">
                            <el-option v-for="(item,index) in shopList" :key="item.id" :label="item.shopName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="goodId" clearable filterable placeholder="全部商品" @change='changeGood'>
                            <el-option v-for="(item,index) in restaurants" :key="item.goodId" :label="item.goodName"  :value="item.goodId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="date2" :clearable="false" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" class="ml-15"
                            value-format="yyyy-MM-dd HH:mm:ss" @change="changeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExcel">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
            <linechart :all-list="allList" />

            <div class="table mt-20">
                <el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark"
                    class="w-100" @sort-change="changeSort" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" fixed="left" width="48"/>
                    <el-table-column prop="shopName" label="店铺名称" fixed="left" width="140"/>
                    <el-table-column prop="goodId" label="商品ID" fixed="left" width="80"/>
                    <el-table-column prop="goodName" label="商品名称" fixed="left" width="280"/>
                    <el-table-column prop="people" sortable="custom" label="全渠道商品访问量" min-width="140"/>
                    <el-table-column prop="frequency" sortable="custom" label="全渠道商品访问数" min-width="140"/>
                    <!-- <el-table-column prop="mpPeople" sortable="custom" width="180" label="公众号商品访问量"/>
                    <el-table-column prop="mpFrequency" sortable="custom" width="180" label="公众号商品访问数"/> -->
                    <el-table-column prop="miniPeople" sortable="custom" label="小程序商品访问量" min-width="140"/>
                    <el-table-column prop="miniFrequency" sortable="custom" label="小程序商品访问数" min-width="140"/>
                    <!-- <el-table-column prop="appPeople" sortable="custom" width="180" label="APP商品访问量"/>
                    <el-table-column prop="appFrequency" sortable="custom" width="180" label="APP商品访问数"/> -->
                    <el-table-column prop="h5People" sortable="custom" label="H5商品访问量" min-width="120"/>
                    <el-table-column prop="h5Frequency" sortable="custom" label="H5商品访问数"  min-width="120"/>
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
                <el-row type="flex" justify="end" class="mt-30">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange"
                        @current-change="currentPageChange" />
                </el-row>
            </div>
        </el-card>
    </div>

</template>

<script>
    import common from './mixins/commom'
    import linechart from './components/lineChart'
    import {
        psyApi
    } from '@/api/ModuleData'
    export default {
        name: 'ProductSurvey',
        components: {
            linechart
        },
        mixins: [common],
        data() {
            return {
                restaurants: [],
                restaurants2: [],
                state: '',
                state2: '',
                detail: {},
                shopList: {},
                linList: [],
                id: null,
                date: null,
                url: {
                    getData: '/product/admin/count/shop/page',
                    getLine: '/product/admin/count/shop/line',
                    getExcel: '/product/admin/count/shop/page/excel'
                },
                input: '',
                searchFilters: {},
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                date1: [],
                date2: [],
                dateList: [],
                people: [],
                frequency: [],
                appPeople: [],
                appFrequency: [],
                isLoading: true,
                goodId:null
            };
        },
        watch: {
            value2(a) {
                console.log(a);
            }
        },
        created() {
            this.getDetail()
            this.getList()
            this.getDate()
        },
        mounted() {},
        mounted() {
            this.loadAll();
        },
        methods: {
            changeGood(e){
              this.searchFilters.goodId = e
            },
            changeShop(e){
                this.goodId = null
                this.loadAll(e);
            },
            getDate() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                this.date2.push(start, end)
            },
            changeState(e) {
                this.searchFilters.shopId = e
            },
            changeState2(e) {
                this.searchFilters.goodId = e
            },
            //商品概况
            getDetail(e) {
                psyApi.getDetail(e).then(res => {
                    this.isLoading = false
                    this.detail = res.data
                })
            },
            //店铺list
            getList() {
                psyApi.getList().then(res => {
                    this.shopList = res.data
                })
            },
            search() {
                this.getDetail({
                    id: this.id,
                    startDate: this.date1[0],
                    endDate: this.date1[1]
                })
            },
            querySearch(queryString, cb) {
                var shopList = this.shopList;
                var results = queryString ? shopList.filter(this.createFilter(queryString)) : shopList;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch2(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.shopName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            createFilter2(queryString) {
                return (restaurant) => {
                    return (restaurant.goodName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            //商品list
            loadAll(id) {
                psyApi.getgoodList({
                    shopId: id
                }).then(res => {
                    this.restaurants = res.data
                })
            },
            handleSelect(item) {
                console.log(item, 'shopid');
                this.loadAll(item.id)
                this.state = item.shopName
                this.searchFilters.shopId = item.id
            },
            handleSelect2(item) {
                this.state2 = item.goodName
                this.searchFilters.goodId = item.goodId
            },
            handleIconClick(ev) {
                console.log(ev, 'ev');
            },
            changeDate() {
                if (this.date2) {
                    console.log(this.date)
                    this.$set(this.searchFilters, 'startDate', this.date2[0])
                    this.$set(this.searchFilters, 'endDate', this.date2[1])
                } else {
                    this.$set(this.searchFilters, 'startDate', '')
                    this.$set(this.searchFilters, 'endDate', '')
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>
