<template>
	<!-- /*
     * @Descripttion:右边编辑栏(增加组件)
    */ -->
	<!-- 右边编辑栏(增加组件) -->
	<div>
		<div v-if="!isWideScreen" class="font-16 text-center pb-30">添加组件</div>
		<div v-if="!$utils.test.isEmpty(floorList)" class="mb-15">
			<div class="pb-15">{{ floorList.title }}</div>
			<span v-for="(item, index) in floorList.botton" :key="index">
				<el-button
					class="mb-5 mr-5"
					style="width: 80px"
					plain
					size="small"
					:disabled="item.disabled"
					@click="clickAddFloors(item, floorList)"
				>
					{{ item.name }}
				</el-button>
			</span>
		</div>
		<div v-if="!$utils.test.isEmpty(floorMarketing)" class="mb-15">
			<div class="pb-15">
				{{ floorMarketing.title }}
				<el-tooltip effect="dark" content="备注：[营销组件]里的组件，整个首页只允许存在一个" placement="bottom">
					<i class="el-icon-question font-18 text-ccc main-hover v-sub"></i>
				</el-tooltip>
			</div>
			<span v-for="(item, index) in floorMarketing.botton" :key="index">
				<el-button
					class="mb-5 mr-5"
					style="width: 80px"
					plain
					size="small"
					:disabled="item.disabled"
					@click="clickAddFloors(item, floorMarketing)"
				>
					{{ item.name }}
				</el-button>
			</span>
		</div>
		<div v-if="!$utils.test.isEmpty(floorOther)" class="mb-15">
			<div class="pb-15">{{ floorOther.title }}</div>
			<span v-for="(item, index) in floorOther.botton" :key="index">
				<el-button
					class="mb-5 mr-5"
					style="width: 80px"
					plain
					size="small"
					:disabled="item.disabled"
					@click="clickAddFloors(item, floorOther)"
				>
					{{ item.name }}
				</el-button>
			</span>
		</div>
	</div>
</template>

<script>
import { defFloorVal } from './defFloorVal.js'
export default {
	components: {},
	filters: {},
	props: {
		value: {
			type: Object,
			default: () => {
				return {}
			}
		},
		uuid: {
			type: String,
			default: ''
		},
		ctrlType: {
			type: String,
			default: ''
		},
		index: {
			type: Number,
			default: 0
		},
		isWideScreen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			floorList: {
				title: '楼层组件',
				botton: [
					{ name: '轮播图', flag: 'banner' },
					{ name: '菜单', flag: 'menuTab' },
					{ name: '魔方', flag: 'cube' },
					{ name: '商品列表', flag: 'prodList' },
					{ name: '图文导航', flag: 'navigation' },
					{ name: '动态广播', flag: 'noticeBar' },
					{ name: 'TAB导航', flag: 'navigationTab' },
				]
			},
			floorMarketing: {
				title: '营销组件',
				botton: [
					{ name: '优惠券', flag: 'coupon' }
				]
			},
			floorOther: {
				title: '其它组件',
				botton: [
					{ name: '富文本', flag: 'richText' },
					{ name: '辅助线', flag: 'assistLine' },
					{ name: '标题', flag: 'titleTab' },
				]
			}
		}
	},
	computed: {
	},
	watch: {
		value: {
			handler(newValue, oldValue) {
				if (newValue) {
					if (!this.$utils.test.isEmpty(this.floorMarketing)) {
						this.floorMarketing.botton = this.floorMarketing.botton.map((item) => {
							return { name: item.name, flag: item.flag, disabled: false }
						})
					}
					if (!this.$utils.test.isEmpty(this.floorMarketing)) {
						newValue.floors.forEach((item) => {
							this.floorMarketing.botton.find((element) => {
								if (element.name == item.typeName.match(/([^-]+)$/)[1]) {
									return (element['disabled'] = true) //如果楼层数据里已经有【营销组件】里某个组件，则该组件变为不可点击状态
								}
							})
						})
					}
					this.$forceUpdate()
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {},
	destroyed() {},
	methods: {
		clickAddFloors(item, module) {
			if (
				item.flag != 'assistLine' &&
				this.value?.floors?.filter((item) => {
					return item.type != 'assistLine'
				})?.length >= 30
			) {
				this.$message({ message: '备注：出于性能上的考虑，页面最多只允许存在30个楼层', type: 'warning' })
				return
			}
			if (
				item.flag == 'prodList' &&
				this.value?.floors?.filter((item) => {
					return item.type == 'prodList'
				})?.length >= 5
			) {
				this.$message({ message: '备注：出于性能上的考虑，该楼层整个页面最多只允许存在五个', type: 'warning' })
				return
			}
			let addFloor = this.$utils.object.deepClone(defFloorVal[item.flag])
			addFloor.typeName = module.title + '-' + item.name //给typeName赋值，右边侧边栏最顶位置及【组件管理】里显示的名字就是这个变量
			this.$set(addFloor, 'uuid', this.$utils.createUUID())
			const currentIndex = this.value.floors.findIndex((item) => item.uuid == this.uuid)
			if (this.ctrlType == 'set') {
				//如果是选中了头部组件，则新增的楼层是从头开始加起
				this.value.floors.unshift(addFloor)
			} else if (currentIndex == -1) {
				//如果没有正在选中的楼层，则新增的楼层是从头尾部加起
				this.value.floors.push(addFloor)
			} else {
				//如果没有选中的楼层，则新增的楼层是加在当前选中的楼层下面
				this.value.floors.splice(currentIndex + 1, 0, addFloor)
			}
			this.$emit('update:uuid', addFloor.uuid)
			this.$message({ message: '添加成功', type: 'success' })
		},
		closeWideScreen() {
			this.$emit('update:isWideScreen', false)
		}
	}
}
</script>

<style lang="scss" scoped></style>
