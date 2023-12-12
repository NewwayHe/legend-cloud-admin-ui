<template>
	<div class="customTable__warp" ref="wrapTable">
		<table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
			<thead>
				<tr>
					<th width="48">序号</th>
					<th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
					<th width="140">单价</th>
					<th :width="tableLayout.d_80">数量</th>
					<th :width="tableLayout.d_80">订单类型</th>
					<th min-width="100" :width="tableLayout.m_100">用户信息</th>
					<th min-width="140" :width="tableLayout.m_140">实付款</th>
					<th :width="tableLayout.d_80">交易状态</th>
					<th width="120">售后状态</th>
					<th min-width="140" :width="tableLayout.m_140">交易操作</th>
				</tr>
			</thead>
		</table>
		<div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
			<template v-if="tableList.length">
				<table v-for="(item, indexs) in tableList" :key="item.id" class="customTable__table">
					<colgroup>
						<col width="48" />
						<col min-width="80" :width="tableLayout.m_80" />
						<col min-width="100" :width="tableLayout.m_100" />
						<col min-width="100" :width="tableLayout.m_100" />
						<col width="140" />
						<col :width="tableLayout.d_80" />
						<col :width="tableLayout.d_80" />
						<col min-width="100" :width="tableLayout.m_100" />
						<col min-width="140" :width="tableLayout.m_140" />
						<col :width="tableLayout.d_80" />
						<col width="120" />
						<col min-width="140" :width="tableLayout.m_140" />
					</colgroup>
					<tbody>
						<tr class="customTable__trHead">
							<td colspan="12" style="text-align: left">
								<span class="customTable__trHead--action">下单时间：{{ item.createTime }}</span>
								<span class="customTable__trHead--action">订单号: {{ item.orderNumber }}</span>
								<span class="customTable__trHead--action customTable__primary">
									<span class="icon iconfont icon-index mr-5 font-12" />
									{{ item.shopName }}
								</span>
								<span v-if="item.payedFlag" class="customTable__trHead--action">支付方式：{{ item.payTypeName }}</span>
							</td>
						</tr>
						<tr v-for="(goodsInfo, index) in item.orderItemDTOList" :key="goodsInfo.id">
							<td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ indexs + 1 }}</td>
							<td colspan="3">
								<div class="d-flex a-center line-h-md">
									<ls-image style="flex: 0 0 60px" :src="goodsInfo.pic" :options="{ w: '60', h: '60', br: '4' }" />
									<div class="ml-10 flex-col-between">
										<el-link :underline="false" type="primary" @click="proPreview(goodsInfo)">
											<el-popover placement="top-start" width="500" trigger="hover" :title="goodsInfo.productName">
												<el-link
													:underline="false"
													type="primary"
													target="_blank"
													:href="$shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.productId"
												>
													{{ $shareRedirectUrl + '?detailsType=good&id=' + goodsInfo.productId }}
												</el-link>
												<div slot="reference" class="text-two text-left">{{ goodsInfo.productName }}</div>
											</el-popover>
										</el-link>
										<span class="text-999 mt-10 text-left" v-if="goodsInfo.attribute">{{ goodsInfo.attribute }}</span>
									</div>
								</div>
							</td>
							<td>
								{{ goodsInfo.price | priceFilter }}
							</td>
							<td>{{ goodsInfo.basketCount }}</td>
							<!-- 订单类型 -->
							<td v-if="!index" :rowspan="item.orderItemDTOList.length">{{ orderType[item.orderType] }}</td>

							<!-- 用户信息 -->
							<td v-if="!index" :rowspan="item.orderItemDTOList.length">
								<el-link :underline="false" type="primary" @click="toUserInfo(item.userId)">{{ item.nickName }}</el-link>
								<div class="word-breakall">{{ item.receiver }}</div>
								<div>{{ item.mobile }}</div>
							</td>
							<!-- 实付款 -->
							<td v-if="!index" :rowspan="item.orderItemDTOList.length">
								<div>
									<span>{{ item.actualTotalPrice | priceFilter }}</span>
									<br />
									<span>
										(含运费：{{ item.freightPrice | priceFilter }})
									</span>
								</div>
							</td>

							<!-- 交易状态 -->
							<td v-if="!index" :rowspan="item.orderItemDTOList.length">
								<div :class="'1,2,5,10,15'.includes(item.status) ? 'status-wait' : 'status-done'">
									{{ item.status | getOrderStatus(item.orderType) }}
								</div>
							</td>

							<!-- 售后状态 -->
							<td v-if="item.orderRefundType == 2">
								<div>{{ goodsInfo.refundStatus | getOrderRefundStatus }}</div>
								<span
									class="el-link status-wait"
									v-if="goodsInfo.refundStatus !== 0"
									@click="toRefuseDetail(goodsInfo, item.applyType)"
								>
									查看售后
								</span>
							</td>
							<td v-else-if="!index" :rowspan="item.orderItemDTOList.length">
								<div>{{ item.refundStatus | getOrderRefundStatus }}</div>
								<span
									class="el-link status-wait"
									v-if="item.refundStatus != '0'"
									:underline="false"
									type="warning"
									@click="toRefuseDetail(goodsInfo, item.applyType)"
								>
									查看售后
								</span>
							</td>

							<td v-if="!index" :rowspan="item.orderItemDTOList.length">
								<div class="flex-col-center">
									<router-link target="_blank" :to="{ name: 'orderPrint', query: { orderId: item.id } }">
										<el-link :underline="false" type="primary">打印订单</el-link>
									</router-link>
									<el-link v-if="item.status == '1' || '5'" :underline="false" type="primary" @click="toDetail(item.id)">
										查看详情
									</el-link>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</template>
			<Empty v-else />
		</div>
		<dialogPreview ref="dialogPreview" />
	</div>
