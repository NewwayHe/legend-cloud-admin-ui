<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
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
        chartList: {
            type: Array
        }
    },
    data() {
        return {
            chart: null,
            aaa: []
        }
    },
    watch: {
        chartList(a, b) {
            console.log(a)
            this.initChart(a)
        }
    },
    mounted() {
        console.log(this.aaa, 'aaa')
    },
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
            this.chart.setOption({
                title: {
                    text: '世界人口总量'
                },
                legend: {
                    bottom: 0
                },
                tooltip: {},
                dataset: {
                    source: this.chartList
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    // 坐标轴轴线配置
                    axisLine: {
                        show: false
                    },
                    // 分割线配置
                    splitLine: {
                        show: false
                    },
                    // 坐标轴刻度相关设置。
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 30,
                    right: 30
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 20,
                        barGap: 0,
                        itemStyle: {
                            normal: {
                                color: 'rgba(60, 144, 247, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        barGap: 0,
                        itemStyle: {
                            normal: {
                                color: 'rgba(85, 191, 192, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(94, 190, 103, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(244, 205, 73, 1)'
                            }
                        }
                    },
                    {
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: 'rgba(224, 86, 103, 1)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
