<!--
    优惠券->数据报表
-->
<template>
    <section class="redData">
        <!-- 投入产出 -->
        <el-card>
            <div class="font-18 font-weight" style="line-height: 27px">营销活动 - 平台优惠券</div>
            <p>{{ $route.query.couponName || '-' }}</p>
            <div class="mt-20">
                <el-select v-model="activityModel.origin" size="small" placeholder="请选择">
                    <el-option v-for="opt in originOpts" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
                <el-date-picker
                    v-model="activityModel.date"
                    class="mx-20"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button size="small" @click.stop="dbnSearch('activityModel')">搜索</el-button>
            </div>
            <el-row :gutter="20" class="mt-20">
                <el-col :span="12">
                    <p>
                        <span>投入产出</span>
                        <el-tooltip effect="light" placement="right" popper-class="redData-questionPop" trigger="hover">
                            <div slot="content">
                                <p>ROI = 统计时间段内，营销利润金额 ÷ 营销支付金额；</p>
                                <p>
                                    营销支付金额 = 统计时间段内，已付款的活动订单中所有参与活动的商品使用原价和活动价的差额 =（销售价 - 活动价）*
                                    商品数量的累加之和；（也就是参与活动的商品用正常销售价销售和参与活动销售之间的差额）；
                                </p>
                                <p>
                                    营销利润金额 = 统计时间段内，已付款的活动订单中所有参与活动的商品的利润 =（活动价 - 成本价）* 商品数量累加之和；
                                </p>
                            </div>
                            <i class="el-icon-question text-main font-16 ml-5"></i>
                        </el-tooltip>
                    </p>
                    <div class="flex-col-between mt-20">
                        <div class="d-flex bg-bg p-10 w-100">
                            <span class="flex-1 text-center">ROI</span>
                            <span class="flex-1 text-center">营销支付金额</span>
                            <span class="flex-1 text-center">营销利润金额</span>
                        </div>
                        <div class="d-flex p-20 w-100">
                            <span class="flex-1 text-center">{{ activityData.returnOnInvestment | priceComma }}</span>
                            <span class="flex-1 text-center">{{ activityData.marketingPaymentAmount | priceFilter }}</span>
                            <span class="flex-1 text-center">{{ activityData.marketingProfitAmount | priceFilter }}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <p>
                        <span>成交数据</span>
                        <el-tooltip effect="dark" placement="right" popper-class="redData-questionPop" trigger="hover">
                            <div slot="content">
                                <p>
                                    成交金额 = 统计时间段内，已付款并变为已完成状态的订单的金额（若订单完成了售后需要扣除对应金额，不统计运费金额）；
                                </p>
                                <p>成交订单数 = 统计时间段内，已付款并变为已完成状态的订单的数量（若订单完成了售后需要扣除对应数量）；</p>
                                <p>成交商品数 = 统计时间段内，已付款并变为已完成状态的订单中的SKU的数量（若商品完成了售后需要扣除对应数量）；</p>
                            </div>
                            <i class="el-icon-question text-main font-16 ml-5"></i>
                        </el-tooltip>
                    </p>
                    <div class="flex-col-between mt-20">
                        <div class="d-flex bg-bg p-10 w-100">
                            <span class="flex-1 text-center">成交金额</span>
                            <span class="flex-1 text-center">成交订单数</span>
                            <span class="flex-1 text-center">成交商品数</span>
                        </div>
                        <div class="d-flex p-20 w-100">
                            <span class="flex-1 text-center">{{ activityData.transactionAmount | priceFilter }}</span>
                            <span class="flex-1 text-center">{{ activityData.payCount || 0 }}</span>
                            <span class="flex-1 text-center">{{ activityData.dealCount || 0 }}</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- 拉新复购 -->
        <el-card class="mt-20">
            <div>
                <el-select v-model="recruitModel.origin" size="small" placeholder="请选择">
                    <el-option v-for="opt in originOpts" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
                <el-date-picker
                    v-model="recruitModel.date"
                    class="mx-20"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button size="small" @click.stop="dbnSearch('recruitModel')">搜索</el-button>
            </div>
            <el-row :gutter="20" type="flex" justify="space-between" class="mt-20">
                <el-col :span="12">
                    <p>
                        <span>拉新复购</span>
                        <el-tooltip effect="dark" placement="right" popper-class="redData-questionPop" trigger="hover">
                            <div slot="content">
                                <p>
                                    下单用户 =
                                    统计参与该活动的所有用户ID的数量，一个用户ID不管通过什么渠道提交了订单，一个用户ID标记为一个用户数；若一个用户生成多条订单数据，需要去重；
                                </p>
                                <p>
                                    下单新用户 =
                                    统计参与该活动的未在该店铺生成订单的用户ID的数量（若已生成订单但是已完成了售后的用户，也标记为新用户）；
                                </p>
                                <p>下单旧用户 = 统计参与该活动的已在该店铺生成订单的用户ID的数量；</p>
                                <p>下单用户 = 下单新用户 + 下单旧用户；</p>
                            </div>
                            <i class="el-icon-question text-main font-16 ml-5"></i>
                        </el-tooltip>
                    </p>
                    <div class="mt-10 d-flex a-center">
                        <UserPie :chart-data="userPieData" width="70%" height="300px" />
                        <div class="font-12">
                            <p>下单用户{{ recruitData.userCount || 0 }}人</p>
                            <p class="my-10">
                                下单新用户{{ recruitData.orderNewUserCount || 0 }}人， 占比：{{
                                    getPercentage(recruitData.orderNewUserCount, recruitData.userCount)
                                }}%
                            </p>
                            <p>
                                下单旧用户{{ recruitData.orderOldUserCount || 0 }}人，占比：{{
                                    getPercentage(recruitData.orderOldUserCount, recruitData.userCount)
                                }}%
                            </p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12" class="flex-col-between" style="align-self: stretch">
                    <p>
                        <span>流量转化</span>
                        <el-tooltip effect="dark" placement="right" popper-class="redData-questionPop" trigger="hover">
                            <div slot="content">
                                <p>领取次数 = 统计时间段内，领取优惠券的次数；</p>
                                <p>领取用户数 = 统计时间段内，领取优惠券的用户ID数量；同一个用户ID通过多个渠道领取多次优惠券只统计为一人；</p>
                                <p>下单订单数 = 统计时间段内，使用优惠券并且已提交的订单数量（不需要区分是否付款完成）；</p>
                                <p>
                                    下单用户数 =
                                    统计时间段内，使用优惠券并且已提交的订单的用户数量，一个人用户ID通过多个渠道访问多次时需要去重，至统计一次；即一个用户ID在一个人活动中统计的用户数最多只有一次；
                                </p>
                                <p>
                                    成交订单数 = 统计时间段内，使用优惠券并且已付款并变为已完成状态的订单的数量（若订单完成了售后需要扣除对应数量）；
                                </p>
                                <p>
                                    成交用户数 =
                                    统计时间段内，使用优惠券并且已付款并变为已完成状态的订单的用户数量，一个人用户ID通过多个渠道访问多次时需要去重，至统计一次；即一个用户ID在一个人活动中统计的用户数最多只有一次；
                                </p>
                                <p>转化率 = 成交用户数 ÷ 领取用户数；</p>
                            </div>
                            <i class="el-icon-question text-main font-16 ml-5"></i>
                        </el-tooltip>
                    </p>
                    <div class="mt-10 convert-wrap flex-1 flex-between w-100">
                        <div class="position-relative overflow-h convert-container" style="width: 80%">
                            <div class="convert-item">
                                <div class="convert-inner">
                                    <span>领取次数</span>
                                    <span>{{ recruitData.couponsReceivedCount || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    <span>领取用户数</span>
                                    <span>{{ recruitData.couponsReceivedUser || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    访客
                                    <span></span>
                                </div>
                            </div>
                            <div class="convert-item">
                                <div class="convert-inner">
                                    <span>下单订单数</span>
                                    <span>{{ recruitData.orderCount || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    <span>下单用户数</span>
                                    <span>{{ recruitData.userOrderCount || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    下单
                                    <span></span>
                                </div>
                            </div>
                            <div class="convert-item">
                                <div class="convert-inner">
                                    <span>成交订单数</span>
                                    <span>{{ recruitData.payCount || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    <span>成交用户数</span>
                                    <span>{{ recruitData.userPayCount || 0 }}</span>
                                </div>
                                <div class="convert-inner">
                                    成交
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div class="convert-line"></div>
                        <div class="conver-rate">转化率={{ getPercentage(recruitData.userPayCount, recruitData.couponsReceivedUser) }}%</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- 数据趋势 -->
        <el-card class="mt-20">
            <p>
                <span>数据趋势</span>
                <el-tooltip effect="dark" placement="right" popper-class="redData-questionPop" trigger="hover">
                    <div slot="content">
                        <p>
                            新增成交金额 =
                            显示当天00:00:00至23:59:59，已付款并变为已完成状态的订单的金额（若订单完成了售后需要扣除对应金额，不统计运费金额）；大于等于0的整数，保留小数点后两位；
                        </p>
                        <p>
                            累计成交金额 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，已付款并变为已完成状态的订单的金额（若订单完成了售后需要扣除对应金额，不统计运费金额）；大于等于0的整数，保留小数点后两位；
                        </p>
                        <p>
                            新增成交订单数 =
                            显示当天00:00:00至23:59:59，已付款并变为已完成状态的订单的数量（若订单完成了售后需要扣除对应数量）；大于等于0的整数；
                        </p>
                        <p>
                            累计成交订单数 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，已付款并变为已完成状态的订单的数量（若订单完成了售后需要扣除对应数量）；大于等于0的整数；
                        </p>
                        <p>
                            新增成交数量 =
                            显示当天00:00:00至23:59:59，已付款并变为已完成状态的订单中的SKU的数量（若商品完成了售后需要扣除对应数量）；大于等于0的整数；
                        </p>
                        <p>
                            累计成交数量 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，已付款并变为已完成状态的订单中的SKU的数量（若商品完成了售后需要扣除对应数量）；大于等于0的整数；
                        </p>
                        <p>
                            新增下单用户数 = 显示当天00:00:00至23:59:59，
                            统计时间段内，已提交的订单的用户数量，一个人用户ID通过多个渠道访问多次时需要去重，至统计一次；即一个用户ID在一个人活动中统计的人数最多只有一次；
                        </p>
                        <p>
                            累计下单用户数 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，统计时间段内，已提交的订单的用户数量，一个人用户ID通过多个渠道访问多次时需要去重，至统计一次；即一个用户ID在一个人活动中统计的人数最多只有一次；
                        </p>
                        <p>
                            新增访问次数 = 显示当天00:00:00至23:59:59，
                            访问参与活动的商品详情页的次数，按照接口请求数据为准，一天内同一个用户ID访问多次只统计为一次，但是同一个用户ID分别以多个渠道访问多次则每个渠道统计为一次；
                        </p>
                        <p>
                            累计访问次数 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，访问参与活动的商品详情页的次数，按照接口请求数据为准，一天内同一个用户ID访问多次只统计为一次，但是同一个用户ID分别以多个渠道访问多次则每个渠道统计为一次；
                        </p>
                        <p>
                            新增访问人数 =
                            显示当天00:00:00至23:59:59，访问参与活动商品的商品详情页的用户ID数量；一天内同一个用户ID通过多个渠道访问多次只统计为一人；
                        </p>
                        <p>
                            累计访问人数 =
                            累计时间段内的开始日期00:00:00至后面每一天的23:59:59，访问参与活动商品的商品详情页的用户ID数量；一天内同一个用户ID通过多个渠道访问多次只统计为一人；
                        </p>
                    </div>
                    <i class="el-icon-question text-main font-16 ml-5"></i>
                </el-tooltip>
            </p>
            <div class="mt-20">
                <el-select v-model="trendModel.origin" size="small" placeholder="请选择">
                    <el-option v-for="opt in originOpts" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
                <el-date-picker
                    v-model="trendModel.date"
                    class="mx-20"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
                <el-button size="small" @click.stop="dbnSearch('trendModel')">搜索</el-button>
                <el-button size="small" @click.stop="dbnExcel">导出数据</el-button>
            </div>
            <div class="mt-20">
                <TrendLine :chart-data="trendLineData" width="100%" height="600px" :x-axis="trendModel.date" />
            </div>
        </el-card>
    </section>
</template>

<script>
import UserPie from '@/comCommon/coupon/charts/userPie.vue'
import TrendLine from '@/comCommon/coupon/charts/trendLine.vue'
import moment from 'moment'
import { cpApi } from '@/api/ModuleData.js'
import { debounce } from '@/utils/utils'
import { getExcel } from '@/mixins/pages/formFn.js'
export default {
    name: 'RedData',
    // mixins: [ common ],
    components: { UserPie, TrendLine },
    data() {
        // 搜索日期默认取最近一周
        let date = []
        const now = moment()
        date.push(now.format('YYYY-MM-DD'), now.subtract(6, 'd').format('YYYY-MM-DD'))
        date.reverse()
        return {
            activityModel: {
                //投入产出
                origin: undefined, //渠道
                date: [...date], //日期
                list: null //请求结果
            },
            activityData: {},

            originOpts: [
                //渠道来源
                {
                    value: undefined,
                    label: '全部'
                },
                {
                    value: 'PC',
                    label: 'PC端'
                },
                {
                    value: 'MP',
                    label: '小程序端'
                },
                {
                    value: 'APP',
                    label: 'APP端'
                },
                {
                    value: 'H5',
                    label: 'H5端'
                }
            ],
            recruitModel: {
                //拉新复购
                origin: undefined, //渠道
                date: [...date], //日期
                list: null //请求结果
            },
            recruitData: {},
            userPieData: [
                //拉新复购饼图数据
                { value: 0, name: '新用户', type: 'orderNewUserCount' },
                { value: 0, name: '旧用户', type: 'orderOldUserCount' }
            ],

            trendModel: {
                //数据趋势
                origin: undefined, //渠道
                date: [...date], //日期
                list: null //请求结果
            },
            trendLineData: [
                //数据趋势线性图数据 [搜索日期有几天 value就有多长]
                { value: [], name: '新增成交金额', type: 'newTransactionAmount' },
                { value: [], name: '累计成交金额', type: 'transactionAmountList' },
                { value: [], name: '新增成交订单数', type: 'newAddOrderCount' },
                { value: [], name: '累计成交订单数', type: 'orderCountList' },
                { value: [], name: '新增成交数量', type: 'newAddDealCount' },
                { value: [], name: '累计成交数量', type: 'dealCount' },
                { value: [], name: '新增下单用户数', type: 'newOrderUserCount' },
                { value: [], name: '累计下单用户数', type: 'orderUserCountList' },
                { value: [], name: '新增访问次数', type: 'newVisitCount' },
                { value: [], name: '累计访问次数', type: 'visitCountList' },
                { value: [], name: '新增访问人数', type: 'newVisitUserCount' },
                { value: [], name: '累计访问人数', type: 'visitUserCountList' }
            ]
        }
    },
    computed: {},
    watch: {},
    mounted() {
        this.activityModelCount()
        this.recruitModelCount()
        this.trendModelCount()
    },
    methods: {
        // 点击搜索
        dbnSearch: debounce(function (type) {
            this[`${type}Count`]()
        }),
        dbnExcel: debounce(function () {
            getExcel('/data/admin/coupon/statement/platform/page/excel/userAmountCount', this.getDataCount('trendModel'))
        }),
        // 请求数据处理
        getDataCount(type) {
            let {
                origin: source,
                date: [beginTime, endTime]
            } = this[type]
            return { source, beginTime, endTime, couponId: this.$route.query.couponId }
        },
        // 活动名称数据
        activityModelCount() {
            cpApi.amountCount(this.getDataCount('activityModel')).then((res) => {
                if (res.code) {
                    this.activityData = res.data
                }
            })
        },
        // 拉新复购数据
        recruitModelCount() {
            cpApi.userAmountCount(this.getDataCount('recruitModel')).then((res) => {
                if (res.code) {
                    this.recruitData = res.data || {}
                    this.recruitData.userCount = (res.data.orderNewUserCount || 0) + (res.data.orderOldUserCount || 0) //用户总人数
                    this.userPieData.map((item) => {
                        this.$set(item, 'value', res.data[item.type] || 0)
                    })
                }
            })
        },
        // 数据趋势
        trendModelCount() {
            cpApi.userDataCount(this.getDataCount('trendModel')).then((res) => {
                if (res.data && res.data.length) {
                    this.trendLineData.map((item) => {
                        this.$set(
                            item,
                            'value',
                            res.data.map((resMap) => {
                                return resMap[item.type] || 0
                            })
                        )
                    })
                }
            })
        },
        // 百分比
        getPercentage(molecular, denominator) {
            if (!isNaN(molecular / denominator)) {
                return (molecular / denominator) * 100
            } else {
                return 0
            }
        }
    }
}
</script>

<style lang="scss">
/* 问号提示的样式修改 */
.redData-questionPop {
    width: 400px;
    border: 1px solid #eef2f6 !important;
    &[x-placement^='right'] .popper__arrow {
        border-right-color: #eef2f6 !important;
        &::after {
            border-right-color: #eef2f6 !important;
        }
    }
}
</style>

<style lang="scss" scoped>
.convert-wrap {
    position: relative;
    .convert-item {
        display: flex;
        width: 100%;
        .convert-inner {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            flex: 1;
            padding: 10px;
            > span:first-child {
                font-size: 12px;
            }
            > span:last-child {
                margin-top: 10px;
                font-weight: 600;
            }
            &:last-child {
                justify-content: center;
                color: #fff;
            }
        }
        &:first-child {
            background-color: #c7ddfb;
            .convert-inner:last-child {
                background-color: #3397ff;
                position: relative;
                overflow: hidden;
                > span {
                    display: inline-block;
                    position: absolute;
                    top: -20px;
                    left: -62px;
                    width: 70px;
                    height: 130%;
                    background: #c7ddfb;
                    transform: rotate(-15deg);
                }
            }
        }
        &:nth-child(2) {
            background-color: #c4f7c4;
            .convert-inner:last-child {
                background-color: #22ac38;
                position: relative;
                overflow: hidden;
                > span {
                    display: inline-block;
                    position: absolute;
                    top: -20px;
                    left: -33px;
                    width: 60px;
                    height: 126%;
                    background: #c4f7c4;
                    transform: rotate(-15deg);
                }
            }
        }
        &:nth-child(3) {
            background-color: #ffecce;
            .convert-inner:last-child {
                background-color: #f39800;
                position: relative;
                overflow: hidden;
                > span {
                    display: inline-block;
                    position: absolute;
                    top: -24px;
                    left: -33px;
                    width: 80px;
                    height: 138%;
                    background: #ffecce;
                    transform: rotate(-15deg);
                }
            }
        }
    }
    .convert-container::after {
        content: '';
        width: 38%;
        height: 108%;
        position: absolute;
        top: 8%;
        left: 92%;
        background: #fff;
        transform: rotate(15deg);
    }
    .convert-line {
        width: 20px;
        height: 80%;
        border-radius: 30%;
        border-right: 1px solid #000;
        position: absolute;
        top: 8%;
        left: 78%;
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 70%;
            width: 15px;
            height: 15px;
            border: {
                right: 1px solid #000;
                top: 1px solid #000;
            }
            background: #fff;
            transform: rotate(45deg);
        }
    }
    .conver-rate {
        position: absolute;
        top: 50%;
        left: 85%;
        transform: translateY(-50%);
    }
}
</style>
