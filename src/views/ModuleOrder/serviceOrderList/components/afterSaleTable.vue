<template>
    <div ref="wrapTable" class="customTable__warp">
        <table class="customTable__header" :style="{ width: tableLayout.bodyWidth }">
            <thead>
                <tr>
                    <th width="48">序号</th>
                    <th colspan="3" min-width="280" :width="tableLayout.m_280" style="text-align: left">商品</th>
                    <th :width="tableLayout.d_80">售后数量</th>
                    <th :width="tableLayout.d_80">订单状态</th>
                    <th width="140">订单金额</th>
                    <th width="140">退款金额</th>
                    <th width="140">申请时间</th>
                    <th :width="tableLayout.m_100">售后原因</th>
                    <th width="120">售后状态</th>
                    <th min-width="140" :width="tableLayout.m_140">操作</th>
                </tr>
            </thead>
        </table>
        <div class="customTable__con" :style="{ width: tableLayout.bodyWidth }">
            <template v-if="tableList.length">
                <el-checkbox-group v-model="checkList">
                    <table v-for="(item, index) in tableList" :key="index" class="customTable__table">
                        <colgroup>
                            <col width="48" />
                            <col min-width="80" :width="tableLayout.m_80" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col min-width="100" :width="tableLayout.m_100" />
                            <col :width="tableLayout.d_80" />
                            <col :width="tableLayout.d_80" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col :width="tableLayout.m_100" />
                            <col width="120" />
                            <col min-width="140" :width="tableLayout.m_140" />
                        </colgroup>
                        <tbody>
                            <tr class="customTable__trHead">
                                <td>
                                    <el-checkbox :label="item.id" :disabled="item.applyStatus != 2" />
                                </td>
                                <td colspan="11" style="text-align: left">
                                    <span class="customTable__trHead--action">申请时间：{{ item.createTime }}</span>
                                    <span
                                        class="customTable__trHead--action customTable__primary cursor-pointer"
                                        @click="toDetail(item, 'orderDetail')"
                                    >
                                        订单号: {{ item.orderNumber }}
                                    </span>
                                    <span class="customTable__trHead--action">售后编号: {{ item.refundSn }}</span>
                                    <span class="customTable__trHead--action">
                                        售后类型: {{ item.applyType == 1 ? '退款' : item.applyType == 2 ? '退货' : '已撤销' }}
                                    </span>
                                    <span class="customTable__trHead--action customTable__primary">
                                        <span class="icon iconfont icon-index mr-5 font-12" />
                                        {{ item.shopName }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>{{ index + 1 }}</td>
                                <td colspan="3">
                                    <div v-if="item.orderItemDTOList.length == 1" class="d-flex a-center line-h-md">
                                        <ls-image style="flex: 0 0 60px" :src="item.productImage" :options="{ w: '60', h: '60', br: '4' }" />
                                        <div class="ml-10 flex-col-between">
                                            <el-link :underline="false" type="primary" @click="proPreview(item)">
                                                <el-popover placement="top-start" width="500" trigger="hover" :title="item.productName">
                                                    <el-link
                                                        :underline="false"
                                                        type="primary"
                                                        target="_blank"
                                                        :href="$shareRedirectUrl + '?detailsType=good&id=' + item.productId"
                                                    >
                                                        {{ $shareRedirectUrl + '?detailsType=good&id=' + item.productId }}
                                                    </el-link>
                                                    <div slot="reference" class="text-two text-left">{{ item.productName }}</div>
                                                </el-popover>
                                            </el-link>
                                            <span v-if="item.productAttribute" class="text-999 mt-10 text-left">{{ item.productAttribute }}</span>
                                        </div>
                                    </div>
                                    <div
                                        v-else
                                        class="position-relative w-100 overflow-h swiper-container"
                                        :class="{ 'swiper-wrap': item.orderItemDTOList.length > 4 }"
                                    >
                                        <div :ref="`swiper-container-${index}`" class="d-flex a-center line-h-md position-relative overflow-h">
                                            <el-popover
                                                v-for="orderItem in item.orderItemDTOList"
                                                :key="orderItem.id"
                                                placement="top-start"
                                                width="500"
                                                trigger="hover"
                                                :title="orderItem.productName"
                                            >
                                                <el-link
                                                    :underline="false"
                                                    type="primary"
                                                    target="_blank"
                                                    :href="$shareRedirectUrl + '?detailsType=good&id=' + orderItem.productId"
                                                >
                                                    {{ $shareRedirectUrl + '?detailsType=good&id=' + orderItem.productId }}
                                                </el-link>
                                                <ls-image
                                                    slot="reference"
                                                    style="flex: 0 0 60px"
                                                    class="mr-5"
                                                    :src="orderItem.pic"
                                                    :options="{ w: '60', h: '60', br: '4' }"
                                                />
                                            </el-popover>
                                        </div>
                                        <div v-show="item.orderItemDTOList.length > 4" class="swiper turn-left" @click="swipeLeft(index)">
                                            <span class="iconfont icon-ArrowLeft" style="color: #fff"></span>
                                        </div>
                                        <div v-show="item.orderItemDTOList.length > 4" class="swiper turn-right" @click="swipeRight(index)">
                                            <span class="iconfont icon-ArrowRight" style="color: #fff"></span>
                                        </div>
                                    </div>
                                </td>

                                <!-- 售后数量 -->
                                <td>
                                    <span>{{ item.goodsNum }}</span>
                                </td>

                                <!-- 订单状态 -->
                                <td>
                                    <span :class="'1,5,10'.includes(item.orderStatus) ? 'status-wait' : 'status-done'">
                                        {{ item.orderStatus | getOrderStatus }}
                                    </span>
                                </td>
                                <td>
                                    <div>
                                        <span>{{ item.orderItemMoney | priceFilter }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="item.refundPrice && item.refundPrice != 0">{{ item.refundPrice | priceFilter }}</span>
                                    <span v-else>{{ item.refundAmount | priceFilter }}</span>
                                </td>

                                <!-- 申请时间 -->
                                <td>{{ item.createTime }}</td>

                                <!-- 用户信息 -->
                                <td>
                                    <div class="line-clamp2">{{ item.reason }}</div>
                                </td>

                                <!-- 退款状态 -->
                                <td>
                                    <span :class="item.applyStatus == -3 ? 'status-veto' : afterStatus(item) ? 'status-wait' : 'status-done'">
                                        {{ item | refundStatus }}
                                    </span>
                                </td>

                                <td>
                                    <div class="flex-col-center">
                                        <el-link :underline="false" type="primary" @click="toRefuseDetail(item)">查看</el-link>
                                        <el-link v-if="item.applyStatus == 2" :underline="false" type="primary" @click="examine(item)">审核</el-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-checkbox-group>
            </template>
            <Empty v-else />
        </div>

        <!-- 审核 -->
        <el-dialog title="审核" custom-class="dialog-form-small" :visible.sync="isVisible">
            <el-form ref="ruleForm" :rules="rules" label-width="98px" size="small">
                <el-form-item label="审核结果：" prop="status"><span class="font-12">同意并退款</span></el-form-item>
                <el-form-item label="审核意见：" prop="content">
                    <el-input v-model="content" show-word-limit type="textarea" maxlength="50" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" :disabled="isExaming" @click="isVisible = false">取 消</el-button>
                <el-button type="primary" size="small" :disabled="isExaming" @click="examineSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 确认表格 -->
        <el-dialog title="确认售后" :visible.sync="orderDialogVisible" width="445px" custom-class="dialog-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="95px" label-position="right" size="small">
                <el-form-item label="确认类型" prop="auditFlag">
                    <el-radio-group v-model="form.auditFlag">
                        <el-radio :label="1">同意</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="currentOrder.applyType == 2" label="是否弃货" prop="abandonedGoodFlag">
                    <el-switch v-model="form.abandonedGoodFlag" active-color="#13ce66" inactive-color="#ff4949" />
                </el-form-item>
                <el-form-item label="审核意见" prop="sellerMessage">
                    <el-input v-model="form.sellerMessage" type="textarea" maxlength="100" show-word-limit placeholder="请输入审核意见" />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="orderDialogVisible = false">取 消</el-button>
                    <el-button v-ls-loading size="small" type="primary" @click="sureSubmit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <dialogPreview ref="dialogPreview" />
    </div>
</template>
<script>
import dialogPreview from '@/components/iphonePreview/dialogPreview'
import { serviceOrderApi } from '@/api/ModuleOrder'
import cud from '@/mixins/pages/cud'
export default {
    components: {
        dialogPreview
    },
    filters: {
        getOrderStatus(status) {
            const orderStatusDict = {
                1: '待付款',
                5: '待发货',
                10: '待收货',
                15: '已收货',
                20: '已完成',
                [-5]: '已取消',
                3: '已付定金'
            }
            return orderStatusDict[status] || '-'
        },
        refundStatus(data) {
            if (data.applyStatus == -1 || data.applyStatus == -2) {
                return '已取消'
            }
            if (data.applyStatus == -3) {
                return '已拒绝'
            }
            if (data.applyStatus == 3) {
                return '已完成'
            }
            if (data.applyStatus == 1 && data.sellerStatus == 0) {
                return '待商家确认'
            }
            if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
                return '待商家收货'
            }
            if (data.applyStatus == 2) {
                return '待审核'
            }
            if (data.goodsStatus == 1 && data.sellerStatus == 1) {
                return '待用户退货'
            }
            return '-'
        }
    },
    mixins: [cud],
    props: {
        tableList: {
            type: Array,
            required: true
        },
        selectableArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            checkList: [], // 选中的item
            batchCheckedList: [], //批量审核缓存列表[后台数据 {refundId,orderType}]
            customCheck: false, // 全选状态
            orderDialogVisible: false, // 确认售后订单dialog
            currentOrder: {}, // 激活的售后订单
            form: {
                abandonedGoodFlag: false, // 是否弃货
                auditFlag: 1, // 	是否通过售后
                refundId: '', // 	退款编号
                sellerMessage: '' // 	卖家备注
            },
            rules: {
                abandonedGoodFlag: [
                    {
                        required: true,
                        message: '是否弃货',
                        trigger: 'blur'
                    }
                ],
                auditFlag: [
                    {
                        required: true,
                        message: '是否同意',
                        trigger: 'blur'
                    }
                ]
            },
            content: '',
            refundId: '',
            orderType: '',
            isBatch: false, //是否是批量审核
            isExaming: false, //在请求审核接口时 确认框消失但请求并未结束 会停留在审核窗口 因此要避免审核窗口的按钮可点击
            isVisible: false,
            tableLayout: {
                // 单元格大小分配
                colTotalWidth: 48 + 80 + 100 + 100 + 80 + 80 + 100 + 140 * 4 + 120
            }
        }
    },
    computed: {
        // 可选择的ID列表 供全选过滤使用
        selectableIdsList() {
            return this.selectableArr.map((item) => item.id)
        },
        // 售后状态的等待颜色
        afterStatus() {
            return (row) => {
                return (
                    (row.applyStatus == 1 && row.sellerStatus == 0) ||
                    // || (row.goodsStatus == 1 && row.sellerStatus == 1 && !(row.applyStatus == -1 || row.applyStatus == -2))
                    row.applyStatus == 2 ||
                    (row.goodsStatus == 3 && row.sellerStatus == 1) ||
                    (row.goodsStatus == 5 && row.sellerStatus == 1)
                )
            }
        },
        // 过滤出批量审核时的list对象数组
        bacthCheckList() {
            return this.batchCheckedList
                .filter((item) => this.checkList.includes(item.id))
                .map((item) => ({ refundId: item.id, orderType: item.orderType }))
        }
    },
    watch: {
        orderDialogVisible(newVal) {
            if (!newVal) {
                this.$refs.form.resetFields()
            }
        },
        // 监听选中的数组，如果选中的数组长度等于当前分页的数量，则会全选
        checkList(val) {
            // 如果当前页有一项 不在当前选中的数组里 则一定不全选
            if (this.selectableArr.some((item) => !val.includes(item.id))) {
                this.customCheck = false
            } else {
                this.customCheck = true
            }
            this.$emit('selecteItem', this.customCheck, val)
        },
        // 审核弹出的关闭 需要重置审核内容
        isVisible(nV) {
            if (!nV) {
                this.content = ''
            }
        },
        // 监听可选择的列表数据  用于缓存 批量审核缓存列表
        selectableArr(nL) {
            nL.forEach((item) => {
                if (!this.batchCheckedList.some((each) => each.id == item.id)) {
                    this.batchCheckedList.push(item)
                }
            })
        }
    },
    methods: {
        proPreview(row) {
            let url = this.$shareRedirectUrl + `?detailsType=snapshot&device=mobile&id=${row.id}&snapshotId=${row.snapshotId}`
            this.$nextTick(() => {
                this.$refs.dialogPreview.showDialog({ url: url })
            })
        },
        //审核通过
        examineSubmit() {
            this.$confirm('是否确定同意退款？', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isExaming = true //禁用按钮点击
                let params = {
                    adminMessage: this.content,
                    orderType: this.orderType,
                    refundId: this.refundId
                }
                // 接口请求成功的重复代码
                const successCb = () => {
                    this.isExaming = false
                    this.$message.success('审核成功！')
                    this.isVisible = false
                    this.$emit('changeStatus')
                }
                if (this.isBatch) {
                    params.confirmRefundDTO = this.bacthCheckList
                    delete params.orderType
                    delete params.refundId
                    serviceOrderApi
                        .batchConfirmRefund(params)
                        .then((res) => {
                            if (res.code) {
                                this.checkList = []
                                successCb()
                            }
                        })
                        .finally(() => {
                            this.isExaming = false
                        })
                } else {
                    serviceOrderApi
                        .confirmRefund(params)
                        .then((res) => {
                            if (res.code) {
                                let index = this.checkList.indexOf(params.refundId)
                                if (index > -1) {
                                    this.checkList.splice(index, 1)
                                }
                                // 重置数据状态
                                this.content = ''
                                this.refundId = ''
                                this.orderType = ''
                                successCb()
                            }
                        })
                        .finally(() => {
                            this.isExaming = false
                        })
                }
            })
        },
        // 审核
        examine(item) {
            if (!item && !this.checkList.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            if (item) {
                //单审核
                this.refundId = item.id
                this.orderType = item.orderType
                this.isBatch = false
            } else {
                //批量审核
                this.refundId = ''
                this.orderType = ''
                this.isBatch = true
                console.log('批量审核--', this.checkList, this.bacthCheckList)
            }

            this.isVisible = true
        },
        // 父组件点击全选
        selectedAllOrNot(selected) {
            if (!selected) {
                //反选
                this.checkList = this.checkList.filter((item) => !this.selectableIdsList.includes(item))
            } else {
                //勾选
                this.checkList = [...new Set([...this.checkList, ...this.selectableArr.map((item) => item.id)])]
            }
        },

        // 打开确认dialog
        openSubmitDialog(order) {
            this.currentOrder = order
            this.$set(this.form, 'refundId', order.id)
            this.orderDialogVisible = true
        },

        // 确认提交
        sureSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let api = ''
                    if (this.currentOrder.applyType == 1) {
                        api = 'auditRefund'
                    } else {
                        api = 'auditRefundGood'
                    }
                    serviceOrderApi[api](this.form)
                        .then((res) => {
                            this.orderDialogVisible = false
                            this.$emit('operate', res)
                        })
                        .catch((err) => {
                            console.log('sumit err', err)
                        })
                }
            })
        },

        // 去订单详情
        toDetail(order, name) {
            this.$router.push({
                name: name,
                query: {
                    DetailId: order.orderId
                }
            })
        },
        // 去售后订单详情
        toRefuseDetail(order) {
            this.$router.push({
                name: 'refuseDetail',
                query: {
                    id: order.id
                }
            })
        },
        // 左滑
        swipeLeft(index) {
            this.$refs[`swiper-container-${index}`][0].scrollLeft -= 65
        },
        // 右滑
        swipeRight(index) {
            this.$refs[`swiper-container-${index}`][0].scrollLeft += 65
        }
    }
}
</script>

<style lang="scss" scoped>
/* 商品图片过多时 滑动 */
.swiper {
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #f5f5f5;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all ease 0.4s;
    &.turn-left {
        left: 0;
        visibility: hidden;
    }
    &.turn-right {
        right: 0;
        visibility: hidden;
    }
}

.swiper-container {
    &.swiper-wrap {
        transition: all ease 0.4s;
    }
    &:hover {
        &.swiper-wrap {
            padding: 0 25px;
        }
        .turn-left,
        .turn-right {
            visibility: visible;
        }
    }
}
</style>
