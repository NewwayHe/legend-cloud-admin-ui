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
        // chartData: {
        //     deep: true,
        //     handler(val) {
        //         this.setOptions(val)
        //     }
        // },
        allList: {
            handler(a) {
                console.log(a, 'aaa')
                this.initChart()
            },
            deep: true
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
                        '全部渠道商品访问量',
                        '全部渠道商品访问次数',
                        // '公众号商品访问量',
                        // '公众号商品访问次数',
                        '小程序端商品访问量',
                        '小程序端商品访问次数',
                        // 'APP端商品访问量',
                        // 'APP端商品访问次数',
                        'H5端商品访问量',
                        'H5端商品访问次数'
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
                    boundaryGap: true,
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
                        name: '全部渠道商品访问量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#ff125d'
                            }
                        },
                        data: this.allList.people
                    },
                    {
                        smooth: false,
                        name: '全部渠道商品访问次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#307df9'
                            }
                        },
                        data: this.allList.frequency
                    },
                    /* {
                        smooth: false,
                        name: '公众号商品访问量',
                        type: 'line',

                        itemStyle: {
                            normal: {
                                color: 'rgba(245, 108, 108, 1)'
                            }
                        },
                        data: this.allList.mpPeople
                    },
                    {
                        smooth: false,
                        name: '公众号商品访问次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(244, 205, 73, 1)'
                            }
                        },
                        data: this.allList.mpFrequency
                    }, */
                    {
                        smooth: false,
                        name: '小程序端商品访问量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#13682e'
                            }
                        },
                        data: this.allList.miniPeople
                    },
                    {
                        smooth: false,
                        name: '小程序端商品访问次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#f36433'
                            }
                        },
                        data: this.allList.miniFrequency
                    },
                    /* {
                        smooth: false,
                        name: 'APP端商品访问量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(140, 86, 83, 1)'
                            }
                        },
                        data: this.allList.appPeople
                    },
                    {
                        smooth: false,
                        name: 'APP端商品访问次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(160, 86, 63, 1)'
                            }
                        },
                        data: this.allList.appFrequency
                    }, */
                    {
                        smooth: false,
                        name: 'H5端商品访问量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#ed30f9'
                            }
                        },
                        data: this.allList.h5People
                    },
                    {
                        smooth: false,
                        name: 'H5端商品访问次数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#f2b021'
                            }
                        },
                        data: this.allList.h5Frequency
                    }
                ]
            })
        }
    }
}
</script>
