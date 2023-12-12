<!-- /*
 * @Descripttion:新增优惠券
*/ -->

<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="couponForm" :rules="rules" label-width="135px" size="small">
                <div class="form-title">基本信息</div>
                <el-form-item label="优惠券名称：" prop="title">
                    <el-input v-model="couponForm.title" :disabled="pageType == 'lookInfo'" style="width: 450px" />
                </el-form-item>
                <el-form-item key="count" label="发放数量：" prop="count">
                    <el-input
                        v-model="couponForm.count"
                        :disabled="pageType == 'lookInfo'"
                        :oninput="$inputInteger"
                        placeholder="发放数量"
                        style="width: 450px"
                    >
                        <template slot="append">张</template>
                    </el-input>
                </el-form-item>
                <el-form-item label=" 领取时间：" prop="receiveStartTime">
                    <el-date-picker
                        v-model="tempForm.receiveTime"
                        :picker-options="pickerOptions"
                        :disabled="pageType == 'lookInfo'"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="领取开始时间"
                        end-placeholder="领取结束时间"
                        @blur="pickerBlur"
                        @change="receiveTimeChange"
                    />
                </el-form-item>
                <el-form-item label="使用时间">
                    <el-radio-group v-model="tempForm.useTimeType" ::disabled="pageType == 'lookInfo'">
                        <el-form-item prop="useStartTime" label-width="0">
                            <div class="d-flex a-center font-14">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div>按照时间段设置</div>
                                <el-date-picker
                                    v-model="tempForm.useTime"
                                    :disabled="pageType == 'lookInfo'"
                                    :picker-options="pickerOptions"
                                    class="mx-10"
                                    type="datetimerange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="使用开始时间"
                                    end-placeholder="使用结束时间"
                                    @blur="pickerBlur"
                                    @change="useTimeChange"
                                />
                            </div>
                        </el-form-item>
                        <div class="mt-10 d-flex a-center font-14">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div>按照领取</div>
							<lsInput class="mx-10 w-150p" v-model="couponForm.useDayLater" :disabled="pageType == 'lookInfo'" :precision="0" :min="0"  :max="999"/>
                             天后
							 <lsInput class="mx-10 w-150p" v-model="couponForm.withinDay" :disabled="pageType == 'lookInfo'" :precision="0" :min="0"  :max="30"/>
                            内可用
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">优惠券信息</div>
                <el-form-item label="设置优惠门槛 ：">
                    <el-radio-group v-model="tempForm.pointType" :disabled="pageType == 'lookInfo'">
                        <el-form-item label-width="0" prop="minPoint">
                            <div class="d-flex a-center font-14">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div>满</div>
                                <el-input
                                    v-model="couponForm.minPoint"
                                    :disabled="pageType == 'lookInfo'"
                                    :oninput="$inputMoney"
                                    class="ml-10"
                                    placeholder="请输入金额"
                                    style="width: 150px"
                                >
                                    <template slot="append">元</template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <div class="mt-10 d-flex a-center font-14">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div>无使用门槛（可与其他优惠券叠加使用）</div>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设置优惠金额 ：" prop="amount">
                    <div class="d-flex a-center font-14">
                        <div>减</div>
                        <el-input
                            v-model="couponForm.amount"
                            :oninput="$inputMoney"
                            :disabled="pageType == 'lookInfo'"
                            class="ml-10"
                            placeholder="请输入内容"
                            style="width: 150px"
                        >
                            <template slot="append">元</template>
                        </el-input>
                    </div>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">其它设置</div>
                <el-form-item label="每人限领：">
                    <el-radio-group v-model="tempForm.LimitType" :disabled="pageType == 'lookInfo'">
                        <div class="mt-10 mb-20 d-flex a-center font-14">
                            <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                            <div>不限领</div>
                        </div>
                        <el-form-item label-width="0" prop="perDayLimit">
                            <div class="d-flex a-center font-14">
                                <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                                <div>限制每天每人领取</div>
								<lsInput
								    v-model="couponForm.perDayLimit"
									:min="1"
								    :max="1000000"
									:precision="0"
								    :disabled="pageType == 'lookInfo'"
								    class="mx-10 w-200p"
								>
								    <template slot="append">张</template>
								</lsInput>
                            </div>
                        </el-form-item>
                        <el-form-item label-width="0" prop="perTotalLimit">
                            <div class="d-flex a-center font-14">
                                <el-radio class="mr-0" :label="2">{{ '' }}</el-radio>
                                <div>限制活动期间每人领取</div>
								<lsInput
								    v-model="couponForm.perTotalLimit"
									:min="1"
								    :max="1000000"
									:precision="0"
								    :disabled="pageType == 'lookInfo'"
								    class="mx-10 w-200p"
								>
								    <template slot="append">张</template>
								</lsInput>
                            </div>
                        </el-form-item>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="couponForm.receiveType == 0" label="指定发放：">
                    <el-radio-group v-model="tempForm.userType" :disabled="pageType == 'lookInfo'">
                        <el-radio :label="0">不指定用户发放</el-radio>
                        <el-radio :label="1">指定用户发放</el-radio>
                    </el-radio-group>
                    <el-form-item v-if="tempForm.userType == 1" class="mt-10">
                        <el-select v-model="couponForm.designatedUser" :disabled="pageType == 'lookInfo'" clearable placeholder="请选择">
                            <el-option v-for="item in platformType" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="couponForm.designatedUser == 1" class="mt-10">
                        <el-input
                            v-model="couponForm.mobileList"
                            :disabled="pageType == 'lookInfo'"
                            type="textarea"
                            :rows="3"
                            show-word-limit
                            maxlength="300"
                            style="width: 500px"
                            placeholder='输入手机号码,使用英文符号逗号","隔开'
                        />
                    </el-form-item>
                </el-form-item>
                <el-form-item label="优惠券封面图：" prop="pic">
                    <imgCenter v-model="couponForm.pic" :disabled="pageType == 'lookInfo'"></imgCenter>
					<span class="pl-20 v-top">建议尺寸：200*200px</span>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">活动店铺</div>
                <el-form-item label="选择店铺：">
                    <el-radio-group v-model="couponForm.useType" :disabled="pageType == 'lookInfo'">
                        <el-radio :label="0">全部店铺</el-radio>
                        <el-radio :label="1">部分店铺参与</el-radio>
                        <el-radio :label="-1">部分店铺不参与</el-radio>
                    </el-radio-group>
                    <template v-if="couponForm.useType != 0">
                        <el-form-item label-width="0">
                            <el-button v-if="pageType != 'lookInfo'" type="primary" style="margin: 10px 0" size="small" @click="choseGoods">
                                选择店铺
                            </el-button>
                            <tableGoods :coupon-form="couponForm" :table-list="couponTableList" @delCouponShop="delCouponShop" />
                            <el-pagination
                                class="mt-10"
                                :page-sizes="[5, 10, 15]"
                                :page-size="couponPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="couponPage.total"
                                @size-change="couponPageSizeChange"
                                @current-change="couponPageChange"
                            />
                        </el-form-item>
                    </template>
                </el-form-item>
                <template v-if="couponForm.id && pageType == 'lookInfo'">
                    <el-divider />
                    <!-- 这是分割线 -->
                    <div class="form-title">活动状态</div>
                    <el-form-item label="状态：">
                        {{ couponForm.status | getLabelText(couponStatus) }}
                    </el-form-item>

                    <el-divider />
                    <!-- 这是分割线 -->
                    <div class="form-title">领取信息</div>
                    <el-form-item label-width="0">
                        <receiveInfo :coupon-id="couponForm.id" @statusChange="getcounPage" />
                    </el-form-item>
                </template>
            </el-form>
        </el-card>
		<submitBottom>
			<template v-if="pageType != 'lookInfo'">
			    <el-button size="small" class="ml-50" @click="back">取消</el-button>
			    <el-button type="primary" size="small" @click="onSubmit">新增</el-button>
			</template>
			<template v-else>
			    <el-button size="small" class="ml-50" @click="back">返回</el-button>
			</template>
		</submitBottom>
        <dialogSpuGoods ref="dialogSpuGoods" :shop-list-ids="couponForm.selectShopId" :coupon-id.sync="couponForm.id" @sumbitTable="storeSumbit" />
    </section>
