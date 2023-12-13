<!-- /*
 * @Descripttion:新增优惠券
*/ -->

<template>
    <section class="formWarp mb-50">
        <el-card>
            <el-form ref="form" :model="couponForm" :rules="rules" label-width="132px" size="small">
                <div class="form-title">基本信息</div>
                <el-form-item label="优惠券名称：" prop="title">
                    <el-input
                        v-model="couponForm.title"
                        :disabled="pageType == 'lookInfo'"
                        maxlength="25"
                        style="width: 450px"
                        show-word-limit
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item key="count" label="发放数量：" prop="count">
                    <el-input
                        v-model="couponForm.count"
                        max="1000000"
                        :maxlength="7"
                        :disabled="pageType == 'lookInfo'"
                        :oninput="$inputInteger"
                        placeholder="发放数量"
                        style="width: 450px"
                    >
                        <template slot="append">张</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="领取时间：" prop="receiveStartTime">
                    <el-date-picker
                        v-model="tempForm.receiveTime"
                        style="width: 450px"
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
                    <el-radio-group v-model="tempForm.useTimeType" :disabled="pageType == 'lookInfo'" @change="resetInput">
                        <el-form-item prop="useStartTime" label-width="0">
                            <div class="d-flex a-center font-12">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div>按照时间段设置</div>
                                <el-date-picker
                                    v-model="tempForm.useTime"
                                    :disabled="pageType == 'lookInfo'"
                                    :picker-options="usePickerOptions"
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
                        <div class="mt-10 d-flex a-center font-12">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div>按照领取</div>
                            <lsInput
                                v-model="couponForm.useDayLater"
                                class="mx-10 w-150p"
                                :disabled="pageType == 'lookInfo'"
                                :precision="0"
                                :min="0"
                                :max="999"
                            />
                            天后
                            <lsInput
                                v-model="couponForm.withinDay"
                                class="mx-10 w-150p"
                                :disabled="pageType == 'lookInfo'"
                                :precision="0"
                                :min="0"
                                :max="999"
                            />
                            天内可用
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">优惠券信息</div>
                <el-form-item label="设置优惠门槛 ：">
                    <el-radio-group v-model="tempForm.pointType" :disabled="pageType == 'lookInfo'">
                        <el-form-item label-width="0" prop="minPoint">
                            <div class="d-flex a-center font-12">
                                <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                                <div>满</div>
                                <lsInput
                                    v-model="couponForm.minPoint"
                                    :min="0"
                                    :max="999999"
                                    :precision="2"
                                    placeholder="请输入金额"
                                    :disabled="pageType == 'lookInfo'"
                                    class="ml-10"
                                    style="width: 180px"
                                >
                                    <template slot="append">元</template>
                                </lsInput>
                            </div>
                        </el-form-item>
                        <div class="mt-10 d-flex a-center font-12">
                            <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                            <div>无使用门槛（可与其他优惠券叠加使用）</div>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设置优惠金额 ：" prop="amount">
                    <div class="d-flex a-center font-12">
                        <div>减</div>
                        <lsInput
                            v-model="couponForm.amount"
                            :min="0"
                            :max="999999"
                            :precision="2"
                            placeholder="请输入优惠金额"
                            :disabled="pageType == 'lookInfo'"
                            class="ml-10"
                            style="width: 180px"
                        >
                            <template slot="append">元</template>
                        </lsInput>
                    </div>
                </el-form-item>
                <el-form-item v-if="pageType == 'lookInfo'" label="优惠券链接 ：">
                    <el-link type="primary" :underline="false">{{ couponUrl }}</el-link>
                    <el-button type="primary" @click="handleCopy(couponUrl, $event)">复制链接</el-button>
                </el-form-item>
                <el-divider />
                <!-- 这是分割线 -->
                <div class="form-title">其它设置</div>
                <el-form-item label="每人限领：">
                    <el-radio-group v-model="tempForm.LimitType" :disabled="pageType == 'lookInfo'">
                        <div class="mt-10 mb-20 d-flex a-center font-12">
                            <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                            <div>不限领</div>
                        </div>
                        <el-form-item label-width="0" prop="perDayLimit">
                            <div class="d-flex a-center font-12">
                                <el-radio :label="1" class="mr-0">{{ '' }}</el-radio>
                                <div>限制每天每人领取</div>
                                <lsInput
                                    v-model="couponForm.perDayLimit"
                                    :min="1"
                                    :max="999"
                                    :precision="0"
                                    :disabled="pageType == 'lookInfo'"
                                    class="mx-10 w-200p"
                                >
                                    <template slot="append">张</template>
                                </lsInput>
                            </div>
                        </el-form-item>
                        <el-form-item label-width="0" prop="perTotalLimit">
                            <div class="d-flex a-center font-12">
                                <el-radio class="mr-0" :label="2">{{ '' }}</el-radio>
                                <div>限制活动期间每人领取</div>
                                <lsInput
                                    v-model="couponForm.perTotalLimit"
                                    :min="1"
                                    :max="999"
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
                <el-form-item label="领取方式：">
                    <el-radio-group v-model="couponForm.receiveType" :disabled="pageType == 'lookInfo'" @change="changeRadio">
                        <div class="d-flex a-center font-12">
                            <el-radio :label="0" class="mr-0">{{ '' }}</el-radio>
                            <div>免费领取（不需要任何条件即可领取优惠券）</div>
                        </div>
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
                        <el-tooltip placement="right">
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
                    </el-form-item>
                    <el-form-item v-if="couponForm.designatedUser == 1" class="mt-10">
                        <el-input
                            key="mobileList"
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
                    <div class="d-flex a-end">
                        <imgCenter v-model="couponForm.pic" :disabled="pageType == 'lookInfo'" @input="$refs.form.validateField('pic')"></imgCenter>
                        <span class="mx-20 text-999">建议尺寸：160*160px</span>
                    </div>
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
                                class="mt-20 text-right"
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
                        <span :class="couponForm.status == -2 ? 'status-veto' : couponForm.status == 1 ? 'status-wait' : 'status-done'">
                            {{ couponForm.status | getLabelText(couponStatus) }}
                        </span>
                    </el-form-item>

                    <el-divider />
                    <!-- 这是分割线 -->
                    <div class="form-title">领取信息</div>
                    <el-form-item label-width="0"><receiveInfo :coupon-id="couponForm.id" @statusChange="getcounPage" /></el-form-item>
                </template>

                <Sticky>
                    <div class="font-0">
                        <el-button size="small" @click="back">取消</el-button>
                        <ls-button v-if="pageType != 'lookInfo'" type="primary" size="small" :async-function="onSubmit">新增</ls-button>
                    </div>
                </Sticky>
            </el-form>
        </el-card>
        <dialogSpuGoods ref="dialogSpuGoods" :shop-list-ids="couponForm.selectShopId" :coupon-id.sync="couponForm.id" @sumbitTable="storeSumbit" />
    </section>
