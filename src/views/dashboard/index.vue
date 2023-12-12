<template>
    <div class="dashboard-container">
        <el-container>
            <el-container class="mb-15">
                <el-main class="p-0">
                    <el-card shadow="never" class="mb-15">
                        <div slot="header">
                            <span class="text-333 font-18 font-weight-600">用户信息</span>
                        </div>
                        <el-row type="flex" justify="start" class="">
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天注册用户数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10" >{{ registerList.userRegisterToday }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">累计注册用户数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ registerList.userRegisterTotal }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天入驻商家数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ registerList.shopRegisterToday }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">累计入驻商家数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ registerList.shopRegisterTotal }}</p>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card shadow="never">
                        <div slot="header">
                            <span class="text-333 font-18 font-weight-600">商品信息</span>
                        </div>
                        <el-row type="flex" justify="start" class="">
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天新增发布商品数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ infoList.newProductCount }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天新增商品订单数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ infoList.newOrderCount }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天新增售后订单数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ infoList.newAfterSaleOrderCount }}</p>
                            </el-col>
                            <el-col :span="6" class="py-25 px-20">
                                <span class="text-999 font-weight-400 font-14">当天新增举报商品数量</span>
                                <p class="text-333 font-28 font-weight-600 mt-10">{{ infoList.newReportProductCount }}</p>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-main>
                <el-aside width="280px" class="ml-15 a-stretch">
                    <el-card shadow="never" class="h-100">
                        <div slot="header">
                            <span class="text-333 font-18 font-weight-600">待处理事项</span>
                        </div>
                        <ul class="p-0">
                            <li v-for="(item,index) in pendingList" :key="index" class="font-14 flex-between" style="list-style:none">
                                <div>
                                    <span class="text-666">{{item.name}}</span> 
                                    <span class="text-222 ml-5">({{item.value}})</span>
                                </div>                                
                                <el-button v-if="item.value>0" type="text" class="p-0" @click="handle(index)">处理</el-button>
                            </li>
                        </ul>
                    </el-card>
                </el-aside>
            </el-container>
            <el-footer class="p-0" style="height:auto;">
                <el-card class="border">
                    <div slot="header" class="flex-between">
                        <div class="flex-1">
                            <span class="text-333 font-18 font-weight-600">访问统计</span>
                            <span class="font-12 text-999 ml-10">{{ '数据截止' + (ossStatistics.length && ossStatistics[ossStatistics.length - 1].createTime) + ' 23:59:59（近7天数据）' }}</span>
                            <!-- <el-button type="text" class="p-0 font-12"  @click.stop="$router.push({ name: 'accessStatisticsSummary' })">查看更多</el-button> -->
                        </div>
                        <el-radio-group v-model="source" @change="getOss" class="text-333">
                            <el-radio label="" class="text-333">全部</el-radio>
                            <el-radio label="MINI" class="text-333">小程序</el-radio>
                            <el-radio label="H5" class="text-333">H5</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-loading='!ossStatistics.length'>
                        <pole-chart v-if="ossStatistics.length" :chart-data="ossStatistics" :dimensions="dimensions" :name-list="['访问次数', '访问用户数']" />
                        <empty v-else/>
                    </div>
                </el-card>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { indexApi } from '@/api/Dashboard'
import { ossApi } from '@/api/ModuleData'
import poleChart from './components/poleChart'
export default {
    name: 'dashboard',
    components: {
        poleChart
    },
    data() {
        return {
            registerList: [],
            infoList: [],
            pendingList: [
                {
                    name: '待审核售后',
                    value: 0
                },
                {
                    name: '待处理余额提现',
                    value: 0
                },
                {
                    name: '待处理账单结算',
                    value: 0
                },
                {
                    name: '待审核品牌',
                    value: 0
                },
                {
                    name: '待处理意见反馈',
                    value: 0
                },
                {
                    name: '待审核商品评论',
                    value: 0
                },
                {
                    name: '待审核商品',
                    value: 0
                },
                {
                    name: '待审核举报商品',
                    value: 0
                },
                {
                    name: '待审核店铺',
                    value: 0
                }
            ],
            ossStatistics: [],
            dimensions: ['createTime', 'pv', 'uv'],
            source: '',
        }
    },
    computed: {
        ...mapGetters(['name', 'roles', 'userInfo'])
    },
    mounted() {
        this.register()
        this.info()
        this.getOss()
        this.getPendingList()
    },
    methods: {
        //用户信息
        register() {
            indexApi.register().then((res) => {
                this.registerList = res.data
                console.log(res, 'register')
            })
        },
        //商品信息
        info() {
            indexApi.info().then((res) => {
                this.infoList = res.data
                console.log(res, 'info')
            })
        },
        getOss() {
            ossApi.getViewPic({ source: this.source ? this.source : null }).then((res) => {
                // res.data.forEach(e=>{
                //     this.ossStatistics.push([e.createTime,e.pv,e.uv])
                // })
                this.ossStatistics = res.data
                // console.log(this.ossStatistics)
                // console.log(Object.keys(this.ossStatistics[0]))
            })
        },
        getPendingList() {
            indexApi.PendingList().then((res) => {
                this.pendingList[0].value = res.data.auditedAfterSaleCount
                this.pendingList[1].value = res.data.auditedBalanceWithdrawCount
                this.pendingList[2].value = res.data.auditedBillingCount
                this.pendingList[3].value = res.data.auditedBrandCount
                this.pendingList[4].value = res.data.auditedFeedbackCount
                this.pendingList[5].value = res.data.auditedProductCommentCount
                this.pendingList[6].value = res.data.auditedProductCount
                this.pendingList[7].value = res.data.auditedReportProductCount
                this.pendingList[8].value = res.data.auditedShopCount
            })
        },
        handle(index) {
            let path = ''
            switch (index + 1) {
                case 1:
                    path = 'serviceOrderList'
                    break
                case 2:
                    path = 'withdrawsDetail'
                    break
                case 3:
                    path = 'settleBill'
                    break
                case 4:
                    path = 'commodityBrand'
                    break
                case 5:
                    path = 'comment'
                    break
                case 6:
                    path = 'commentList'
                    break
                case 7:
                    path = 'aduitList'
                    break
                case 8:
                    path = 'report'
                    break
                case 9:
                    path = 'storeList'
                    break
            }
            this.$router.push({
                name: path,
                query: {
                    isDashboard: 3
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        ::v-deep .el-card {
            &__header {
                padding: 14px 20px;
            }   
        }
        .el-container {
            .el-aside {
                ul>li {
                    &+li {
                        margin-top: 8px;
                    }
                }
            }
        }
       
    }
    

    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
