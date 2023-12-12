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
            dataList: ['交易额', '交易商品数', '交易订单数', '订单响应时间', '缺货率', '退款金额', '售后订单数', '下架率'],
            selectedObj: {
                交易额: true,
                交易商品数: false,
                交易订单数: false,
                订单响应时间: false,
                缺货率: false,
                退款金额: false,
                售后订单数: false,
                下架率: false
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
        initChart() {
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
                    data: this.allList.shopId
                },
                series: [
                    {
                        name: '交易额',
                        type: 'bar',
                        data: this.allList.dealAmount
                    },
                    {
                        name: '交易商品数',
                        type: 'bar',
                        data: this.allList.dealGoodNum
                    },
                    {
                        name: '交易订单数',
                        type: 'bar',
                        data: this.allList.dealOrderNum
                    },
                    {
                        name: '订单响应时间',
                        type: 'bar',
                        data: this.allList.orderResponseTime
                    },
                    {
                        name: '缺货率',
                        type: 'bar',
                        data: this.allList.outStockRate
                    },
                    {
                        name: '退款金额',
                        type: 'bar',
                        data: this.allList.refundAmount
                    },
                    {
                        name: '售后订单数',
                        type: 'bar',
                        data: this.allList.refundOrderNum
                    },
                    {
                        name: '下架率',
                        type: 'bar',
                        data: this.allList.undercarriageRate
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
