<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
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
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
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
        setOptions({ expectedData, actualData } = {}) {
            this.chart.setOption({
                backgroundColor: 'transparent',
                legend: {
                    data: ['满减满折', '限时折扣', '优惠价', '团购', '拼团', '秒杀'],
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
                    data: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
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
                        name: '满减满折',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(38, 58, 239, 1)'
                            }
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        smooth: false,
                        name: '限时折扣',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(45, 140, 240, 1)'
                            }
                        },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        smooth: false,
                        name: '优惠价',
                        type: 'line',

                        itemStyle: {
                            normal: {
                                color: 'rgba(245, 108, 108, 1)'
                            }
                        },
                        data: [150, 0, 0, 0, 190, 0, 410]
                    },
                    {
                        smooth: false,
                        name: '团购',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(244, 205, 73, 1)'
                            }
                        },
                        data: [320, 332, 301, 334, 390, 330, 500]
                    },
                    {
                        smooth: false,
                        name: '拼团',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(124, 75, 216, 1)'
                            }
                        },
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        smooth: false,
                        name: '秒杀',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgba(224, 86, 103, 1)'
                            }
                        },
                        data: [0, 0, 0, 4, 0, 0, 54]
                    }
                ]
            })
        }
    }
}
</script>
