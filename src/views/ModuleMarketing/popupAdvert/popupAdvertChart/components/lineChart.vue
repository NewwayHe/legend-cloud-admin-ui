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
			type: Array,
			default: () => {
				return []
			}
		},
		xAxis: {
			//x坐标值对应的属性名
			type: String
		},
		allList: {
			type: Object
		},
		title: {
			type: String,
			default: '值'
		},
		filter: {
			// tooltip的属性名filter
			type: [Function, Object, String]
		},
		showLegend: {
			//是否显示图例
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			chart: null,
			dlist: []
		}
	},
	watch: {
		chartData: {
			deep: true,
			immediate: true,
			handler(val) {
				console.log(val, 'fffffffffffff')
				this.chart && this.chart.dispose()
				this.$nextTick(() => {
					this.initChart()
				})
			}
		},
		allList: {
			handler(a) {
				this.chart && this.chart.dispose()
				this.$nextTick(() => {
					this.initChart()
				})
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
			this.chart.setOption({
				backgroundColor: 'transparent',
				legend: this.showLegend
					? {
							formatter: (property) => {
								return this.propertyFilter(property)
							}
					  }
					: null,
				dataset: {
					// 提供一份数据。
					source: this.chartData
				},
				tooltip: {
					trigger: 'item',
					formatter: (params, ticket) => {
						let property = params.seriesName
						let value = params.value[params.dimensionNames[params.componentIndex]]
						return params.value[this.xAxis || this.getDimensions()[0]] + '<br/>' + this.propertyFilter(property) + '：' + value
					},
					backgroundColor: 'rgba(0,0,0,0.5)',
					borderWidth: 0,
					textStyle: {
						color: '#fff'
					}
				},
				grid: {
					left: '10px',
					right: '40px',
					top: '20px',
					containLabel: true,
					backgroundColor: 'transparent'
				},
				xAxis: {
					type: 'time',
					minInterval: 3600 * 24 * 1000,
					maxInterval: 3600 * 24 * 1000,
					axisLabel: {
						interval: 1,
						showMaxLabel: true,
						formatter: function (value) {
							//数据较少时完整显示日期xxxx-xx-xx(2022-3-30)
							var t_date = new Date(value)
							return [t_date.getFullYear(), t_date.getMonth() + 1, t_date.getDate()].join('/')
						}
					}
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
				series: this.getSeries()
			})
		},
		setOptions(chartData) {},
		getDimensions() {
			let dimensions = Object.keys(this.chartData[0] || { backup: 0 })
			if (this.xAxis) {
				//如果有指定属性作为X轴则将该属性移至第一位
				dimensions.splice(
					dimensions.findIndex((v) => {
						return v == this.xAxis
					}),
					1
				)
				dimensions.unshift(this.xAxis)
			}
			return dimensions
		},
		getSeries() {
			let length = this.getDimensions().length
			let dimensions = this.getDimensions()
			let arr = []
			for (let i = 1; i < length; i++) {
				arr.push({
					type: 'line',
					name: dimensions[i],
					encode: {
						x: this.xAxis || dimensions[0],
						y: dimensions[i]
					}
				})
			}
			return arr
		},
		propertyFilter(property) {
			if (Object.prototype.toString.apply(this.filter) == '[object Function]') {
				return this.filter(property) || '-'
			} else if (Object.prototype.toString.apply(this.filter) == '[object Object]') {
				return this.filter[property] || '-'
			} else if (Object.prototype.toString.apply(this.filter) == '[object String]') {
				return this.filter
			} else {
				return '值'
			}
		}
	}
}
</script>
