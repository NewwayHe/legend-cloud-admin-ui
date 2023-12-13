<!--
 * @Description: 柱状图
-->
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
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        chartList: {
            type: Array
        },
        grid: {
            // containLabel 为 true 的时候：grid.left grid.right grid.top grid.bottom grid.width grid.height 决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置。这常用于『防止标签溢出』的场景，标签溢出指的是，标签长度动态变化时，可能会溢出容器或者覆盖其他组件。
            type: Object,
            default: () => {
                return {
                    left: 0,
                    right: 0,
                    containLabel: true
                }
            }
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartList: {
            handler() {
                this.initChart()
            },
            deep: true
            // immediate: true,     //丢失DOM
        }
    },
    mounted() {
        // console.log('mount--',this.chartList,this.chart)
        if (!this.$utils.test.isEmpty(this.chartList)) {
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
            this.chart = echarts.init(document.getElementById(this.id))
            this.setOptions()
        },
        setOptions() {
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: this.grid,
                xAxis: {
                    type: 'value',
                    show: false
                },
                yAxis: {
                    type: 'category',
                    data: this.chartList.map((item) => item.name),
                    // 上往下 （大到小）
                    inverse: true,
                    axisLabel: {
                        // 坐标值的具体的颜色
                        color: function (params, index) {
                            var colorList = ['#e84a5f', '#ff7500', '#1fab89', '#307df9', '#d59bf6']
                            return colorList[index % 5]
                        },
                        fontWeight: 900
                    },
                    //y轴
                    axisLine: {
                        show: false
                    },
                    // 刻度
                    axisTick: {
                        show: false
                    },
                    //网格线
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        // name: '访问来源',
                        type: 'bar',
                        data: this.chartList,
                        barWidth: 25, // 柱形宽度
                        // barCategoryGap: '30%', // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        label: {
                            show: true,
                            position: 'insideLeft',
                            color: '#000'
                        },
                        itemStyle: {
                            //  线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，分别表示右,下,左,上
                            color: function (params) {
                                var colorList = [
                                    ['#ff847c', '#e84a5f'],
                                    ['#ffc773', '#ff7500'],
                                    ['#62d2a2', '#1fab89'],
                                    ['#307df9', '#00e0ff'],
                                    ['#fcc8f8', '#d59bf6']
                                ]
                                var colorItem = colorList[params.dataIndex % 5]
                                return new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    1,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: colorItem[0]
                                        },
                                        {
                                            offset: 1,
                                            color: colorItem[1]
                                        }
                                    ],
                                    false
                                )
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>
