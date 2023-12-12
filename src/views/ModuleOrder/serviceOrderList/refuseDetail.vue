<template>
	<section class="">
		<div class="mb-20">
			<div class="p-10 bg-fff rounded-4 flex-start">
				<i class="iconfont icon-tanhao text-warning" />
				<div class="ml-10 font-12">
					<div v-if="orderStatus(detailsInfo) === '待确认'">
						请在
						<countDown :time="detailsInfo.autoCancelRefundTime" :custom="true" v-slot="{ times }" class="d-inline-block">
							<span v-if="times.days > 0">{{ times.days }}天</span>
							<span v-if="times.hours > 0">{{ times.hours }}时</span>
							<span>{{ times.minutes }}分</span>
							<span>{{ times.seconds }}秒</span>
						</countDown>
						内处理本次售后操作，如逾期未处理，将自动同意售后{{
							detailsInfo.applyType == 2 ? '并默认为弃货' : ''
						}}。退款金额按照原路退回，优先退还余额支付金额。
					</div>
					<div v-if="orderStatus(detailsInfo) === '待审核'">
						<template v-if="detailsInfo.applyType == 1">
							商家已同意售后，待平台审核。退款金额按照原路退回，优先退还余额支付金额。
						</template>
						<template v-else>
							{{
								detailsInfo.cancellationType == 4
									? '商家逾期未处理，系统默认同意售后（选择弃货），直接提交平台审核。'
									: '商家已确认收货，待平台审核。退款金额按照原路退回，优先退还余额支付金额。'
							}}
						</template>
					</div>
					<div v-if="orderStatus(detailsInfo) === '待用户退货' || orderStatus(detailsInfo) === '待收货'">
						<template v-if="detailsInfo.cancellationType == 7">
							商家已同意售后，用户已寄回商品，确认收货后提交平台审核。商品显示已配送到商家收货地址后，商家需要在
							<countDown :time="detailsInfo.autoCancelRefundTime" :custom="true" v-slot="{ times }" class="d-inline-block">
								<span v-if="times.days > 0">{{ times.days }}天</span>
								<span v-if="times.hours > 0">{{ times.hours }}时</span>
								<span>{{ times.minutes }}分</span>
								<span>{{ times.seconds }}秒</span>
							</countDown>
							内确认收货/标记商品异常，如逾期未处理，售后单将自动确认收货。
						</template>
						<template v-else>
							商家已同意售后，等待用户寄回商品，确认收货后提交平台审核。用户需要在
							<countDown :time="detailsInfo.autoCancelRefundTime" :custom="true" v-slot="{ times }" class="d-inline-block">
								<span v-if="times.days > 0">{{ times.days }}天</span>
								<span v-if="times.hours > 0">{{ times.hours }}时</span>
								<span>{{ times.minutes }}分</span>
								<span>{{ times.seconds }}秒</span>
							</countDown>
							内寄回商品，如逾期未处理，售后单将自动变为取消状态。
						</template>
					</div>
					<div v-if="orderStatus(detailsInfo) === '已退款'">退款金额按照原路退回，优先退还余额支付金额。</div>
					<div v-if="orderStatus(detailsInfo) === '已拒绝'">商家已拒绝售后，用户可重新申请售后。</div>
					<div v-if="orderStatus(detailsInfo) === '已取消'">
						{{ detailsInfo.cancellationType == 1 ? '用户取消售后，取消时间：' : '用户逾期未发货，售后单自动变为取消状态，取消时间：'
						}}{{ detailsInfo.cancellationTime }}
					</div>
				</div>
			</div>
		</div>
		<!-- 进度 -->
		<div class="mb-20">
			<el-card shadow="never">
				<div class="d-flex a-center order p-20">
					<div class="d-flex flex-column a-center order-wrapper">
						<h1 class="order-status">{{ refuseStatus(detailsInfo) }}</h1>
						<p class="order-code">售后编号: {{ detailsInfo.refundSn }}</p>
					</div>
					<div class="order-line" style="" />
					<div class="flex-1 d-flex j-center">
						<el-steps
							v-if="detailsInfo.applyType"
							class="order-step w-100"
							:space="200"
							:active="refuseStatus(detailsInfo, false)"
							finish-status="success"
							align-center
						>
							<el-step :description="detailsInfo.createTime" title="申请售后" />
							<el-step
								:description="detailsInfo.sellerTime"
								title="商家确认"
								:status="
									detailsInfo.applyStatus == -3
										? 'error'
										: detailsInfo.applyStatus == 1 && detailsInfo.sellerStatus == 0
										? 'wait'
										: 'success'
								"
							/>
							<el-step
								v-if="detailsInfo.applyType == 2 && detailsInfo.returnType !== 1 && detailsInfo.applyStatus > -1"
								:description="detailsInfo.receiveTime"
								title="商家确认收货"
							/>
							<el-step
								:description="detailsInfo.adminTime"
								title="平台审核"
								v-if="detailsInfo.applyStatus != -2 && detailsInfo.applyStatus != -1"
							/>
							<el-step v-if="detailsInfo.applyStatus == -1" :description="detailsInfo.completeTime" title="用户取消" />
							<el-step v-if="detailsInfo.applyStatus == -2" :description="detailsInfo.completeTime" title="逾期发货自动取消" />
							<el-step v-else :description="detailsInfo.completeTime" title="完成" />
						</el-steps>
					</div>
				</div>
			</el-card>
		</div>

		<!-- 商品表格 -->
		<div class="mb-20">
			<el-card shadow="never">
				<div v-if="detailsInfo.refundReturnLogisticsDTO" class="d-flex order p-20 mb-20" style="background-color: #f5f7fa">
					<el-form class="order-form order-wrapper" label-width="90px" label-position="left" size="small">
						<p class="font-14 font-weight-600" style="line-height: 32px">配送信息</p>
						<el-form-item label="配送方式：">{{ detailsInfo.refundReturnLogisticsDTO.logisticsCompany || '-' }}</el-form-item>
						<el-form-item label="单号：">{{ detailsInfo.refundReturnLogisticsDTO.shipmentNumber || '-' }}</el-form-item>
					</el-form>
					<div class="order-line" />
					<div class="flex-1">
						<div class="font-14 font-weight-600 mb-10" style="line-height: 32px">物流信息</div>
						<el-scrollbar class="time-scoll">
							<el-timeline class="express-step">
								<el-timeline-item
									v-for="(activity, index) in logisticsArr"
									:key="index"
									:color="index == 0 ? '#ffba00' : ''"
									:timestamp="activity.ftime"
								>
									{{ activity.context }}
								</el-timeline-item>
							</el-timeline>
						</el-scrollbar>
					</div>
				</div>

				<el-form label-width="90px" label-position="left" size="small" class="order-form mb-20">
					<div class="d-flex p-20" style="background-color: #f5f7fa">
						<div class="flex-1 flex-col-between">
							<!-- 用户信息 -->
							<div>
								<div class="font-14 font-weight-600" style="line-height: 32px">用户信息</div>
								<el-form-item label="用户ID/昵称：">
									{{ detailsInfo.userId }} /
									{{ detailsInfo.receiver || (detailsInfo.orderSinceMention && detailsInfo.orderSinceMention.userContactName) }}
								</el-form-item>
								<el-form-item label="手机号码：">
									{{ detailsInfo.mobile || (detailsInfo.orderSinceMention && detailsInfo.orderSinceMention.userContactPhone) }}
								</el-form-item>
							</div>
							<!-- 商家信息 -->
							<div>
								<div class="font-14 font-weight-600" style="line-height: 32px">商家信息</div>
								<el-form-item label="店铺ID：">{{ detailsInfo.shopId }}</el-form-item>
								<el-form-item label="店铺名称：">{{ detailsInfo.shopName }}</el-form-item>
							</div>
						</div>

						<!-- 售后信息 -->
						<div class="flex-1 ml-20">
							<div class="font-14 font-weight-600" style="line-height: 32px">售后信息</div>
							<el-form-item label="售后编号：">{{ detailsInfo.refundSn }}</el-form-item>
							<el-form-item label="申请时间：">{{ detailsInfo.createTime }}</el-form-item>
							<el-form-item label="订单编号：">{{ detailsInfo.orderNumber }}</el-form-item>
							<el-form-item label="售后类型：">{{ detailsInfo.applyType == 1 ? '仅退款' : '退货' }}</el-form-item>
							<el-form-item label="退款金额：">
								<div>
									<el-popover placement="right" width="220" trigger="hover" popper-class="detailPop">
										<div>
											<p v-for="(item, index) in detailsInfo.refundAmountDetailList" :key="index">
												<span class="d-inline-block" style="width: 80px">{{ item.payName }}：</span>
												<span class="ml-10">{{ item.payAmount | priceFilter }}</span>
											</p>
										</div>
										<el-link slot="reference" :underline="false" type="primary" class="font-12 line-h v-baseline">
											{{ detailsInfo.refundAmount | priceFilter }}
										</el-link>
									</el-popover>
								</div>
							</el-form-item>
							<el-form-item label="售后原因：">
								<span class="word-breakall">{{ detailsInfo.reason || '-' }}</span>
							</el-form-item>
							<el-form-item label="售后说明：">
								<span class="word-breakall">{{ detailsInfo.buyerMessage || '-' }}</span>
							</el-form-item>
							<el-form-item label="凭证：">
								<template v-if="detailsInfo.photoVoucher && detailsInfo.photoVoucher.length">
									<ls-image
										v-for="(item, index) in detailsInfo.photoVoucher"
										:key="index"
										class="m-10"
										style="vertical-align: middle"
										:src="item"
										:options="{ w: '50', h: '50', br: '4' }"
									/>
								</template>
								<template v-else>-</template>
							</el-form-item>
						</div>
						<!-- 商家处理信息 -->
						<div class="flex-1 ml-20">
							<div class="font-14 font-weight-600" style="line-height: 32px">商家处理信息</div>
							<el-form-item label="状态：">
								<span :class="[statusClass(detailsInfo)]">{{ refuseStatus(detailsInfo, true, false) }}</span>
							</el-form-item>
							<el-form-item label="处理时间：">{{ detailsInfo.sellerTime || '-' }}</el-form-item>
							<el-form-item label="商家备注：">{{ detailsInfo.sellerMessage }}</el-form-item>
						</div>
						<!-- 平台退款处理 -->
						<div style="flex-basis: 25%" class="ml-20">
							<div class="font-14 font-weight-600" style="line-height: 32px">平台退款处理</div>
							<el-form-item label="备注：">
								{{ detailsInfo.adminMessage }}
								<el-button v-if="!detailsInfo.adminMessage" class="font" type="text" @click="showDialog()">添加备注</el-button>
							</el-form-item>
							<el-form-item label="状态：">
								<span :class="[statusClass(detailsInfo)]">{{ refuseStatus(detailsInfo) }}</span>
							</el-form-item>
							<el-form-item label="处理时间：">{{ detailsInfo.adminTime || '-' }}</el-form-item>
						</div>
					</div>
				</el-form>

				<!--列表-->
				<order-table ref="table" :table-list="tableList" :refuse-info="detailsInfo" />
			</el-card>
		</div>
		<submitBottom>
			<el-row type="flex" justify="end" class="">
				<el-button size="small" plain @click="back">返回</el-button>
				<el-button v-if="detailsInfo.applyStatus == 2" size="small" type="primary" @click="refund">同意并退款</el-button>
			</el-row>
		</submitBottom>
		<!-- 添加备注 -->
		<el-dialog title="添加备注" :visible.sync="cancelDialog" custom-class="dialog-form-small remarkDialog">
			<div>
				<el-form ref="form" :model="form" label-width="98px" label-position="right" size="small">
					<el-form-item label="添加备注：" prop="remark">
						<el-input v-model="form.remark" placeholder="请输入备注" maxlength="100" show-word-limit />
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="cancelDialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
import orderTable from './components/orderTableDetail'
import { serviceOrderApi } from '@/api/ModuleOrder'
import countDown from '@/components/countDown'
export default {
	components: {
		orderTable,
		countDown
	},
	data() {
		return {
			tableList: [], // 售后关联订单列表
			logisticsArr: [], // 物流数组
			detailsInfo: {}, // 售后订单信息
			id: 0,
			cancelDialog: false,
			form: {
				remark: ''
			}
		}
	},
	computed: {
		orderStatus() {
			return function (data, istext = true) {
				if (data.applyStatus == 1 && data.sellerStatus == 0) {
					return '待确认'
				}
				if (data.applyStatus == -3 || data.sellerStatus == -1) {
					return '已拒绝'
				}
				if (data.applyStatus == -1 || data.applyStatus == -2) {
					return '已取消'
				}
				if (data.goodsStatus == 1 && data.sellerStatus == 1) {
					return '待用户退货'
				}
				if (data.applyStatus == 2) {
					return '待审核'
				}
				if ((data.goodsStatus == 3 || data.goodsStatus == 5 || data.goodsStatus == 1) && data.sellerStatus == 1) {
					return '待收货'
				}
				if (data.applyStatus == 3) {
					return '已退款'
				}
				return '-'
			}
		},
		refuseStatus() {
			// isPla: true平台/false商家
			return function (data, istext = true, isPla = true) {
				if (data.applyStatus == -1 || data.applyStatus == -2) {
					return istext ? '已取消' : 5
				}
				if (data.applyStatus == -3) {
					return istext ? '已拒绝' : 1
				}
				if (data.applyStatus == 3) {
					return istext ? '已完成' : 5
				}
				if (data.applyStatus == 1 && data.sellerStatus == 0) {
					return istext ? (isPla ? '待商家确认' : '待确认') : 1
				}
				if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
					return istext ? (isPla ? '待商家收货' : '待收货') : 2
				}
				if (data.applyStatus == 2) {
					if (data.applyType == 1) {
						return istext ? '待审核' : 2
					} else {
						return istext ? '待审核' : 3
					}
				}
				if (data.goodsStatus == 1 && data.sellerStatus == 1) {
					return istext ? '待用户退货' : 2
				}
				return '-'
			}
		},
		// 状态样式类
		statusClass() {
			return (detailsInfo) => {
				if (detailsInfo.applyStatus == -3) {
					return 'status-veto'
				}
				if (
					(detailsInfo.applyStatus == 1 && detailsInfo.sellerStatus == 0) ||
					(detailsInfo.goodsStatus == 3 && detailsInfo.sellerStatus == 1) ||
					(detailsInfo.goodsStatus == 5 && detailsInfo.sellerStatus == 1) ||
					detailsInfo.applyStatus == 2 ||
					(detailsInfo.goodsStatus == 1 && detailsInfo.sellerStatus == 1)
				) {
					return 'status-wait'
				}
				return 'status-done'
			}
		}
	},
	mounted() {
		this.id = this.$route.query.id || ''
		this.getDetailsInfo()
	},
	methods: {
		// 添加备注点开窗口
		showDialog(item) {
			this.cancelDialog = true
			this.form.remark = ''
		},
		// 提交备注
		onSubmit() {
			serviceOrderApi
				.refundRemake({ refundId: this.detailsInfo.id, remark: this.form.remark })
				.then((res) => {
					this.cancelDialog = false
					this.getDetailsInfo()
					this.$message.success('添加成功')
				})
				.catch((err) => {
					console.log(err)
				})
		},
		// 同意并退款
		refund() {
			this.$confirm('是否确定同意退款？', '消息确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				serviceOrderApi
					.confirmRefund({
						orderType: this.detailsInfo.orderType,
						refundId: this.detailsInfo.id
					})
					.then((res) => {
						if (res.code) {
							this.getDetailsInfo()
						}
					})
			})
		},
		back() {
			this.$router.back()
		},
		// 获取商品详情
		getDetailsInfo() {
			serviceOrderApi
				.orderRefundDetail({ refundId: this.id })
				.then((res) => {
					if (res.code == 1) {
						this.detailsInfo = res.data
						this.tableList = res.data.orderItemDTOList || []
						if (res.data.refundReturnLogisticsDTO) {
							this.logisticsArr = !!res.data.refundReturnLogisticsDTO.trackingInformation
								? JSON.parse(res.data.refundReturnLogisticsDTO.trackingInformation)
								: []
						}
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}
}
</script>
<style>
.detailPop {
	padding: 10px 20px;
}
</style>

<style lang="scss" scoped>
// 订单详情form默认样式修改
.order-form ::v-deep {
	.el-form-item__label {
		font-size: 12px;
		font-weight: 400;
	}

	.el-form-item__content {
		font-size: 12px;
		color: #333;
	}

	.el-form-item--small.el-form-item {
		margin-bottom: 0px;
	}

	.el-button--text {
		color: #2d8bef;
	}

	.el-button--text:hover,
	.el-button--text:focus {
		color: #2d8bef;
	}

	.more {
		display: inline-block;
		color: #2d8bef;
		cursor: pointer;
		font-size: 12px;
		position: relative;
		padding: 12px 0;
	}

	.more:hover > .more-info {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		position: absolute;
		left: 120%;
		top: -100%;
		width: 180px;
		height: 96px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		color: #333;
		padding-left: 10px;
	}

	.more-info {
		display: none;
	}
}

.order {
	.order-wrapper {
		flex-basis: 500px;

		.order-status {
			font-size: 18px;
			font-weight: bold;
			color: #f56c6c;
			margin-bottom: 5px;
			margin-top: 0;
		}

		.order-info {
			font-size: 12px;
			color: #f56c6c;
			margin-bottom: 24px;
		}

		.count-down {
			font-size: 14px;
			color: #f56b6b;
			font-weight: bold;
		}

		.order-code {
			font-size: 12px;
			font-weight: 400;
			color: #999999;
		}
	}

	.order-line {
		width: 1px;
		height: 200px;
		background: rgba(231, 233, 235, 1);
		margin: 0 20px;
	}

	// 步骤条默认样式修改
	.order-step ::v-deep {
		// width: 95%;
		// margin: 0 auto;

		.el-step.is-horizontal {
			flex: 1 !important;
		}

		.el-step.is-horizontal .el-step__line {
			height: 1px;
		}

		.el-step__title {
			font-size: 14px;
		}

		.el-step {
			flex-grow: 1;
		}
	}

	// 滚动条默认样式修改
	.time-scoll ::v-deep {
		.el-scrollbar__thumb {
			left: -20px;
		}
	}

	// 时间线样式修改
	.express-step ::v-deep {
		height: 150px;
		width: 100%;
		margin-top: 5px;
		padding-left: 5px;

		.el-timeline-item__node--normal {
			width: 8px;
			height: 8px;
		}

		.el-timeline-item {
			padding-bottom: 13px;
		}

		.el-timeline-item__tail {
			left: 2px;
		}
	}
}

.check {
	.settle-title {
		display: inline-block;
		width: 135px;
		text-align: right;
		font-size: 12px;
	}

	.money {
		display: inline-block;
		width: 80px;
		text-align: right;
		font-size: 12px;
	}

	.total {
		display: inline-block;
		width: 80px;
		color: #f56b6b;
		text-align: right;
		font-size: 18px;
		font-weight: bold;
		line-height: 6px;
	}
}

::v-deep .remarkDialog {
	.el-input {
		.el-input__inner {
			padding-right: 56px; //备注输入框限制字数时 右侧会出现遮挡
		}
	}
}
</style>
