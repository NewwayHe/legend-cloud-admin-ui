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
            default: '300px'
        },
        chartList: {
            type: Array
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartList() {
            this.initChart()
        }
    },
    mounted() {
        this.$nextTick(() => {})
    },
    beforeDestroy() {},
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartData)
        },
        setOptions({ expectedData, actualData } = {}) {
            this.chart.setOption({
                title: {},
                tooltip: {
                    trigger: 'item',
                    textStyle:{
                        color:'#fff'
                    }
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                // },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: this.chartList,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