</template>

<script>
import tableGoods from './components/couponGoodsTable'
import dialogSpuGoods from './components/dialogSpuGoods'
import receiveInfo from './components/receiveInfo'
import { couponApi } from '@/api/ModuleMarketing.js'
import moment from 'moment'
import clipboard from '@/utils/clipboard' // 复制功能
export default {
    components: { dialogSpuGoods, tableGoods, receiveInfo },
    data() {
        function parseTime(time) {
            return moment(time).valueOf()
        }
        // 使用优惠券校验
        var useTimeValidate = (rule, value, callback) => {
            if (this.tempForm.useTimeType == 0 && !this.couponForm.useStartTime) {
                callback(new Error('使用时间不能为空'))
            }
            if (this.tempForm.useTimeType == 0 && parseTime(this.couponForm.receiveEndTime) > parseTime(this.couponForm.useEndTime)) {
                callback(new Error('领取结束时间不能晚于使用结束时间'))
            }
            callback()
        }

        // 门槛优惠券校验
        var minPointValidate = (rule, value, callback) => {
            setTimeout(() => {
                //fixBug 25729 触发校验的速度快于this.tempForm.pointType改变速度,故加setTimeout
                if (this.tempForm.pointType == 0 && !this.couponForm.minPoint) {
                    callback(new Error('优惠券门槛不能为空'))
                }
                callback()
            }, 150)
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
            if (!this.couponForm.amount) {
                callback(new Error('优惠金额不能为0'))
            }
            if (this.tempForm.pointType == 0 && Number(this.couponForm.amount) > Number(this.couponForm.minPoint)) {
                callback(new Error('优惠金额不能大于门槛金额'))
            }
            callback()
        }
        return {
            pickerMinDate: '',
            // 限制只能选择三十天的时间段
            pickerOptions: {
                disabledDate: (time) => {
                    const minTime = new Date().getTime() - 24 * 3600 * 1000
                    const maxTime = new Date().getTime() + 30 * 24 * 3600 * 1000
                    return time.getTime() > maxTime || time.getTime() < minTime
                }
            },
            usePickerOptions: {
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
                amount: undefined, // 优惠券面额(备注：要用undefined才能一开始显示placeholder内容)
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
                minPoint: undefined, // 使用门槛，0.00为无门槛(备注：要用undefined才能一开始显示placeholder内容)
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
                // {
                //     value: 1,
                //     label: '手机号码'
                // },
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
                }
                // {
                //     value: 6,
                //     label: '店铺新用户'
                // },
                // {
                //     value: 7,
                //     label: '店铺老用户'
                // }
            ],
            value: '',
            rules: {
                title: { required: true, message: '优惠券不能为空', trigger: 'blur' },
                count: [
                    { required: true, message: '发送数量不能为空', trigger: 'blur' }
                    // {validator:validatePayPct, trigger: 'blur'}
                ],
                pic: [{ required: true, message: '优惠券封面图不能为空', trigger: 'blur' }],
                receiveStartTime: [{ required: true, message: '领取时间不能为空', trigger: 'blur' }],
                useStartTime: [{ validator: useTimeValidate, trigger: 'blur' }],
                minPoint: [{ validator: minPointValidate, trigger: 'blur' }],
                perTotalLimit: [{ validator: perTotalLimitValidate, trigger: 'blur' }],
                perDayLimit: [{ validator: perDayLimitValidate, trigger: 'blur' }],
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
            imageUrl: '',
            couponUrl: ''
        }
    },
    watch: {
        //fixBug 25729
        'tempForm.pointType': {
            handler(newVal) {
                if (newVal == 1) {
                    this.couponForm.minPoint = 0
                    this.$refs.form.clearValidate('minPoint') //切换优惠券门槛时清空门槛金额输入框的必填验证错误提示
                    this.$forceUpdate()
                }
                this.$refs.form.validateField('amount') //校验优惠金额
            }
        },
        'tempForm.LimitType': {
            handler(newVal) {
                if (newVal == 0) {
                    this.couponForm.perDayLimit = 1
                    this.couponForm.perTotalLimit = 1
                }
                if (newVal == 1) {
                    this.couponForm.perTotalLimit = 1
                }
                if (newVal == 2) {
                    this.couponForm.perDayLimit = 1
                }
            }
        },
        'couponForm.pic'(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs.form.validateField('pic')
                })
            }
        },
        // 监听设置优惠门槛
        'couponForm.minPoint'(nP) {
            if (this.tempForm.pointType == 0) {
                this.$nextTick(() => {
                    //校验设置优惠金额
                    this.$refs.form.validateField('amount')
                })
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        if (to.query.couponType == 'lookInfo') {
            to.meta.title = '查看平台优惠券' //更改tab页同步标题
        } else {
            to.meta.title = '新增平台优惠券' //更改tab页同步标题
        }
        next()
    },
    created() {
        console.log(this.$route, 'router')
        if (this.$route.query.couponType) {
            this.pageType = this.$route.query.couponType
        }
        if (this.$route.query.couponId) {
            this.couponId = this.$route.query.couponId
            this.getCouponDetail(this.couponId)
        }
        if (this.pageType === 'lookInfo') {
            this.couponUrl = `${this.$config.shareUrl}/pages/webview/shareUrlRedirect?detailsType=coupon&id=${this.couponId}`
        }
    },
    methods: {
        handleCopy(text, event) {
            clipboard(text, event)
        },
        // 领取方式改变
        changeRadio(e) {},
        resetInput(e) {
            if (e == 1) {
                this.tempForm.useTime = ''
                this.$refs.form.validateField('useStartTime')
            } else {
                this.couponForm.withinDay = 0
                this.couponForm.useDayLater = 0
            }
        },
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
            return new Promise((resolve) => {
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

                        couponApi
                            .saveCoupon(formParam)
                            .then((res) => {
                                if (res.code == 1) {
                                    this.$router.back()
                                }
                            })
                            .finally((_) => {
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },

        // 返回
        back() {
            this.$router.back()
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>
