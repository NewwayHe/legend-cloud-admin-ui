<template>
    <div class="print-wrapper">
        <div class="mb-20 pt-20">
            <ls-image
                v-if="systemConfigTemp && systemConfigTemp.pcUserLogo"
                class="v-middle"
                :src="systemConfigTemp.pcUserLogo"
                :options="{ h: '50' }"
                :is-preview="false"
            />
        </div>
        <div class="print-info mb-20">
            <h1 class="info-title">{{ orderData.nickName }}-购物清单</h1>
            <div class="info-item pl-15">
                <label class="label">收货人：</label>
                <label class="content">{{ orderData.receiver }}</label>
            </div>
            <div class="shop-info">
                <div class="flex-1">
                    <div class="info-item">
                        <label class="label">手机：</label>
                        <label class="content">{{ orderData.mobile }}</label>
                    </div>
                    <!-- <div class="info-item">
                        <label class="label">邮编：</label>
                        <label class="content">无</label>
                    </div> -->
                    <div class="info-item">
                        <label class="label">订单号：</label>
                        <label class="content">{{ orderData.orderNumber }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">发货订单：</label>
                        <label class="content">{{ orderData.orderLogisticsId ? orderData.orderLogisticsDTO.shipmentNumber : '未发货' || '-' }}</label>
                    </div>
                </div>
                <div class="flex-1">
                    <!-- <div class="info-item">
                        <label class="label">电话：</label>
                        <label class="content"></label>
                    </div> -->
                    <div class="info-item">
                        <label class="label">地址：</label>
                        <label class="content">{{ orderData.detailAddress }}</label>
                    </div>
                    <div class="info-item">
                        <label class="label">发票信息：</label>
                        <label class="content">
                            {{ orderData.needInvoiceFlag ? goodsData.invoiceCompany + '--' + orderData.invoiceHumNumber : '不开发票' }}
                        </label>
                    </div>
                    <div class="info-item">
                        <label class="label">下单时间：</label>
                        <label class="content">{{ orderData.createTime }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="print-goods">
            <el-table ref="multipleTable" :data="tableList" tooltip-effect="light" class="w-100" :header-cell-style="{ background: '#fafafa' }">
                <template slot="empty">
                    <empty empty-type="pro" />
                </template>
                <el-table-column label="序号" type="index" width="100" />
                <el-table-column prop="productName" label="商品" />
                <el-table-column label="单价">
                    <template slot-scope="scope">
                        {{ scope.row.price | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="basketCount" label="数量" />
                <!-- <el-table-column prop="productTotalAmount" label="小计" /> -->
                <el-table-column label="小计">
                    <template slot-scope="scope">
                        {{ scope.row.actualAmount | priceFilter }}
                    </template>
                </el-table-column>
            </el-table>

            <el-row type="flex" justify="end" class="mt-20">
                <div>
                    <div class="account mr-15">
                        <div class="account-item">
                            <label class="label">商品总价：</label>
                            <label class="content">{{ orderData.totalPrice | priceFilter }}</label>
                        </div>
                        <div class="account-item">
                            <label class="label">运费：</label>
                            <label class="content">{{ orderData.freightPrice | priceFilter }}</label>
                        </div>
                        <div class="account-item">
                            <label class="label">订单优惠：</label>
                            <label class="content">-{{ orderData.totalDiscountAmount | priceFilter }}</label>
                        </div>
                        <div class="account-item">
                            <label class="label">订单总价：</label>
                            <label class="account-count">{{ orderData.actualTotalPrice | priceFilter }}</label>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
        <div class="mt-20">
            <el-row type="flex" justify="center" class="mt-20">
                <div class="d-flex flex-column a-center">
                    <p class="mb-30 font text-999">专业塑造传奇，用心成就电商</p>
                    <el-button class="text-center mb-60" type="primary" @click="print">打印</el-button>
                    <div class="line"></div>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import { orderList } from '@/api/ModuleOrder.js'
export default {
    data() {
        return {
            tableList: [
                /* {
                //     name: '商品名称',
                //     money: '￥99.00',
                //     num: '1',
                //     count: '￥99.00'
                } */
            ],
            orderData: {},
            isSingle: false, //判断是否只打印订单中某件商品
            systemConfigTemp: '', // 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
            systemConfigFinally: false
        }
    },
    mounted() {
        this.getOrderDetails()

        let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
        // 如果main.js里面执行了方法获取到系统设置
        if (systemConfig && systemConfig.id) {
            this.systemConfigTemp = systemConfig
            this.systemConfigFinally = true
            // 如果VUEX里没有设置systemConfig(系统设置)
        } else {
            this.$store
                .dispatch('user/getSystemConfig')
                .then((res) => {
                    this.systemConfigTemp = res
                    // console.log('systemConfig:',this.systemConfigTemp);
                })
                .catch(() => {})
                .finally(() => {
                    this.systemConfigFinally = true
                })
        }
    },
    methods: {
        print() {
            window.print()
        },
        getOrderDetails() {
            orderList.getOrderDetails({ orderId: this.$route.query.orderId }).then((res) => {
                if (res.code) {
                    this.orderData = res.data
                    this.tableList = res.data.orderItemDTOList
                }
            })
        }
    }
}
</script>
<style>
html,
body {
    background-color: #fff;
}
</style>
<style lang="scss" scoped>
.print-wrapper {
    width: 990px;
    margin: 0 auto;
    background: #fff;

    .print-info {
        border: 1px solid #ebedf5;
        border-top: 3px solid #999;

        .info-title {
            font-size: 24px;
            color: rgba(51, 51, 51, 1);
            font-weight: 400;
            text-align: center;
            margin-bottom: 30px;
        }

        .shop-info {
            padding-left: 15px;
            font-size: 12px;
            display: flex;

            .info-item {
                margin-bottom: 35px;
                color: #333333;

                .label {
                    display: inline-block;
                    width: 85px;
                    text-align: right;
                }

                .content {
                    display: inline-block;
                }
            }
        }

        .info-item {
            margin-bottom: 35px;
            color: #333333;
            font-size: 12px;

            .label {
                display: inline-block;
                width: 85px;
                text-align: right;
            }

            .content {
                display: inline-block;
            }
        }
    }

    .print-goods {
        border: 1px solid #ebedf5;

        .account {
            .account-item {
                font-size: 12px;
                margin-bottom: 20px;

                .label {
                    display: inline-block;
                    width: 135px;
                    text-align: right;
                }

                .content {
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                }

                .account-count {
                    display: inline-block;
                    width: 80px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333333;
                    text-align: right;
                }
            }
        }
    }

    .line {
        width: 990px;
        height: 1px;
        background-color: #ebedf5;
    }
}
</style>
