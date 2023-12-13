<template>
    <section>
        <!-- 进度 -->
        <div class="mb-20">
            <el-card shadow="never">
                <div class="d-flex a-center order p-20">
                    <div class="d-flex flex-column a-center order-wrapper">
                        <h1 class="order-status">{{ orderStatus(detailsInfo.status) }}</h1>
                        <p class="order-code">订单编号: {{ detailsInfo.orderItemDTOList && detailsInfo.orderItemDTOList[0].orderNumber }}</p>
                    </div>
                    <div class="order-line" style="" />
                    <div class="flex-1 d-flex j-center">
                        <el-steps
                            :key="stepsKey"
                            class="order-step"
                            :space="200"
                            :active="orderStatus(detailsInfo.status, false)"
                            finish-status="success"
                            align-center
                        >
                            <el-step :description="detailsInfo.payTime" title="待付款" :status="stepStatus(detailsInfo, 1)" />
                            <el-step
                                v-if="detailsInfo.orderType === 'P' && detailsInfo.preSellOrderBO.payPctType === 1"
                                :description="rtDescription('depositPayTime')"
                                title="支付定金"
                            />
                            <el-step
                                v-if="detailsInfo.orderType === 'P' && detailsInfo.preSellOrderBO.payPctType === 1"
                                :description="rtDescription('payFinalTime')"
                                title="支付尾款"
                            />
                            <el-step v-if="detailsInfo.orderType === 'MG' || detailsInfo.orderType === 'G'" :description="'-'" title="待成团" />
                            <el-step
                                :description="detailsInfo.deliveryTime"
                                :title="`${isPickup ? '待备货' : '待发货'}`"
                                :status="stepStatus(detailsInfo, 3)"
                            />
                            <el-step
                                v-if="!isPickup"
                                :description="detailsInfo.logisticsReceivingTime"
                                title="待签收"
                                :status="stepStatus(detailsInfo, 4)"
                            />
                            <el-step
                                :description="detailsInfo.completeTime"
                                :title="`${isPickup ? '待核销' : '待收货'}`"
                                :status="stepStatus(detailsInfo, 5)"
                            />
                            <el-step :description="detailsInfo.completeTime" title="已完成" :status="stepStatus(detailsInfo, 6)" />
                            <el-step
                                v-if="detailsInfo.status == '-5'"
                                :description="detailsInfo.logisticsReceivingTime"
                                title="已取消"
                                :status="stepStatus(detailsInfo, 7)"
                            />
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 商品表格 -->
        <div class="mb-20">
            <el-card shadow="never">
                <!-- 快递 -->
                <div v-if="detailsInfo.status > 5 && !isPickup" class="d-flex order p-20 mb-20" style="background-color: #f5f7fa">
                    <el-form label-width="90px" label-position="left" size="small" class="order-form order-wrapper">
                        <p class="font-14 font-weight-600" style="line-height: 32px">配送信息</p>
                        <el-form-item label="配送方式：">{{ orderLogisticsDTO.logisticsCompany || '-' }}</el-form-item>
                        <el-form-item label="单号：">{{ orderLogisticsDTO.shipmentNumber || '-' }}</el-form-item>
                    </el-form>
                    <div class="order-line" />
                    <div class="flex-1">
                        <div class="font-14 font-weight-600 mb-10" style="line-height: 32px">物流信息</div>
                        <el-scrollbar class="time-scoll">
                            <el-timeline class="express-step">
                                <el-timeline-item v-for="(activity, index) in logisticsArr" :key="index" :timestamp="activity.ftime">
                                    {{ activity.context }}
                                </el-timeline-item>
                            </el-timeline>
                        </el-scrollbar>
                    </div>
                </div>

                <el-form label-width="90px" label-position="left" size="small" class="order-form mb-20">
                    <div class="d-flex p-20" style="background-color: #f5f7fa">
                        <div class="flex-1">
                            <!-- 用户信息 -->
                            <div v-if="detailsInfo.orderType != 'I'" style="margin-bottom: 32px">
                                <div class="font-14 font-weight-600" style="line-height: 32px">用户信息</div>
                                <el-form-item label="用户名：" size="small">{{ detailsInfo.nickName }}</el-form-item>
                            </div>
                            <!-- 收货人信息 -->
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">{{ isPickup ? '提' : '收' }}货人信息</div>
                                <el-form-item :label="`${isPickup ? '提' : '收'}货人：`" size="small">
                                    {{ (isPickup ? detailsInfo.orderSinceMention.userContactName : detailsInfo.receiver) || '-' }}
                                </el-form-item>
                                <el-form-item v-if="!isPickup" label="地址：">
                                    <span class="word-breakall">{{ detailsInfo.detailAddress || '-' }}</span>
                                </el-form-item>
                                <el-form-item :label="`${isPickup ? '提货人电话' : '手机号码'}：`">
                                    {{ (isPickup ? detailsInfo.orderSinceMention.userContactPhone : detailsInfo.mobile) || '-' }}
                                </el-form-item>
                                <el-form-item v-if="detailsInfo.orderType != 'I'" label="买家留言：">
                                    {{ detailsInfo.message ? detailsInfo.message : '-' }}
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <span class="word-breakall">{{ detailsInfo.remark ? detailsInfo.remark : '-' }}</span>
                                </el-form-item>
                                <el-button v-if="!detailsInfo.remark" class="font" type="text" @click="showDialog()">添加备注</el-button>
                            </div>
                        </div>
                        <div class="flex-1 ml-20">
                            <!-- 配送信息 -->
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">配送信息</div>
                                <el-form-item label="配送方式：">{{ isPickup ? '到店自提' : '快递' }}</el-form-item>
                                <el-form-item v-if="!isPickup" label="运费：">{{ detailsInfo.freightPrice | priceFilter }}</el-form-item>
                            </div>
                            <!-- 发票信息 -->
                            <div v-if="detailsInfo.orderType != 'I'" style="margin-top: 32px">
                                <div class="font-14 font-weight-600" style="line-height: 32px">发票信息</div>
                                <div v-if="detailsInfo.needInvoiceFlag">
                                    <el-form-item label="发票类型：">
                                        {{ detailsInfo.invoiceType == 'NORMAL' ? '普通发票' : '增值税专票' }}
                                    </el-form-item>
                                    <el-form-item :label="detailsInfo.invoiceType == 'NORMAL' ? '发票抬头：' : '公司名称：'">
                                        {{
                                            `${
                                                detailsInfo.invoiceType == 'NORMAL'
                                                    ? detailsInfo.invoiceTitleType == 'PERSONAL'
                                                        ? '[个人抬头]'
                                                        : '[企业抬头]'
                                                    : ''
                                            } `
                                        }}{{ detailsInfo.invoiceCompany }}
                                    </el-form-item>
                                    <el-form-item
                                        v-if="detailsInfo.invoiceTitleType == 'COMPANY' || detailsInfo.invoiceType == 'DEDICATED'"
                                        label="纳税人编号："
                                    >
                                        {{ detailsInfo.invoiceHumNumber }}
                                    </el-form-item>
                                    <div v-if="detailsInfo.invoiceType == 'DEDICATED'">
                                        <el-form-item label="开户银行：">{{ detailsInfo.invoiceDepositBank }}</el-form-item>
                                        <el-form-item label="开户账号：">{{ detailsInfo.invoiceBankAccountNum }}</el-form-item>
                                        <el-form-item label="注册地址：">{{ detailsInfo.invoiceRegisterAddr }}</el-form-item>
                                        <el-form-item label="注册电话：">{{ detailsInfo.invoiceRegisterPhone }}</el-form-item>
                                    </div>
                                </div>
                                <div v-else>
                                    <el-form-item label="开具发票："><div>不开具</div></el-form-item>
                                </div>
                            </div>
                        </div>
                        <div style="flex-basis: 25%" class="ml-20">
                            <!-- 付款信息 -->
                            <div>
                                <div class="font-14 font-weight-600" style="line-height: 32px">付款信息</div>
                                <template v-if="detailsInfo.orderType != 'I'">
                                    <template v-if="detailsInfo.payTime">
                                        <el-form-item label="付款方式：">{{ detailsInfo.payTypeName || '-' }}</el-form-item>
                                        <el-form-item label="付款时间：">{{ detailsInfo.payTime || '-' }}</el-form-item>
                                    </template>
                                    <el-form-item label="商品总额：">{{ detailsInfo.totalPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="运费：">{{ detailsInfo.freightPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="应付金额：">{{ detailsInfo.actualTotalPrice | priceFilter }}</el-form-item>
                                    <el-form-item label="订单优惠：">
                                        <span>-{{ discountTotal | priceFilter }}</span>
                                        <el-popover placement="right" width="220" trigger="hover" popper-class="detailPop">
                                            <div class="font-12">
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">满减满折：</span>
                                                    <span class="ml-10">-{{ detailsInfo.discountTotalAmount | priceFilter }}</span>
                                                </p>
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">平台优惠券：</span>
                                                    <span class="ml-10">-{{ detailsInfo.platformCouponAmount | priceFilter }}</span>
                                                </p>
                                                <p>
                                                    <span class="d-inline-block" style="width: 80px">店铺优惠券：</span>
                                                    <span class="ml-10">-{{ detailsInfo.couponAmount | priceFilter }}</span>
                                                </p>
                                            </div>
                                            <el-link slot="reference" :underline="false" type="primary" class="font-12 ml-5 line-h v-baseline">
                                                优惠明细
                                            </el-link>
                                        </el-popover>
                                    </el-form-item>
                                    <template v-for="(item1, index1) in detailsInfo.orderPayTypeList">
                                        <el-form-item v-if="item1.payAmount" :key="index1" :label="item1.payName">
                                            ￥{{ item1.payAmount }}
                                        </el-form-item>
                                    </template>
                                </template>
                            </div>

                            <!-- 结算信息 -->
                            <div v-if="detailsInfo.orderType == 'I'" style="margin-top: 32px">
                                <div class="font-14 font-weight-600" style="line-height: 32px">结算信息</div>
                                <el-form-item label="结算价：">{{ detailsInfo.settlementPrice | priceFilter }}</el-form-item>
                            </div>

                            <!-- 分销信息 -->
                            <div v-if="detailsInfo.distCommisAmount" style="margin-top: 32px">
                                <div class="font-14 font-weight-600" style="line-height: 32px">分销信息</div>
                                <el-form-item label="分销佣金：">{{ detailsInfo.distCommisAmount | priceFilter }}</el-form-item>
                            </div>
                        </div>
                    </div>
                </el-form>

                <!--列表-->
                <order-table ref="table" :table-list="tableList" :order-info="detailsInfo" />

                <el-row v-if="detailsInfo.orderType !== 'I'" type="flex" justify="end" class="mt-20">
                    <div class="check">
                        <div class="mb-20">
                            <span class="settle-title">商品总额：</span>
                            <span class="money">{{ detailsInfo.totalPrice | priceFilter }}</span>
                        </div>
                        <div class="mb-20">
                            <span class="settle-title">商品优惠：</span>
                            <span class="money">{{ detailsInfo.totalDiscountAmount | priceFilter }}</span>
                        </div>
                        <div class="mb-20">
                            <span class="settle-title">运费：</span>
                            <span class="money">{{ detailsInfo.freightPrice | priceFilter }}</span>
                        </div>
                        <div class="mb-20">
                            <span class="settle-title">应付总额：</span>
                            <span class="total">{{ detailsInfo.actualTotalPrice | priceFilter }}</span>
                        </div>
                    </div>
                </el-row>
            </el-card>
        </div>
        <submitBottom>
            <el-row type="flex" justify="end" class=""><el-button size="small" plain @click="back">返回</el-button></el-row>
        </submitBottom>

        <!-- 取消订单/调整订单 -->
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
import orderTable from './components/detailOrderTable'
import { orderList } from '@/api/ModuleOrder'
export default {
    components: {
        orderTable
    },
    data() {
        return {
            stepsKey: 1,
            tableList: [],
            cancelDialog: false,
            form: {
                remark: ''
            },
            orderLogisticsDTO: {},
            logisticsArr: [], //物流数组
            detailsInfo: {}
        }
    },
    computed: {
        orderStatus() {
            return function (state, istext = true) {
                const stateText = {
                    1: istext ? '待付款' : 0,
                    2: istext ? '待成团' : 1,
                    3: istext ? '待付尾款' : 2,
                    5: istext ? (this.isPickup ? '待备货' : '待发货') : 1,
                    10: istext ? (this.isPickup ? '待核销' : '待签收') : 2,
                    15: istext ? (this.isPickup ? '待核销' : '待收货') : this.isPickup ? 2 : 3,
                    20: istext ? '已完成' : 5,
                    '-5': istext ? '已取消' : 5
                }
                if (!istext) {
                    if ((this.detailsInfo.orderType === 'G' || this.detailsInfo.orderType === 'G') && state >= 5) {
                        return stateText[state] + 1
                    }
                    if (
                        this.detailsInfo.orderType === 'P' &&
                        this.detailsInfo.preSellOrderBO.payPctType == 1 &&
                        this.detailsInfo.preSellOrderBO.depositPayTime
                    ) {
                        return 2
                    }
                    if (this.detailsInfo.orderType === 'P' && this.detailsInfo.preSellOrderBO.payPctType == 1 && state >= 5) {
                        return stateText[state] + 2
                    }
                }
                return stateText[state]
            }
        },

        stepStatus() {
            return function (detailsInfo, state) {
                if (detailsInfo.status == -5 && detailsInfo.payedFlag == false) {
                    //未支付 取消
                    if (state == 1) {
                        return 'success'
                    } else if (state == 2 || state == 3 || state == 4 || state == 5 || state == 6) {
                        return 'wait'
                    } else if (state == 7) {
                        return 'error'
                    }
                } else if (detailsInfo.status == -5 && detailsInfo.payedFlag == true) {
                    //已支付 申请退款后取消
                    if (state == 1 || state == 2 || state == 3) {
                        return 'success'
                    } else if (state == 4 || state == 5 || state == 6) {
                        return 'wait'
                    } else if (state == 7) {
                        return 'error'
                    }
                }
            }
        },
        // 优惠明细总和
        discountTotal() {
            const { discountTotalAmount = 0, platformCouponAmount = 0, couponAmount = 0, totalDeductionAmount = 0 } = this.detailsInfo
            return discountTotalAmount + platformCouponAmount + couponAmount + totalDeductionAmount
        },

        // 是否是自提订单
        isPickup() {
            return Object.keys(this.detailsInfo).length != 0 && (this.detailsInfo.deliveryType == 10 || this.detailsInfo.orderType == 'SM')
        }
    },
    mounted() {
        this.getDetailsInfo()
    },
    methods: {
        rtDescription(e) {
            if (this.detailsInfo.orderType === 'P') {
                return this.detailsInfo.preSellOrderBO[e]
            }
        },
        back() {
            this.$router.back()
        },
        // 获取订单详情
        getDetailsInfo() {
            orderList
                .getOrderDetails({
                    orderId: this.$route.query.DetailId
                })
                .then((res) => {
                    if (res.code) {
                        this.detailsInfo = res.data
                        this.tableList = res.data.orderItemDTOList || []
                        if (res.data.orderLogisticsDTO) {
                            this.orderLogisticsDTO = res.data.orderLogisticsDTO
                            this.logisticsArr = JSON.parse(res.data.orderLogisticsDTO.trackingInformation)
                        }
                    }
                    this.stepsKey = Math.random()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 添加备注点开窗口
        showDialog(item) {
            this.cancelDialog = true
            this.form.remark = ''
        },

        // 提交备注
        onSubmit() {
            orderList
                .subRemake({ orderNumber: this.detailsInfo.orderNumber, remark: this.form.remark })
                .then((res) => {
                    this.cancelDialog = false
                    this.getDetailsInfo()
                    this.$message.success('添加成功')
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
}

.order {
    .order-wrapper {
        flex-basis: 500px;

        .order-status {
            font-size: 18px;
            font-weight: bold;
            color: #f56c6c;
            margin-bottom: 24px;
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
        width: 95%;
        // margin: 0 auto;
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
    .el-input .el-input__inner {
        padding-right: 54px; //备注输入框限制字数时 右侧会出现遮挡
    }
}
</style>
