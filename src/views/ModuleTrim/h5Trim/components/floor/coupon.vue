<template>
    <!-- /*
     * @Descripttion:(营销组件：优惠券)：coupon
    */ -->
    <div
        class="overflow-h"
        :class="[{ 'mx-10 rounded-10': floors.borderRadius }]"
        :style="{ backgroundColor: backgroundColor, '--bgImageColor': backgroundColor }"
    >
        <div class="h-44p font-14 p-10 W-100" :class="[floors.titleType == 1 ? 'flex-start' : 'flex-center']">
            <div v-if="floors.titleType == 3" class="flex-1 px-10">
                <div class="h-0 w-100" :style="{ borderTop: `1px solid ${floors.data.title.borderColor}` }"></div>
            </div>
            <span
                v-if="floors.showIcon == 'block'"
                class="d-inline-block mr-5"
                style="width: 4px"
                :style="{
                    backgroundColor: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color,
                    height: `${floors.data.title.fontSize + 2}px`
                }"
            ></span>
            <img
                v-if="floors && floors.iconImg && floors.showIcon == 'diy'"
                class="mr-5"
                style="width: 20px; height: 20px"
                :src="$photoServer + floors.iconImg"
                alt=""
            />
            <div
                class="letter-sp2"
                :style="{
                    fontSize: `${floors.data.title.fontSize}px`,
                    fontWeight: floors.data.title.fontWeight ? 'bold' : 'unset',
                    color: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color
                }"
            >
                <span>{{ floors.data.title.title }}</span>
            </div>
            <div v-if="floors.titleType == 3" class="flex-1 px-10">
                <div class="h-0 w-100" :style="{ borderTop: `1px solid ${floors.data.title.borderColor}` }"></div>
            </div>
            <div
                v-if="floors.titleType == 1"
                class="flex-1 px-10 line-clamp1"
                :style="{
                    fontSize: `${floors.data.seTitle.fontSize}px`,
                    fontWeight: floors.data.seTitle.fontWeight ? 'bold' : 'unset',
                    color: floors.data.seTitle.themeColor ? parmas.themeColor : floors.data.seTitle.color
                }"
            >
                <span>{{ floors.data.seTitle.title }}</span>
            </div>
            <div
                v-if="floors.titleType == 1"
                :style="{
                    fontSize: `${floors.data.more.fontSize}px`,
                    fontWeight: floors.data.more.fontWeight ? 'bold' : 'unset',
                    color: floors.data.more.themeColor ? parmas.themeColor : floors.data.more.color
                }"
            >
                <span>{{ floors.data.more.title }}</span>
                <i v-if="floors.data.more.title" class="el-icon-arrow-right" />
            </div>
            <!-- 微信的胶囊 -->
            <div v-if="parmas.head.type == 'none' && isFirstFloor && platform == 'MP'" style="height: 44 px; width: 100px"></div>
        </div>

        <div class="flex-start w-100 overflow-h pb-10">
            <div v-for="(item, index) in list" :key="index" class="ml-10 position-relative">
                <div class="flex-start overflow-h bg-white" :class="[{ 'rounded-10': floors.listType != 1 }]" :style="{ color: parmas.themeColor }">
                    <!-- 列表样式：简单 -->
                    <template v-if="floors.listType == 1">
                        <div
                            class="flex-col-center px-15 py-10 overflow-h"
                            style="width: 150px; height: 90px"
                            :style="{ backgroundColor: themesRGBA02 }"
                        >
                            <div class="font-14 font-weight line-h">
                                <span class="v-super">￥</span>
                                <span class="font-28">{{ item.amount }}</span>
                            </div>
                            <div
                                class="mt-3 line-h"
                                :class="[item.shopName ? 'py-3 px-15 rounded-50' : '']"
                                :style="{
                                    backgroundColor: item.shopName ? parmas.themeColor : '',
                                    color: item.shopName ? '#ffffff' : parmas.themeColor
                                }"
                            >
                                {{ item.minPoint ? `满${item.minPoint}可用` : '无门槛' }}
                            </div>
                            <div v-if="item.shopName" class="line-clamp1 mt-5 text-center">{{ item.shopName }}</div>
                        </div>
                    </template>
                    <!-- 列表样式：复杂 -->
                    <template v-else>
                        <div class="bg-white flex-col-start px-15 py-10 overflow-h line-h" style="min-width: 165px; height: 100px">
                            <template v-if="!item.shopName">
                                <div class="d-flex a-end">
                                    <span class="font-14" style="padding-bottom: 2px">￥</span>
                                    <span class="font-22 font-weight">{{ item.amount }}</span>
                                    <span
                                        class="rounded-4 py-3 px-5 ml-5"
                                        :style="{ backgroundColor: themesRGBA01, border: `1px solid ${themesRGBA03}`, 'white-space': 'nowrap' }"
                                    >
                                        {{ item.minPoint ? '满减优惠券' : '无门槛' }}
                                    </span>
                                </div>
                                <div class="mt-5">满{{ item.minPoint }}可用</div>
                            </template>
                            <div class="text-333" :class="[{ 'mt-15': !item.shopName }]">
                                {{
                                    item.useType == 0
                                        ? '全部商品可用'
                                        : item.useType == 1
                                        ? '部分店铺参与'
                                        : item.useType == -1
                                        ? '部分店铺不参与'
                                        : ''
                                }}
                            </div>
                            <div class="text-999 mt-5 font-10 bg-f5 rounded" style="padding: 4px">拼团及特殊商品除外</div>
                            <div v-if="item.shopName" class="line-clamp1 mt-15 text-999 font-12">
                                <span class="iconfont icon-dianpu mr-5"></span>
                                {{ item.shopName }}
                            </div>
                        </div>
                        <div class="bg-white text-nowrap" style="width: 100px; height: 100px">
                            <!-- 平台优惠券 -->
                            <img v-if="!item.shopName" class="w-100 h-100 p-10" :src="$photoServer + item.pic" alt="" />
                            <!-- 店铺优惠券 -->
                            <div v-else class="w-100 h-100 overflow-h flex-col-center p-10 text-center" :style="{ backgroundColor: themesRGBA02 }">
                                <div class="font-14">
                                    ￥
                                    <span class="font-22 font-weight">{{ item.amount }}</span>
                                </div>
                                <div class="mt-10 line-clamp1">{{ item.minPoint ? '满减优惠券' : '无门槛' }}</div>
                                <div class="mt-5 line-clamp1">满{{ item.minPoint }}可用</div>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- 列表样式：简单 -->
                <template v-if="floors.listType == 1">
                    <div class="dotted-line-y-20r position-absolute h-100" style="left: -5px; top: 0"></div>
                    <div class="dotted-line-y-20r position-absolute h-100" style="right: -5px; top: 0"></div>
                </template>
                <!-- 列表样式：复杂 -->
                <template v-else>
                    <!-- 分割线 -->
                    <div
                        class="position-absolute"
                        style="width: 2px; height: 100px; right: 100px; top: 0"
                        :style="{ borderRight: `1px dashed ${backgroundColor}` }"
                    ></div>
                    <!-- 圆球 -->
                    <div
                        class="position-absolute rounded-circle"
                        style="width: 12px; height: 12px; right: 95px; top: -6px"
                        :style="{ backgroundColor: backgroundColor }"
                    ></div>
                    <div
                        class="position-absolute rounded-circle"
                        style="width: 12px; height: 12px; right: 95px; bottom: -6px"
                        :style="{ backgroundColor: backgroundColor }"
                    ></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { decorate } from '@/api/ModuleTrim'