</template>

<script>
import dialogSpuGoods from './components/dialogSpuGoods'
import tableGoods from './components/couponGoodsTable'
import receiveInfo from './components/receiveInfo'
import { couponApi } from '@/api/ModuleMarketing.js'
import moment from 'moment'
export default {
    components: { dialogSpuGoods, receiveInfo, tableGoods },
    data() {
        function parseTime(time) {
            return moment(time).valueOf()
        }
        // 使用优惠券校验
        var useTimeValidate = (rule, value, callback) => {
            if (this.tempForm.useTimeType == 0 && !this.couponForm.useStartTime) {
                callback(new Error('使用时间不能为空'))
            }

            if (this.tempForm.useTimeType == 0 && parseTime(this.couponForm.useStartTime) < parseTime(this.couponForm.receiveStartTime)) {
                callback(new Error('领取开始时间不能晚于使用开始时间'))
            }
            callback()
        }

        // 门槛优惠券校验
        var minPointValidate = (rule, value, callback) => {
            if (this.tempForm.pointType == 0 && !this.couponForm.minPoint) {
                callback(new Error('优惠券门槛不能为空'))
            }
            callback()
        }

        // 限制活动期间每人领取 校验
        var perTotalLimitValidate = (rule, value, callback) => {
            if (this.tempForm.LimitType == 2 && !this.couponForm.perTotalLimit) {
                callback(new Error('每人总限领张数不能为空或者大于0'))
            }
            callback()
        }

        // 每人每天领张数 校验
        var perDayLimitValidate = (rule, value, callback) => {
            if (this.tempForm.LimitType == 1 && !this.couponForm.perDayLimit) {
                callback(new Error('每人每天领张数不能为空或者大于0'))
            }
            callback()
        }

        // 每人每天领张数 校验
        var amountValidate = (rule, value, callback) => {
            if (this.tempForm.pointType == 0 && Number(this.couponForm.amount) >= Number(this.couponForm.minPoint)) {
                callback(new Error('优惠金额不能大于门槛金额'))
            }
            callback()
        }

        return {
            pickerMinDate: '',
            // 限制只能选择三十天的时间段
            pickerOptions: {
                onPick: (obj) => {
                    this.pickerMinDate = new Date(obj.minDate).getTime()
                },
                disabledDate: (time) => {
                    if (this.pickerMinDate) {
                        const day1 = 30 * 24 * 3600 * 1000
                        const currentTime = new Date().getTime()
                        const maxTime = this.pickerMinDate + day1
                        return time.getTime() > maxTime || time.getTime() < this.pickerMinDate
                    }
                }
            },
            couponStatus: [
                { label: '所有活动', value: '' },
                { label: '未开始', value: 0 },
                { label: '进行中', value: 1 },
                { label: '已暂停', value: 2 },
                { label: '已结束', value: 3 },
                { label: '已失效', value: -1 },
                { label: '已删除', value: -2 }
            ],
            couponTableList: [], // 选中优惠券列表
            couponForm: {
                id: '',
                status: 0,
                title: '', // 优惠券标题
                count: '', // 发放数量
                amount: '', // 优惠券面额
                receiveStartTime: '', // 领取开始时间
                receiveEndTime: '', // 领取结束时间
                useStartTime: '', // 使用开始时间
                useEndTime: '', // 使用结束时间
                useDayLater: 0, // 多少天后可以使用
                withinDay: 0, // 几天之内可用
                pic: '', // 优惠券图片
                receiveType: 0, // 领取方式，0，免费领取，1，卡密领取
                useType: 0, // 优惠券使用类型：0全场通用，1指定商品使用，-1排除商品使用
                skuIdList: [], // sku商品列表
                mobileList: '', // 指定的用户手机号码
                designatedUser: '', // 指定用户
                minPoint: '', // 使用门槛，0.00为无门槛
                description: '', // 优惠券描述
                perTotalLimit: '', // 每人总限领张数
                perDayLimit: '', // 每人每天领张数
                selectShopId: []
            },
            tempForm: {
                // 辅助表单显示
                receiveTime: [], // 领取时间
                useTime: [], // 使用时间
                userType: 0, // 指定用户类型 0 不指定 1 指定
                useTimeType: 0, // 使用时间类型  0 按照时间段设置 1 按照领取几天后几天内使用
                LimitType: 0, // 限领类型 0 不限领 1 限制每天每人领取 2 限制活动期间每人领取
                pointType: 0 // 门槛类型 0 满多少元使用 1 无使用门槛（可与其他优惠券叠加使用）
            },
            pageType: 'normal', // 页面类型，查看 :lookInfo  正常 :normal
            couponId: '', // 优惠券id
            platformType: [
                {
                    value: 1,
                    label: '手机号码'
                },
                {
                    value: 2,
                    label: '平台新注册用户'
                },
                {
                    value: 3,
                    label: '平台旧注册用户'
                },
                {
                    value: 4,
                    label: '平台新用户'
                },
                {
                    value: 5,
                    label: '平台老用户'
                },
                {
                    value: 6,
                    label: '店铺新用户'
                },
                {
                    value: 7,
                    label: '店铺老用户'
                }
            ],
            value: '',
            rules: {
                title: { required: true, message: '优惠券不能为空', trigger: 'blur' },
                count: [
                    { required: true, message: '发送数量不能为空', trigger: 'blur' }
                ],
                receiveStartTime: [{ required: true, message: '领取时间不能为空', trigger: 'blur' }],
                useStartTime: [
                    { validator: useTimeValidate, trigger: 'blur' }
                ],
                minPoint: [
                    { validator: minPointValidate, trigger: 'blur' }
                ],
                perTotalLimit: [
                    { validator: perTotalLimitValidate, trigger: 'blur' }
                ],
                perDayLimit: [
                    { validator: perDayLimitValidate, trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '优惠金额不能为空', trigger: 'blur' },
                    { validator: amountValidate, trigger: 'blur' }
                ]
            },
            couponPage: {
                curPage: 1,
                pageSize: 10,
                total: 0
            },
            imageUrl: ''
        }
    },
    created() {
        if (this.$route.query.couponType) {
            this.pageType = this.$route.query.couponType
        }
        if (this.$route.query.couponId) {
            this.couponId = this.$route.query.couponId
            this.getCouponDetail(this.couponId)
        }
    },
    methods: {
        // 失去焦点后清空时间校验数据
        pickerBlur() {
            this.pickerMinDate = ''
        },
        storeSumbit(selectShopId) {
            this.couponForm.selectShopId = selectShopId
            this.$nextTick(() => {
                this.getcounPage()
            })
        },
        delCouponShop(id) {
            console.log(id)
            this.couponForm.selectShopId = this.couponForm.selectShopId.filter((item) => {
                return item != id
            })
            this.getcounPage()
        },
        // 获取关联优惠券店铺
        getcounPage() {
            couponApi.couponShop({ useType: 1, couponId: this.couponForm.id, ...this.couponPage }).then((res) => {
                if (res.code) {
                    this.couponTableList = res?.data?.resultList || []
                    this.couponPage.total = res?.data?.total || 0
                }
            })
        },
        couponPageSizeChange(size) {
            this.couponPage.pageSize = size
            this.getcounPage()
        },
        couponPageChange(p) {
            this.couponPage.curPage = p
            this.getcounPage()
        },

        copyCouponShop() {
            return couponApi.copyCouponShop(this.couponForm.id).then((res) => {
                if (res.code) {
                    this.couponForm.id = res.data
                }
                return res
            })
        },

        // 获取优惠券信息
        getCouponDetail(couponId) {
            couponApi.couponDetail(couponId).then(async (res) => {
                if (res.code == 1) {
                    this.couponForm = res.data
                    if (this.pageType == 'copy') {
                        await this.copyCouponShop()
                    }
                    if (res.data.useType != 0) {
                        this.getcounPage()
                    }
                    // 接收时间
                    if (res.data.receiveEndTime) {
                        this.tempForm.receiveTime = [res.data.receiveStartTime, res.data.receiveEndTime]
                    }

                    // 使用时间
                    if (res.data.useStartTime) {
                        this.tempForm.useTime = [res.data.useStartTime, res.data.useEndTime]
                    } else {
                        this.tempForm.useTimeType = 1
                    }

                    // 门槛
                    if (!res.data.minPoint) {
                        this.tempForm.pointType = 1
                    }
                    // 制定用户类型
                    if (res.data.designatedUser) {
                        this.tempForm.userType = 1
                    } else {
                        this.couponForm.designatedUser = ''
                    }

                    // 限领类型
                    if (res.data.perTotalLimit) {
                        this.tempForm.LimitType = 2
                    } else if (res.data.perDayLimit) {
                        this.tempForm.LimitType = 1
                    }
                }
            })
        },
        choseGoods() {
            this.$refs.dialogSpuGoods.dialogShow()
        },
        // 使用时间
        useTimeChange(value) {
            if (!value) {
                value = []
            }
            this.couponForm.useStartTime = value[0] || ''
            this.couponForm.useEndTime = value[1] || ''
        },

        // 领取时间
        receiveTimeChange(value) {
            console.log(value)
            if (!value) {
                value = []
            }
            this.couponForm.receiveStartTime = value[0] || ''
            this.couponForm.receiveEndTime = value[1] || ''
        },

        onSubmit() {
            this.$refs['form'].validate((val, imgList) => {
                if (val) {
                    const formParam = Object.assign({}, this.couponForm)
                    // 使用优惠券情况
                    if (this.tempForm.useTimeType == 1) {
                        formParam.useStartTime = ''
                        formParam.useEndTime = ''
                    } else {
                        formParam.useDayLater = 0
                        formParam.withinDay = 0
                    }

                    // 门槛优惠券
                    if (this.tempForm.pointType == 1) {
                        formParam.minPoint = 0
                    }

                    if (!this.tempForm.userType) {
                        formParam.designatedUser = 0
                    }

                    // 限领类型
                    if (this.tempForm.LimitType == 0) {
                        formParam.perTotalLimit = 0
                        formParam.perDayLimit = 0
                    } else if (this.tempForm.LimitType == 1) {
                        formParam.perTotalLimit = 0
                    } else {
                        formParam.perDayLimit = 0
                    }

                    couponApi.saveCoupon(formParam).then((res) => {
                        if (res.code == 1) {
                            this.$router.push({ name: 'activeCoupon' })
                        }
                    })
                }
            })
        },

        // 返回
        back() {
            this.$router.push({ name: 'activeCoupon' })
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>
