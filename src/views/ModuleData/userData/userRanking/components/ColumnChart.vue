<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        id: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '500px'
        },
        allList: {
            type: Object
        }
    },
    data() {
        return {
            chart: null,
            dataList: [
                '下单订单金额',
                '下单订单数量',
                '支付订单金额',
                '支付订单数量',
                '成交订单金额',
                '成交订单数量',
                '累计下单订单金额',
                '累计下单订单数量',
                '累计支付订单金额',
                '累计支付订单数量',
                '累计成交订单金额',
                '累计成交订单数量',
                '客单价'
            ],
            selectedObj: {
                下单金额: true,
                下单数量: false,
                支付金额: false,
                支付数量: false,
                成交金额: false,
                成交数量: false,
                累计下单金额: false,
                累计下单数量: false,
                累计支付金额: false,
                累计支付数量: false,
                累计成交金额: false,
                累计成交数量: false,
                客单价: false
            }
        }
    },
    watch: {
        allList(nv, ov) {
            this.initChart()
        }
    },
    mounted() {},
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart(a) {
            this.chart = echarts.init(document.getElementById(this.id))
            let option = {
                // title: {
                //     text: '世界人口总量',
                //     subtext: '数据来自网络'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: this.dataList,
                    selected: this.selectedObj
                },
                dataZoom: [
                    {
                        type: 'slider', //滑动条
                        show: true, //开启
                        yAxisIndex: [0],
                        left: '1%', //滑动条位置
                        start: 1, //初始化时，滑动条宽度开始标度
                        end: 30 //初始化时，滑动条宽度结束标度
                    }
                ],
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: this.allList.userId
                },
                series: [
                    {
                        name: '下单订单金额',
                        type: 'bar',
                        data: this.allList.totalAmount
                    },
                    {
                        name: '下单订单数量',
                        type: 'bar',
                        data: this.allList.totalQuantity
                    },
                    {
                        name: '支付订单金额',
                        type: 'bar',
                        data: this.allList.payAmount
                    },
                    {
                        name: '支付订单数量',
                        type: 'bar',
                        data: this.allList.payQuantity
                    },
                    {
                        name: '成交订单金额',
                        type: 'bar',
                        data: this.allList.dealAmount
                    },
                    {
                        name: '成交订单数量',
                        type: 'bar',
                        data: this.allList.dealQuantity
                    },
                    {
                        name: '累计下单订单金额',
                        type: 'bar',
                        data: this.allList.cumulationTotalAmount
                    },
                    {
                        name: '累计下单订单数量',
                        type: 'bar',
                        data: this.allList.cumulationTotalQuantity
                    },
                    {
                        name: '累计支付订单金额',
                        type: 'bar',
                        data: this.allList.cumulationPayAmount
                    },
                    {
                        name: '累计支付订单数量',
                        type: 'bar',
                        data: this.allList.cumulationPayQuantity
                    },
                    {
                        name: '累计成交订单金额',
                        type: 'bar',
                        data: this.allList.cumulationDealAmount
                    },
                    {
                        name: '累计成交订单数量',
                        type: 'bar',
                        data: this.allList.cumulationDealQuantity
                    },
                    {
                        name: '客单价',
                        type: 'bar',
                        data: this.allList.customerPrice
                    }
                ]
            }
            this.chart.setOption(option)
            this.chart.on('legendselectchanged', (par) => {
                for (let key in this.selectedObj) {
                    if (key == par.name) {
                        this.selectedObj[key] = true
                    } else {
                        this.selectedObj[key] = false
                    }
                }
                this.chart.clear()
                this.chart.setOption(option)
            })
        }
    }
}
</script>