export default {
    components: {},
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        platform: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            apiParmas: {
                //查询分组接口时需要传入的参数
                shopProviderFlag: '', //礼券提供方是否为店铺,1:店铺，0:平台，'':全部
                name: '', //优惠券名称(搜索专用)
                pageSize: 10, //每页大小，默认每页大小10条记录
                shopId: '', //店铺Id
                status: 1, //状态: -2:已删除, -1：已失效, 0：未开始, 1：进行中, 2：已暂停, 3：已结束
                useType: '' //优惠券使用商品类型：0全场通用，1指定商品使用，-1排除商品使用
            },
            list: []
        }
    },
    computed: {
        isFirstFloor() {
            //如果菜单组件是第一层，在小程序时加入胶囊点占符
            return this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid ? true : false
        },
        backgroundColor() {
            return this.floors.themeColor ? this.parmas.themeColor : this.floors.backgroundColor
        },
        themesRGBA03() {
            const color = this.$utils.color.colorRgb(this.parmas.themeColor)
            return `rgba(${color.r}, ${color.g},${color.b},.3)`
        },
        themesRGBA02() {
            const color = this.$utils.color.colorRgb(this.parmas.themeColor)
            return `rgba(${color.r}, ${color.g},${color.b},.2)`
        },
        themesRGBA01() {
            const color = this.$utils.color.colorRgb(this.parmas.themeColor)
            return `rgba(${color.r}, ${color.g},${color.b},.1)`
        }
    },
    watch: {},
    mounted() {
        this.getData()
    },
    destroyed() {},
    methods: {
        getData() {
            decorate
                .couponReceivable(this.apiParmas)
                .then((res) => {
                    if (res.code) {
                        this.list = res?.data?.resultList || []
                    }
                })
                .finally(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
/* 代替border:dotted的点状线(Y轴方向)*/
.dotted-line-y-20r {
    width: 10px;
    background-image: radial-gradient(circle closest-side, var(--bgImageColor) 3px, transparent 3px);
    background-size: 100% 10px;
}
</style>
