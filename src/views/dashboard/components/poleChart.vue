<!--
    柱状图
-->
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
            type: [Object, Array],
            required: true
        },
        //数字第一项为X轴坐标其余对应为数据，填写对象的属性名
        dimensions: {
            type: Array,
            required: true
        },
        nameList: {
            //柱状图显示的中文
            type: Array,
            default: () => ['访问商城次数', '访问商城用户数']
        },
        labelConfig: {
            //柱状图上的文字
            type: Object,
            default: () => {
                return {
                    show: true,
                    rotate: 0,
                    align: 'center',
                    verticalAlign: 'middle',
                    position: 'top',
                    distance: 10,
                    // formatter: '{c}  {name|{a}}',
                    formatter: '{name|{a}}',
                    fontSize: 10,
                    color: '#666666',
                    rich: {
                        name: {}
                    }
                }
            }
        },
        gradientColor: {
            //渐变色设置 [默认从上到底 两个柱状图颜色]
            type: Array,
            default: () => [
                [
                    { offset: 0, color: '#95BEFF' },
                    { offset: 1, color: '#5C89FD' }
                ],
                [
                    { offset: 0, color: '#59C0F9' },
                    { offset: 1, color: '#2D8CF0' }
                ]
            ]
        }
    },
    data() {
        return {
            chart: null,
            series: []
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.initChart()
                console.log('val--', val)
            }
        }
    },
    created() {
        for (let i = 0; i < this.dimensions.length - 1; i++) {
            this.series.push({
                name: this.nameList[i],
                type: 'bar',
                barGap: 0,
                label: this.labelConfig,
                barWidth: 68,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.gradientColor[i])
                },
                emphasis: { focus: 'series' }
            })
        }
        // console.log('series--',this.series)
        // console.log('--',this.labelConfig,this.gradientColor)
    },
    mounted() {
        // console.log('mount--',this.chartData)
        if (!this.$utils.test.isEmpty(this.chartData)) {
            this.$nextTick(() => {
                this.initChart()
            })
        }
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
            this.chart && this.chart.dispose() //数据切换时清除上一次存在的柱图
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions()
        },
        setOptions() {
            const option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: '#fff'
                },
                dataset: {
                    dimensions: this.dimensions,
                    // 提供一份数据。
                    source: this.chartData
                },
                grid: {
                    //充满布局
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true,
                    width: '100%'
                    // height: '100%',
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        axisLabel: {
                            color: '#333333',
                            fontSize: 14,
                            margin: 15
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            color: '#666666',
                            fontSize: 12
                        },
                        splitArea: {
                            show: false
                        }
                    }
                ],
                series: this.series
            }
            this.chart.setOption(option)
        },

        // 数据暴露样例
        example() {
            let app = {}
            app.config = {
                rotate: 0,
                align: 'center',
                verticalAlign: 'middle',
                position: 'top',
                distance: 10
            }
            const labelOption = {
                show: true,
                position: app.config.position,
                distance: app.config.distance,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                rotate: app.config.rotate,
                // formatter: '{c}  {name|{a}}',
                formatter: '{name|{a}}',
                fontSize: 10,
                color: '#666666',
                // color:'red',
                rich: {
                    name: {}
                }
            }
            const option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: '#fff'
                },
                // legend: {        //标题
                //     data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                // },
                // toolbox: {       //右边的状态栏
                //     show: true,
                //     orient: 'vertical',
                //     left: 'right',
                //     top: 'top',
                //     feature: {
                //     mark: { show: true },
                //     dataView: { show: true, readOnly: false },
                //     magicType: { show: true, type: ['line', 'bar', 'stack'] },
                //     restore: { show: true },
                //     saveAsImage: { show: true }
                //     }
                // },
                dataset: {
                    dimensions: ['createTime', 'pv', 'uv'],
                    // 提供一份数据。
                    source: [
                        { createTime: '2021-12-14', pv: 162, uv: 53 },
                        { createTime: '2021-12-15', pv: 165, uv: 553 }
                    ]
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: { show: false },
                        // data: ['2012', '2013', '2014', '2015', '2016'],
                        axisLabel: {
                            color: '#333333',
                            fontSize: 14,
                            margin: 15
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            color: '#666666',
                            fontSize: 12
                        },
                        splitArea: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '访问商城次数',
                        type: 'bar',
                        barGap: 0,
                        label: labelOption,
                        barWidth: 68,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#95BEFF' },
                                { offset: 1, color: '#5C89FD' }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                        // data: [320, 332, 301, 334, 390]
                    },
                    {
                        name: '访问商城用户数',
                        type: 'bar',
                        label: labelOption,
                        barWidth: 68,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#59C0F9' },
                                { offset: 1, color: '#2D8CF0' }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                        // data: [220, 182, 191, 234, 290]
                    }
                ]
            }
            this.chart.setOption(option)
        }
    }
}
</script>
