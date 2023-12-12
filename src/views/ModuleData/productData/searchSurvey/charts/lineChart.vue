<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/Charts/mixins/resize'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '500px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Array
        },
        allList: {
            type: Array
        }
    },
    data() {
        return {
            chart: null,
            dlist: []
        }
    },
    watch: {
        // chartData: {
        //     deep: true,
        //     handler(val) {
        //         this.setOptions(val)
        //     }
        // },
        allList(a) {
            this.initChart()
            console.log(a, 'aaa')
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
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartData)
        },
        setOptions(chartData) {
            this.chart.setOption({
                backgroundColor: 'transparent',
                legend: {
                    data: [
                        '全部渠道搜索人数',
                        '全部渠道搜索次数',
                        // '公众号端搜索人数',
                        // '公众号端搜索次数',
                        '小程序端搜索人数',
                        '小程序端搜索次数',
                        // 'APP端搜索人数',
                        // 'APP端搜索次数',
                        'H5端搜索人数',
                        'H5端搜索次数'
                    ],
                    bottom: 0
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 0,
                    right: 0,
                    top: '20px',
                    containLabel: true,
                    backgroundColor: 'transparent'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    data: this.allList[0]
                },
                yAxis: {
                    type: 'value',
                    // 坐标轴轴线配置
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    // 分割线配置
                    splitLine: {
                        show: false
                    },
                    // 坐标轴在 grid 区域中的分隔区域
                    splitArea: {
                        show: false
                    },
                    // 坐标轴刻度相关设置。
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        smooth: false,
                        name: '全部渠道搜索人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(38, 58, 239, 1)'
                            }
                        },
                        data: this.allList[1]
                    },
                    {
                        smooth: false,
                        name: '全部渠道搜索次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(45, 140, 240, 1)'
                            }
                        },
                        data: this.allList[2]
                    },
                    /* {
                        smooth: false,
                        name: '公众号端搜索人数',
                        type: 'line',

                        itemStyle: {
                            normal: {
                                color: 'rgba(245, 108, 108, 1)'
                            }
                        },
                        data: this.allList[3]
                    },
                    {
                        smooth: false,
                        name: '公众号端搜索次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(244, 205, 73, 1)'
                            }
                        },
                        data: this.allList[4]
                    }, */
                    {
                        smooth: false,
                        name: '小程序端搜索人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(124, 75, 216, 1)'
                            }
                        },
                        data: this.allList[5]
                    },
                    {
                        smooth: false,
                        name: '小程序端搜索次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(224, 86, 103, 1)'
                            }
                        },
                        data: this.allList[6]
                    },
                    /* {
                        smooth: false,
                        name: 'APP端搜索人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(140, 86, 83, 1)'
                            }
                        },
                        data: this.allList[7]
                    },
                    {
                        smooth: false,
                        name: 'APP端搜索次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(160, 86, 63, 1)'
                            }
                        },
                        data: this.allList[8]
                    }, */
                    {
                        smooth: false,
                        name: 'H5端搜索人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(180, 86, 43, 1)'
                            }
                        },
                        data: this.allList[9]
                    },
                    {
                        smooth: false,
                        name: 'H5端搜索次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(200, 86, 23, 1)'
                            }
                        },
                        data: this.allList[10]
                    }
                ]
            })
        }
    }
}
</script>
