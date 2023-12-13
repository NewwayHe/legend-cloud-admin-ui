<!-- /*
 * @Descripttion:平台红包详情
*/ -->
<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" label-width="132px" size="small">
                <div class="form-title">基本信息</div>
                <el-form-item label="优惠券名称：">
                    <p>{{ form.title || '-' }}</p>
                </el-form-item>
                <el-form-item key="count" label="发放数量：" prop="count">
                    <p>{{ form.count || '-' }}张</p>
                </el-form-item>
                <el-form-item label="领取时间：">
                    <p>{{ form.receiveStartTime || '-' }} 至 {{ form.receiveEndTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="使用时间：">
                    <template v-if="form.receiveStartTime && form.receiveEndTime">
                        <p>{{ form.receiveStartTime || '-' }} 至 {{ form.receiveEndTime || '-' }}</p>
                    </template>
                    <template v-else>
                        <p>按照领取{{ form.useDayLater }}天后{{ form.withinDay }}天内可用</p>
                    </template>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">优惠券信息</div>
                <el-form-item :label="form.minPoint ? '满减券：' : '无门槛券：'">
                    <p v-if="form.minPoint">满{{ form.minPoint || '-' }}元减{{ form.amount || '-' }}元</p>
                    <p v-else>减{{ form.amount || '-' }}元</p>
                </el-form-item>
                <el-form-item label="每人限领：">
                    <p v-if="!form.perTotalLimit && !form.perDayLimit">不限领</p>
                    <p v-if="form.perTotalLimit">活动期间每人限制领取{{ form.perTotalLimit || '-' }}张</p>
                    <p v-if="form.perDayLimit">活动期间每天每人限制领取{{ form.perDayLimit || '-' }}张</p>
                </el-form-item>
                <el-form-item label="领取方式：">
                    <p v-if="form.receiveType == 0">免费领取</p>
                    <p v-if="form.receiveType == 1">卡密兑换</p>
                </el-form-item>
                <el-form-item label="链接：">
                    <el-link
                        class="pr-20"
                        :underline="false"
                        type="primary"
                        :href="$shareRedirectUrl + '?detailsType=coupon&id=' + form.id + '&type=center'"
                    >
                        {{ $shareRedirectUrl + '?detailsType=coupon&id=' + form.id + '&type=center' }}
                    </el-link>
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleCopy(`${$shareRedirectUrl}?detailsType=coupon&id=${form.id}&type=center`, $event)"
                    >
                        复制链接
                    </el-button>
                </el-form-item>
                <el-form-item label="指定发放：">
                    <p>
                        <template v-if="form.designatedUser == 0">不指定用户发放</template>
                        <template v-if="form.designatedUser == 2">平台新注册用户</template>
                        <template v-if="form.designatedUser == 3">平台旧注册用户</template>
                        <template v-if="form.designatedUser == 4">平台新用户</template>
                        <template v-if="form.designatedUser == 5">平台旧用户</template>
                        <el-tooltip v-if="form.designatedUser != 0" placement="right">
                            <div slot="content">
                                平台新注册用户=发布活动后才注册的用户；
                                <br />
                                平台旧注册用户=发布活动前已注册的用户；
                                <br />
                                平台新用户=在平台内没有购买过店铺的用户（包括申请售后成功的用户）
                                <br />
                                平台老用户=在平台内已购买过店铺的用户（剔除申请售后的用户）
                            </div>
                            <i class="el-icon-question text-main font-16 ml-5"></i>
                        </el-tooltip>
                    </p>
                </el-form-item>
                <el-form-item label="优惠券封面图：">
                    <ls-image mode="cover" :src="form.pic" :options="{ w: '160', h: '65' }"></ls-image>
                    <span class="pl-20 v-top">建议尺寸：200*200px</span>
                </el-form-item>
                <el-divider />
                <div class="form-title">活动店铺</div>
                <el-form-item label="店铺：">
                    <p v-if="form.useType == 0">全部店铺</p>
                    <p v-if="form.useType == 1">部分店铺参与</p>
                    <p v-if="form.useType == -1">部分店铺不参与</p>
                    <template v-if="form.useType != 0">
                        <el-form-item label-width="0">
                            <div style="width: 80%">
                                <el-table :data="couponShopList" max-height="400px" border>
                                    <el-table-column prop="shopAvatar" label="店铺头像" width="100">
                                        <template slot-scope="scope">
                                            <ls-image :key="scope.row.shopId" :src="scope.row.shopAvatar" :options="{ w: '50', h: '50' }"></ls-image>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="shopName" label="店铺名称" />
                                </el-table>
                                <el-pagination
                                    class="mt-10"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :page-sizes="[10, 15, 20, 25]"
                                    :page-size="shopPage.pageSize"
                                    :total="shopPageTotal"
                                    @size-change="shopPageSizeChange"
                                    @current-change="shopPageChange"
                                />
                            </div>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-divider />
                <div class="form-title">活动状态</div>
                <el-form-item label="状态：">
                    <p>{{ status[form.status] }}</p>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">领取信息</div>
                <el-form-item label-width="0"><receiveInfo :coupon-id="form.id" /></el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script>
import receiveInfo from './components/receiveInfo'
import clipboard from '@/utils/clipboard' // 复制功能
import { couponApi } from '@/api/ModuleMarketing.js'
export default {
    components: { receiveInfo: receiveInfo },
    data() {
        return {
            auditList: [], // 提交审核的数组
            form: {},
            imageUrl: '',
            couponShopList: [], //参与优惠券活动的部分店铺列表
            status: {
                0: '未开始',
                1: '进行中',
                3: '已结束',
                '-1': '已失效',
                '-2': '已删除'
            },
            shopPage: {
                pageSize: 10,
                curPage: 1
            },
            shopPageTotal: 0
        }
    },
    mounted() {
        couponApi.couponDetail(this.$route.query.couponId).then((res) => {
            if (res.code) {
                this.form = res.data
                this.getcounPage()
            }
        })
    },
    methods: {
        getcounPage() {
            if (this.form.useType != 0) {
                couponApi.couponShop({ useType: 1, couponId: this.form.id, ...this.shopPage }).then((res) => {
                    if (res.code) {
                        this.couponShopList = res?.data?.resultList || []
                        this.shopPageTotal = res?.data?.total || 0
                    }
                })
            }
        },
        shopPageSizeChange(e) {
            this.shopPage.pageSize = e
        },
        shopPageChange(e) {
            this.shopPage.curPage = e
        },
        goBack() {
            this.$router.back()
        },
        handleCopy(text, event) {
            clipboard(text, event)
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>