</template>
<script>
import dialogPreview from '@/components/iphonePreview/dialogPreview'
import cud from '@/mixins/pages/cud'
export default {
	mixins: [cud],
	components: {
		dialogPreview
	},
	filters: {
		getOrderStatus(value, orderType) {
			const isPickup = orderType == 'SM'
			const dict = {
				0: '所有订单',
				1: '待付款',
				2: '待成团',
				3: '已付定金',
				5: isPickup ? '待备货' : '待发货',
				10: '待签收',
				15: isPickup ? '待核销' : '待收货',
				20: '已完成',
				'-5': '已取消'
			}
			return dict[value] || '-'
		},
		getOrderRefundStatus(value) {
			const dict = {
				// 0: '未退款',
				0: '未申请',
				1: '退货退款处理中',
				2: '已完成'
			}
			return dict[value]
		}
	},
	props: {
		tableList: {
			type: [Array, Object],
			required: true
		},
		isShop: {
			type: false,
			default: true
		}
	},
	data() {
		return {
			orderType: {
				O: '普通订单',
				P: '预售订单',
				G: '团购订单',
				S: '秒杀订单',
				MG: '拼团订单',
				SM: '门店自提订单'
			},
			checkList: [], // 选中的item
			tableLayout: {
				// 单元格大小分配
				colTotalWidth: 48 + 80 + 100 + 100 + 140 + 100 + 120 + 80 * 3 + 140 + 140
			}
		}
	},
	computed: {},
	watch: {},
	methods: {
		proPreview(row) {
			let url = this.$shareRedirectUrl + `?detailsType=snapshot&device=mobile&id=${row.id}&snapshotId=${row.snapshotId}`
			this.$refs.dialogPreview.showDialog({ url: url })
		},
		// 父组件点击全选
		selectedAllOrNot(flag) {
			if (flag) {
				this.checkList = Array.from(new Set([...this.checkList, ...this.tableList.map((item) => item.id)]))
			} else {
				let tableIds = this.tableList.map((item) => item.id)
				this.checkList = this.checkList.filter((item) => {
					return !tableIds.includes(item)
				})
			}
		},

		// 跳转详情页
		toDetail(id) {
			this.$emit('toDetail', id)
		},
		toUserInfo(userId) {
			this.$router.push({
				name: 'userInfo',
				query: {
					userId: userId
				}
			})
		},
		// 跳转售后详情
		toRefuseDetail(row, applyType) {
			// applyType为1、2是退货、退款，为3是商家申请取消订单
			if (applyType != 3) {
				this.$router.push({ name: 'refuseDetail', query: { id: row.refundId } })
			} else {
				this.$router.push({ name: 'shopApplicationDetail', query: { orderNumber: row.orderNumber } })
			}
		}
	}
}
</script>
<style lang="scss" scoped></style>
