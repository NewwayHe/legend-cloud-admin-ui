<template>
    <div>
        <el-card>
            <el-row slot="header" type="flex" justify="space-between">
                <el-col :span="23" class="d-flex a-center">
                    <span>累计用户数量统计</span>
                    <span class="text-999 font-14">（数据截止：{{ date }})</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            累计用户数量统计包括，新增用户人数、累计用户人数、累计访问人数、累计支付人数；
                            <br />
                            统计维度包括，统计筛选时间段内对应渠道的数据，包括昨日环比（昨天一天24小时）、本周环比（最近七天）、本月环比（最近三十天）、累计总数（系统所有的累计）数据；
                            <br />
                            新增用户人数 = 统计时间段内新增用户数量的累加之和；
                            <br />
                            累计用户人数 = 统计时间段内用户数量的累加之和；
                            <br />
                            累计访问人数 =
                            统计时间段内每天访问商城系统用户数量的累加之和，一个用户一天访问多次最多每天统计一条数据，每天数据可以叠加统计；
                            <br />
                            累计支付人数 =
                            统计时间段内完成下单并支付的用户数量的累加之和，一个用户一天提交多个订单最多每天统计一条数据，每天数据可以叠加统计；不需要扣除售后数据；
                            <br />
                            计算公式：
                            <br />
                            日环比增减 = 昨天用户数据 - 前天用户数据；
                            <br />
                            周环比增减 = 本周7天内用户数据 - 前一周7天内支付用户数量；
                            <br />
                            月环比增减 = 本月30天内用户数据 - 前一个月30天内支付用户数量；
                            <br />
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
                <el-col :span="1" class="text-center"><el-button type="text" class="p-0" @click="jump('userTotalStatistics')">查看详情</el-button></el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-radio-group v-model="radio3" size="small" class="text-center" @change="radioChange">
                    <el-radio label="" border>全部</el-radio>
                    <!-- <el-radio label="MP" border>公众号端</el-radio> -->
                    <el-radio label="MINI" border>小程序端</el-radio>
                    <!-- <el-radio label="App" border>APP端</el-radio> -->
                    <el-radio label="H5" border>H5端</el-radio>
                </el-radio-group>
            </el-row>
            <el-row v-loading="loading" type="flex" justify="space-around" class="mb-50 mt-50">
                <el-col type="flex" align="middle">
                    <el-row class="font-14">用户新增数量</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ newList.newUser }}</el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">日</el-col>
                        <el-col :span="2">
                            <i v-if="newList.newUserByDay >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>

                        <el-col :span="2">{{ newList.newUserByDay | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14 mt-10 mb-10" type="flex" justify="center">
                        <el-col :span="2">周</el-col>
                        <el-col :span="2">
                            <i v-if="newList.newUserByWeek >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ newList.newUserByWeek | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">月</el-col>
                        <el-col :span="2">
                            <i v-if="newList.newUserByMonth >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ newList.newUserByMonth | absFilters }}</el-col>
                    </el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">用户总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ totalList.allUserNum }}</el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">日</el-col>
                        <el-col :span="2">
                            <i v-if="totalList.allUserNumByDay >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ totalList.allUserNumByDay | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14 mt-10 mb-10" type="flex" justify="center">
                        <el-col :span="2">周</el-col>
                        <el-col :span="2">
                            <i
                                v-if="totalList.allUserNumByWeek >= 0"
                                class="iconfont icon-shangsheng font-14"
                                style="color: rgba(68, 181, 73, 1)"
                            ></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ totalList.allUserNumByWeek | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">月</el-col>
                        <el-col :span="2">
                            <i
                                v-if="totalList.allUserNumByMonth >= 0"
                                class="iconfont icon-shangsheng font-14"
                                style="color: rgba(68, 181, 73, 1)"
                            ></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ totalList.allUserNumByMonth | absFilters }}</el-col>
                    </el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">用户浏览总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ viewList.userViews }}</el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">日</el-col>
                        <el-col :span="2">
                            <i v-if="viewList.userViewsByDay >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ viewList.userViewsByDay | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14 mt-10 mb-10" type="flex" justify="center">
                        <el-col :span="2">周</el-col>
                        <el-col :span="2">
                            <i v-if="viewList.userViewsByWeek >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ viewList.userViewsByWeek | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">月</el-col>
                        <el-col :span="2">
                            <i v-if="viewList.userViewsByMonth >= 0" class="iconfont icon-shangsheng font-14" style="color: rgba(68, 181, 73, 1)"></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ viewList.userViewsByMonth | absFilters }}</el-col>
                    </el-row>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-14">用户消费总数</el-row>
                    <el-row class="font-weight font-28 mt-30 mb-30">{{ consumerList.consumerUser }}</el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">日</el-col>
                        <el-col :span="2">
                            <i
                                v-if="consumerList.consumerUserByDay >= 0"
                                class="iconfont icon-shangsheng font-14"
                                style="color: rgba(68, 181, 73, 1)"
                            ></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ consumerList.consumerUserByDay | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14 mt-10 mb-10" type="flex" justify="center">
                        <el-col :span="2">周</el-col>
                        <el-col :span="2">
                            <i
                                v-if="consumerList.consumerUserByWeek >= 0"
                                class="iconfont icon-shangsheng font-14"
                                style="color: rgba(68, 181, 73, 1)"
                            ></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ consumerList.consumerUserByWeek | absFilters }}</el-col>
                    </el-row>
                    <el-row class="font-14" type="flex" justify="center">
                        <el-col :span="2">月</el-col>
                        <el-col :span="2">
                            <i
                                v-if="consumerList.consumerUserByMonth >= 0"
                                class="iconfont icon-shangsheng font-14"
                                style="color: rgba(68, 181, 73, 1)"
                            ></i>
                            <i v-else class="iconfont icon-xiajiang font-14" style="color: rgba(255, 93, 63, 1)"></i>
                        </el-col>
                        <el-col :span="2">{{ consumerList.consumerUserByMonth | absFilters }}</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-row :gutter="15" type="flex" class="my-15">
            <el-col :span="24">
                <el-card class="h-100">
                    <el-row slot="header" type="flex" justify="space-between">
                        <el-col class="d-flex a-center">
                            <span>地区分布统计</span>
                            <span class="text-999 font-14">（数据截止：{{ date }})</span>
                            <el-tooltip class="item" placement="right">
                                <div slot="content">
                                    统计截至前一天23:59:59内，收货地区排名数据；
                                    <br />
                                    统计下单并支付的订单数据；
                                    <br />
                                    一个用户一天提交多个订单最多每天统计一条数据，每天数据可以叠加统计；
                                </div>
                                <i class="el-icon-question text-main font-16 ml-5"></i>
                            </el-tooltip>
                        </el-col>
                        <!-- <el-button type="text" class="p-0">查看详情</el-button> -->
                    </el-row>
                    <div class="table">
                        <el-table ref="multipleTable" tooltip-effect="dark" :data="areaList" class="w-100" header-row-class-name="headerRow">
                            <template slot="empty">
                                <empty text="暂无数据" />
                            </template>
                            <el-table-column label="排名" type="index" width="48" />
                            <el-table-column prop="province" label="省" />
                            <el-table-column prop="city" label="市" />
                            <el-table-column prop="people" label="人数" />
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
                </el-card>
            </el-col>
            <!-- <el-col :span="12">
                <el-card class="h-100">
                    <el-row slot="header" type="flex" justify="space-between">
                        <span>等级分布统计</span>
                        <el-button type="text" class="p-0">查看详情</el-button>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <chart :chartList="chartList" />
                    </el-row>
                </el-card>
            </el-col> -->
        </el-row>
        <el-row :gutter="15" type="flex" class="my-15">
            <el-col :span="12">
                <el-card>
                    <el-row slot="header" type="flex" justify="space-between">
                        <div class="d-flex a-center">
                            <span>用户购买力排行</span>
                            <span class="text-999 font-14">（数据截止：{{ date }})</span>
                            <el-tooltip class="item" placement="right">
                                <div slot="content">
                                    统计截至前一天23:59:59内，成交订单金额排行前五的用户数据；
                                    <br />
                                    成交订单金额 = 所有变为已完成状态的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                                </div>
                                <i class="el-icon-question text-main font-16 ml-5"></i>
                            </el-tooltip>
                        </div>
                        <el-button type="text" class="p-0" @click="jump('userRanking')">查看详情</el-button>
                    </el-row>
                    <!-- 柱状图 -->
                    <el-row>
						<chart id="userBuyId" :chart-list="chartList1" v-if="chartList1&&chartList1.length"/>
						<empty text="暂无数据" v-else/>
					</el-row>

                    <div class="table">
                        <el-table ref="multipleTable" tooltip-effect="dark" class="w-100" :data="purchasingList" header-row-class-name="headerRow">
                            <template slot="empty">
                                <empty text="暂无数据" />
                            </template>
                            <el-table-column label="序号" type="index" width="48" />
                            <el-table-column prop="userId" label="用户ID" />
                            <el-table-column prop="mobile" label="手机号码" />
                            <el-table-column prop="money" label="累计成交订单金额">
                                <template slot-scope="scope">
                                    {{ scope.row.money | priceFilter }}
                                </template>
                            </el-table-column>
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
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="h-100">
                    <el-row slot="header" type="flex" justify="space-between">
                        <div class="d-flex a-center">
                            <span>店铺销售排行</span>
                            <span class="text-999 font-14">（数据截止：{{ date }})</span>
                            <el-tooltip class="item" placement="right">
                                <div slot="content">
                                    统计截至前一天23:59:59内，成交订单金额排行前五的店铺数据；
                                    <br />
                                    成交订单金额 = 所有变为已完成状态的订单金额；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                                </div>
                                <i class="el-icon-question text-main font-16 ml-5"></i>
                            </el-tooltip>
                        </div>
                        <el-button type="text" class="p-0" @click="jump('storeSalesRanking')">查看详情</el-button>
                    </el-row>
                    <!-- 柱状图 -->
                    <el-row>
						<chart id="shopSaleId" :chart-list="chartList2" v-if="chartList2&&chartList2.length"/>
						<empty text="暂无数据" v-else/>
					</el-row>
                    <div class="table">
                        <el-table ref="multipleTable" tooltip-effect="dark" class="w-100" :data="shopList" header-row-class-name="headerRow">
                            <template slot="empty">
                                <empty text="暂无数据" />
                            </template>
                            <el-table-column label="序号" type="index" width="48" />
                            <el-table-column prop="shopId" label="店铺ID" />
                            <el-table-column prop="shopName" label="店铺名称" width="140"/>
                            <el-table-column prop="money" label="累计成交订单金额">
                                <template slot-scope="scope">
                                    {{ scope.row.money | priceFilter }}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="操作" align="center"  fixed="right" width="180px">
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
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import chart from './components/chart.vue'
import { ussApi, utsApi } from '@/api/ModuleData'
export default {
    name: 'UserStatistics',
    components: {
        chart
    },
    filters: {
        // 取绝对值
        absFilters(val) {
            return Math.abs(val)
        }
    },
    data() {
        return {
            radio3: '',
            searchFilters: {},
            value2: '',
            shopList: ['用户总数统计', '用户新增统计', '用户浏览统计', '用户消费统计'],
            areaList: [],
            purchasingList: [],
            shopList: [],
            newList: [],
            totalList: [],
            consumerList: [],
            viewList: [],
            chartList1: [],
            chartList2: [],
            loading: true,
            date: []
        }
    },
    created() {
        this.getDate()
        this.getArea()
        // this.getGrade();
        this.getPurchasing()
        this.getShop()
        this.allRequest()
    },
    methods: {
        getDate() {
            const day1 = new Date()
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
            this.date = day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate() + ' 23:59:59'
        },
        jump(e) {
            this.$router.push({ name: e })
        },
        radioChange(e) {
            this.allRequest({ source: e })
        },
        getArea() {
            ussApi.getArea().then((res) => {
                this.areaList = res.data
            })
        },
        //等级分布统计
        // getGrade() {
        //     ussApi.getGrade().then(res => {
        //         res.data.map(item => {
        //             this.chartList.push({
        //                 value: Math.floor(item.percentage * 100) / 100,
        //                 name: item.grade
        //             });
        //         });
        //     });
        // },
        //用户购买力排行
        getPurchasing() {
            ussApi.getPurchasing().then((res) => {
                this.purchasingList = res.data
                this.chartList1 =  res.data.map((item) => {
                    return {
                        value: item.money,
                        name: item.userId
                    }
                })
            })
        },
        //店铺销售排行
        getShop() {
            ussApi.getShop().then((res) => {
                this.shopList = res.data
                this.chartList2 = res.data.map((item) => {
                    return {
                        value: item.money,
                        name: item.shopName
                    }
                })
            })
        },
        //用户新增数量
        getNew(e) {
            return ussApi.getNew(e)
        },
        //用户总数
        getTotal(e) {
            return ussApi.getTotal(e)
        },
        //用户消费总数
        getConsumer(e) {
            return ussApi.getConsumer(e)
        },
        //用户浏览总数
        getView(e) {
            return utsApi.getView(e)
        },
        allRequest(e) {
            this.loading = true
            //顶部数据并发请求
            Promise.all([this.getNew(e), this.getTotal(e), this.getConsumer(e), this.getView(e)]).then((res) => {
                this.loading = false
                this.newList = res[0].data
                this.totalList = res[1].data
                this.consumerList = res[2].data
                this.viewList = res[3].data
            })
        }
    }
}
</script>

<style></style>
