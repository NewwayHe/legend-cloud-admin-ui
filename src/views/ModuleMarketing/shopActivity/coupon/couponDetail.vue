<!-- /*
 * @Descripttion:查看优惠券详情
*/ -->
<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" label-width="132px" size="small">
                <div class="form-title">店铺信息</div>
                <el-form-item label="店铺名称：">
                    <el-link type="primary" :underline="false" :href="$shareRedirectUrl + '?detailsType=shop&shopId=' + form.shopId" target="_blank">
                        {{ form.shopName }}
                    </el-link>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">活动信息</div>
                <el-form-item label="优惠券名称：">
                    <p>{{ form.title }}</p>
                </el-form-item>
                <el-form-item label="规则：">
                    <p>{{ form.minPoint == 0 ? '无门槛' : '满' + form.minPoint + '元' }}减{{ form.amount }}元</p>
                </el-form-item>
                <el-form-item label="开始/结束时间：">
                    <p>{{ form.receiveStartTime }} 至 {{ form.receiveEndTime }}</p>
                </el-form-item>
                <el-form-item label="优惠券类型：">
                    <p>{{ form.useType | getUseType() }}</p>
                </el-form-item>
                <el-form-item label="领取方式：">
                    <p>{{ form.receiveType | getReceiveType() }}</p>
                </el-form-item>
                <el-form-item label="领取上限：">
                    <p v-if="form.perDayLimit == 0 && form.perTotalLimit == 0">不限领</p>
                    <p v-if="form.perDayLimit != 0">限制每天每人领取{{ form.perDayLimit }}张</p>
                    <p v-if="form.perTotalLimit != 0">限制活动期间每人领取{{ form.perTotalLimit }}张</p>
                </el-form-item>
                <el-form-item label="发放数量：">
                    <p>{{ form.count }}</p>
                </el-form-item>
                <el-form-item label="描述：">
                    <p>
                        {{ form.minPoint == 0 ? '无门槛' : '满' + form.minPoint + '元' }}减{{ form.amount }}元，
                        <span v-if="form.perDayLimit == 0 && form.perTotalLimit == 0">不限领</span>
                        <span v-if="form.perDayLimit != 0">限制每天每人领取{{ form.perDayLimit }}张</span>
                        <span v-if="form.perTotalLimit != 0">限制活动期间每人领取{{ form.perTotalLimit }}张</span>
                    </p>
                </el-form-item>
                <el-form-item label="优惠券封面：">
                    <img :src="$photoServer + form.pic" style="width: 100px; height: 100px" />
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
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">活动信息</div>
                <el-form-item label="活动商品：">
                    <!-- 商品列表组件 -->
                    <table-goods v-if="form.useType != undefined && form.useType != null" :coupon-id="id" :use-type="form.useType" />
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">活动状态</div>
                <el-form-item label="活动状态：">
                    <p :class="form.status == -2 ? 'status-veto' : form.status == 1 ? 'status-wait' : 'status-done'">
                        {{ form.status | getStatus() }}
                    </p>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">领取信息</div>
                <el-form-item label="领取信息：" class="btn_lastItem">
                    <!-- 商品列表组件 -->
                    <table-coupon-get :coupon-id="id" />
                </el-form-item>
            </el-form>
        </el-card>
        <submitBottom>
            <el-button size="small" @click="goBack">返回</el-button>
        </submitBottom>
    </section>
</template>
<script>
import tableGoods from './components/tableGoods'
import tableCouponGet from './components/tableCouponGet'
import clipboard from '@/utils/clipboard' // 复制功能
import request from '@/utils/request'
import { couponApi } from '@/api/ModuleMarketing'
export default {
    components: { 'table-goods': tableGoods, 'table-coupon-get': tableCouponGet },
    filters: {
        getUseType(type) {
            let useType = {
                0: '指定店铺全场通用',
                1: '指定商品使用',
                '-1': '排除商品使用'
            }
            return useType[type]
        },
        getReceiveType(type) {
            let receiveType = {
                0: '免费领取',
                1: '卡密领取'
            }
            return receiveType[type]
        },
        getStatus(type) {
            let statusType = {
                '-2': '已删除',
                '-1': '已失效',
                0: '未开始',
                1: '进行中',
                2: '已暂停',
                3: '已结束'
            }
            return statusType[type]
        }
    },
    data() {
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            imageUrl: '',
            id: ''
        }
    },
    created() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            this.getData()
        }
    },
    methods: {
        goBack() {
            this.$router.back()
        },
        getData() {
            couponApi.couponDetail(this.id).then((res) => {
                this.form = res.data
            })
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
