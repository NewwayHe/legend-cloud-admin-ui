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
            type: Object
        }
    },
    data() {
        return {
            chart: null,
            dlist: []
        }
    },
    watch: {
        allList(a) {
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
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartData)
        },
        setOptions(chartData) {
            this.chart.setOption({
                backgroundColor: 'transparent',
                legend: {
                    data: [
                        '累计用户人数',
                        '全渠道新增用户人数',
                        // '公众号新增用户人数',
                        // 'App端新增用户人数',
                        'H5端新增用户人数',
                        '小程序端新增用户人数'
                    ],
                    bottom: 0
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '40px',
                    right: '60px',
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
                    data: this.allList.dateList
                },
                yAxis: {
                    type: 'value',
                    // 坐标轴轴线配置
                    axisLine: {
                        show: true,
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
                        name: '累计用户人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(38, 58, 239, 1)'
                            }
                        },
                        data: this.allList.peopleAmount
                    },
                    {
                        smooth: false,
                        name: '全渠道新增用户人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(45, 140, 240, 1)'
                            }
                        },
                        data: this.allList.peopleNew
                    },
                    /* {
                        smooth: false,
                        name: '公众号新增用户人数',
                        type: 'line',

                        itemStyle: {
                            normal: {
                                color: 'rgba(245, 108, 108, 1)'
                            }
                        },
                        data: this.allList.mpNew
                    },
                    {
                        smooth: false,
                        name: 'App端新增用户人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(244, 205, 73, 1)'
                            }
                        },
                        data: this.allList.appNew
                    }, */
                    {
                        smooth: false,
                        name: 'H5端新增用户人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(124, 75, 216, 1)'
                            }
                        },
                        data: this.allList.h5New
                    },
                    {
                        smooth: false,
                        name: '小程序端新增用户人数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(224, 86, 103, 1)'
                            }
                        },
                        data: this.allList.miniNew
                    }
                ]
            })
        }
    }
}
</script>
