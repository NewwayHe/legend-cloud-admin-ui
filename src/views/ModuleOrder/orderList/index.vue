<template>
	<section class="">
		<el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
			<div class="search">
				<el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
					<el-form-item label="订单编号">
						<el-input v-model="searchFilters.orderNumber" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="商品名称">
						<el-input v-model="searchFilters.productName" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="店铺名称">
						<el-select
							v-model="searchFilters.shopName"
							v-el-select-loadmore="loadmore"
							filterable
							remote
							clearable
							allow-create
							placeholder="请选择"
						>
							<el-option v-for="(item, index) in options" :key="index" :label="item.shopName" :value="item.shopName"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="昵称">
						<el-input v-model="searchFilters.nickName" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="下单时间">
						<el-date-picker
							v-model="date"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							@change="changeDate"
						/>
					</el-form-item>
					<el-form-item label="订单类型">
						<el-select v-model="searchFilters.orderType" clearable placeholder="全部">
							<el-option label="普通订单" value="O" />
							<el-option label="预售订单" value="P" />
							<el-option label="团购订单" value="G" />
							<el-option label="秒杀订单" value="S" />
							<el-option label="拼团订单" value="MG" />
						</el-select>
					</el-form-item>
					<el-form-item label="售后状态">
						<el-select v-model="searchFilters.refundStatus" clearable placeholder="全部">
							<el-option label="未退款" :value="0" />
							<el-option label="退货退款处理中" :value="1" />
							<el-option label="已完成" :value="2" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click.stop="dbnSearch">搜索</el-button>
						<el-button size="small" @click.stop="exportData">导出数据</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="table">
				<el-row type="flex" class="mb-20">
					<el-col>
						<el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
							<el-radio-button label="0">所有订单</el-radio-button>
							<el-radio-button label="1">待付款</el-radio-button>
							<el-radio-button label="2">待成团</el-radio-button>
							<el-radio-button label="5">待发</el-radio-button>
							<el-radio-button label="10">待签收</el-radio-button>
							<el-radio-button label="15">待收货</el-radio-button>
							<el-radio-button label="20">已完成</el-radio-button>
							<el-radio-button label="-5">已取消</el-radio-button>
						</el-radio-group>
					</el-col>
				</el-row>

				<!-- 订单列表  v-model="checkList" v-loading="tableListLoading"-->
				<!-- v-loading不能直接用在自定义表格上[order-table] 否则会在<1366px的屏幕刷新后 表格会白屏 -->
				<div v-loading="tableListLoading">
					<order-table ref="table" :table-list="tableList" @toDetail="toDetail" />
				</div>
				<LsSticky :data="tableList">
					<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
						<pagination
							:current-page="page.curPage"
							:total="tableTotal"
							@size-change="pageSizeChange"
							@current-change="currentPageChange"
						/>
					</el-row>
				</LsSticky>
			</div>
		</el-card>
	</section>
</template>
<script>
import orderTable from './components/orderTable.vue'
import common from '@/mixins/pages/commom'
import { orderList } from '@/api/ModuleOrder'

export default {
	name: 'OrderList',
	components: {
		orderTable
	},

	directives: {
		'el-select-loadmore': {
			bind(el, binding) {
				// 获取element-ui定义好的scroll盒子
				const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
				SELECTWRAP_DOM.addEventListener('scroll', function () {
					/**
					 * scrollHeight 获取元素内容高度(只读)
					 * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
					 * clientHeight 读取元素的可见高度(只读)
					 * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
					 * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
					 */
					const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
					condition && binding.value()
				})
			}
		}
	},
	mixins: [common],
	data() {
		return {
			searchFilters: {
				// userMobile: '', // 用户电话
				orderNumber: this.$route.query.orderNumber, // 订单编号
				productName: '', // 商品名称
				shopName: '', // 商家名
				orderType: '', // 	订单类型
				refundStatus: '', // 退款状态
				status: '0', // 订单状态
				receiverMobile: '', // 收货人电话
				nickName: '' // 昵称
			},
			checkList: [], //勾选数据
			options: [],
			total: 0,
			date: '', // 时间
			switchType: '1', // tab选项
			url: {
				getData: '/order/admin/order/page'
			},
			shopListCurPage: 1 //店铺搜索框懒加载页码
		}
	},
	computed: {
		//底部全选按钮与表格顶部的全选按钮状态同步[半选状态]
		checkHalf() {
			if (this.checkAll) {
				return false
			} else if (this.checkList.length) {
				return true
			} else {
				return false
			}
		},
		checkAll: {
			get() {
				let tableIds = this.tableList.map((item) => item.id)
				return tableIds && tableIds.length && tableIds.every((item) => this.checkList.includes(item))
			},
			set(val) {
				return val
			}
		}
	},
	created() {
		if (this.$route.query.shopId) {
			this.searchFilters.shopId = this.$route.query.shopId
		}
		if (this.$route.params) {
			this.searchFilters = { ...this.searchFilters, ...this.$route.params }
		}
	},
	mounted() {
		this.selectShop()
	},
	methods: {
		// 跳转详情
		toDetail(id) {
			this.$router.push({
				name: 'orderDetail',
				query: {
					DetailId: id
				}
			})
		},
		// 全选
		selectAll(flag) {
			this.$refs.table.selectedAllOrNot(flag)
		},

		// 导出数据
		exportData() {
			orderList.orderExport(this.searchFilters).then((res) => {
				if (res.code) {
					this.$message.success('导出成功')
				}
			})
		},

		// 切换状态
		changeStatus() {
			this.page.curPage = 1
			this.getData()
		},

		// 时间改变
		changeDate() {
			if (this.date) {
				console.log(this.date)
				this.$set(this.searchFilters, 'startDate', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
				this.$set(this.searchFilters, 'endDate', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
			} else {
				this.$set(this.searchFilters, 'startDate', '')
				this.$set(this.searchFilters, 'endDate', '')
			}
		},

		//
		loadmore() {
			if (!this.hasMore()) {
				return
			}
			this.shopListCurPage++
			this.selectShop()
		},

		//判断有没有更多
		hasMore() {
			return this.options.length >= this.total ? false : true
		},

		// 请求接口
		selectShop() {
			orderList.shopDetailQuerySelect2({ curPage: this.shopListCurPage }).then((res) => {
				if (res.code && res.data && res.data.resultList) {
					this.options = [...this.options, ...res.data.resultList]
					this.total = res.data.total
				}
			})
		}
	}
}
</script>
<style scoped></style>
