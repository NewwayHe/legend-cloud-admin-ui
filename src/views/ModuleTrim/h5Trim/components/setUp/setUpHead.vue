<template>
    <!-- /*
     * @Descripttion:(功能组件：头部)
    */ -->
    <div>
        <div
            v-if="(value.category == 'INDEX' || value.category == 'INDEX-T') && value.head.backgroundImg && !showBanner"
            class="position-absolute zindex-99 overflow-h"
            style="width: 375px; left: 20px; margin-top: 0px; top: 91px"
            :style="{
                height: `${
                    (platform != 'H5' ? 20 : 0) +
                    44 +
                    (value.head.title.name ? paddingBottom : 0) +
                    (floors.type == 'searchAndTab' && searchTabData.tabsShow ? 40 : 0)
                }px`
            }"
        >
            <div class="w-100 position-absolute top-0 right-0 font-0">
                <img class="w-100 h-auto" :src="$photoServer + value.head.backgroundImg" alt="" />
            </div>
        </div>

        <!-- 手机状态栏 -->
        <img
            v-if="platform != 'H5'"
            class="position-absolute zindex-109"
            :class="[value.category == 'POSTER' || value.category == 'POSTER-T' ? 'bg-white' : '']"
            style="width: 375px; top: 91px; left: 21px; height: 20px"
            :style="{ background: floors.type != 'none' ? background : '' }"
            :src="require(`@/assets/images/head-stausBar${showBanner ? '' : '1'}.png`)"
            alt=""
        />
        <!-- 微信的胶囊 -->
        <img
            v-if="platform == 'MP'"
            class="position-absolute zindex-109"
            style="height: 32 px; width: 87px; top: 117px; right: 34px"
            :src="require(`@/assets/images/head-capsule.png`)"
            alt=""
        />

        <template v-if="value.category == 'INDEX' || value.category == 'INDEX-T'">
            <!-- 搜索+轮播图 -->
            <div
                v-if="floors.type == 'searchAndBanner' || floors.type == 'searchAndTab'"
                class="position-absolute zindex-99 translate3d0 h-44p"
                style="width: 375px; left: 21px; margin-top: 0px"
                :style="{
                    top: platform != 'H5' ? '111px' : '91px'
                }"
                @click.stop="changeFloors('set')"
            >
                <div
                    class="h-100 w-100 content-box"
                    :style="{
                        color: floors.color || '#ffffff',
                        background: background,
                        paddingBottom: floors.title.name ? `${paddingBottom}px` : ''
                    }"
                >
                    <div class="flex-between h-100 w-100 px-10">
                        <div v-if="floors.locationAndLogo && floors.locationAndLogo.flag == 1" class="mr-10">
                            广东
                            <i class="el-icon-arrow-down v-bottom ml-5" />
                        </div>
                        <div v-if="floors.locationAndLogo && floors.locationAndLogo.flag == 2" class="mr-10" style="height: 28px">
                            <ls-image
                                :src="floors.locationAndLogo.logo"
                                :options="{ h: '100%', w: floors.locationAndLogo.logoWidth, br: floors.locationAndLogo.logoBorderRadius }"
                                :is-preview="false"
                            ></ls-image>
                        </div>
                        <div ref="midCon" class="flex-1 h-100 position-relative flex-start">
                            <div
                                v-if="floors.title.name"
                                class="pl-10 line-clamp1"
                                :style="{
                                    fontSize: floors.title.size + 'px',
                                    opacity: midConOpacity,
                                    fontWeight: floors.title.fontWeight ? 'bold' : 'unset'
                                }"
                            >
                                {{ floors.title.name }}
                            </div>
                            <div
                                class="rounded-15 text-bbb px-10 flex-start zindex-2"
                                :class="[floors.title.name ? 'position-absolute' : 'w-100']"
                                style="height: 28px"
                                :style="{
                                    backgroundColor: floors.seachColor
                                        ? floors.seachColor
                                        : floors.backgroundColor == '#FFFFFF' || !floors.backgroundColor
                                        ? '#f6f7f8'
                                        : '#ffffff',
                                    left: floors.title.name
                                        ? `${-(midConInfo.offsetLeft - 10) + (midConInfo.offsetLeft - 10) * (1 - midConOpacity)}px`
                                        : '',
                                    bottom: floors.title.name ? `${-30 + 38 * (1 - midConOpacity)}px` : '',
                                    width: floors.title.name
                                        ? midConInfo.offsetWidth
                                            ? `${midConInfo.offsetWidth + (355 - midConInfo.offsetWidth) * midConOpacity}px`
                                            : '355px'
                                        : ''
                                }"
                            >
                                <!-- '-50px':'', -->
                                <i class="el-icon-search v-bottom mr-5 font-16 ml-10" />
                                搜索商品
                            </div>
                        </div>
                        <div v-if="floors.showMessage" class="flex-col-center ml-10">
                            <i class="el-icon-chat-dot-round v-bottom font-20" />
                            <span class="line-h" style="transform: scale(0.7)">消息</span>
                        </div>
                        <div v-if="platform == 'MP'" class="h-100" style="width: 100px" />
                    </div>
                </div>

                <!-- 搜索 + 标签栏 -->
                <div v-if="floors.type == 'searchAndTab'" class="w-100 position-relative">
                    <div
                        v-if="searchTabData.tabsShow"
                        class="flex-start overflow-h"
                        style="height: 40px"
                        :style="{
                            color: searchTabData.tabNoCurColor,
                            backgroundColor: tabBackground,
                            '--curTabColor': curTabColor
                        }"
                    >
                        <!-- :style="{
						    borderRight: `${
						        searchTabData.tabList && searchTabData.tabList.length != 1 && index != searchTabData.tabList.length - 1 && searchTabData.assistLine
						            ? 1
						            : 0
						    }px solid ${searchTabData.assistLineColor}`,
						}" -->
                        <div class="h-100 font-14 overflow-auto flex-1 flex-start scrollbar-none">
                            <div
                                v-for="(item, index) in searchTabData.tabList"
                                :key="index"
                                :ref="'tabListItem' + index"
                                class="px-10 text-nowrap"
                                @click="changeTab(index)"
                            >
                                <span
                                    :class="[{ 'tab-pills': item.isSelect && searchTabData.tabsType == 'pills' }]"
                                    :style="{
                                        color: item.isSelect ? curTabColor : '',
                                        borderBottom: `${item.isSelect && searchTabData.tabsType == 'line' ? 2 : 0}px solid ${
                                            item.isSelect ? curTabColor : ''
                                        }`
                                    }"
                                >
                                    {{ item.title }}
                                </span>
                            </div>
                        </div>
                        <div v-if="searchTabData.showCategoryIcon || searchTabData.showCategoryText" class="flex-end ml-10">
                            <div v-if="searchTabData.showCategoryIcon" class="iconfont icon-fenlei4 mr-5"></div>
                            <div v-if="searchTabData.showCategoryText" class="mr-5">分类</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="value.category == 'POSTER' || value.category == 'POSTER-T'">
            <div
                v-if="platform == 'MP'"
                class="position-absolute zindex-99 translate3d0 h-44p bg-white"
                style="width: 375px; left: 20px; margin-top: 0px; top: 110px"
            >
                <div class="h-100 w-100 flex-start">
                    <span class="flex-1 font-16 font-weight pl-10">{{ value.name }}</span>
                    <span class="h-100 w-100p"></span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
// JS方法
import eventBus from '@/store/eventBus.js'
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
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        platform: {
            type: String,
            default: ''
        },
        scrollTop: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            tabOpacity: 0, // 控制头部背景透明度的变量，默认是0(scrollTop==0时)，最大是1(scrollTop>=320时)
            currentIndex: 0,
            midConInfo: {},
            midConOpacity: 1 // 控制搜索框滚动的变量，默认是1(scrollTop==0时)，最少是0(scrollTop>=40时)
        }
    },
    computed: {
        backgroundColor() {
            // 这个值原来就是this.floors.backgroundColor值来的,但当该值为空的时候，在搜索栏为【搜索 + 标签栏】的情况下，由于搜索栏背景色为空，屏幕向下滚动时，在搜索栏底会见到滚动的内容，这样与手机端就不一致，故要设一个不透明的背景色挡住滚动内容
            return this.floors.backgroundColor || (!this.showBanner && this.$utils.color.getHexColor(this.value.head.backgroundColor)) || ''
            // return this.floors.backgroundColor||(!this.showBanner&&this.$utils.color.getHexColor(this.value.backgroundColor))||'#ffffff'
        },
        themesRGBA() {
            let tempColor = this.floors.themeColor ? this.value.themeColor : this.backgroundColor
            const color = this.$utils.color.colorRgb(tempColor)
            return tempColor ? `rgba(${color.r}, ${color.g},${color.b},${this.tabOpacity})` : ''
        },
        background() {
            return this.floors.themeColor
                ? this.floors.bgGradualChange
                    ? this.themesRGBA
                    : this.value.themeColor
                : this.floors.bgGradualChange
                ? this.themesRGBA
                : this.backgroundColor
        },
        searchTabData() {
            return this.value.head.data.searchAndTabData
        },
        curTabColor() {
            return this.searchTabData.tabCurThemeColor ? this.value.themeColor : this.searchTabData.tabCurColor
        },
        tabThemesRGBA() {
            let tempColor = this.searchTabData?.tabBgThemeColor
                ? this.value.themeColor
                : this.$utils.color.getHexColor(this.searchTabData?.tabBgColor)
            const color = this.$utils.color.colorRgb(tempColor)
            return tempColor ? `rgba(${color.r}, ${color.g},${color.b},${this.tabOpacity})` : ''
        },
        tabBackground() {
            let bgGradualChange = this.searchTabData?.bgGradualChange
            let themeColor = this.searchTabData?.tabBgThemeColor
            return themeColor
                ? bgGradualChange
                    ? this.tabThemesRGBA
                    : this.value.themeColor
                : bgGradualChange
                ? this.tabThemesRGBA
                : this.searchTabData?.tabBgColor
        },
        // 如果是后台选择了[搜索+轮播图]且开了轮播图开关且已经上传了轮播图
        showBanner() {
            return (
                this.value.head &&
                this.value.head.type == 'searchAndBanner' &&
                this.value.head.data.searchAndBannerData.showBanner &&
                this.value.head.data.searchAndBannerData.banner.imgList.length
            )
        },
        paddingBottom() {
            return 40 - 40 * (1 - this.midConOpacity)
        }
    },
    watch: {
        scrollTop(newValur, oldValue) {
            if (newValur >= 320) {
                this.tabOpacity = 1
            } else {
                this.tabOpacity = (newValur / 320).toFixed(2)
            }

            if (newValur == 0) {
                this.midConOpacity = 1
            } else if (newValur >= 40) {
                this.midConOpacity = 0
            } else {
                this.midConOpacity = ((40 - newValur) / 40).toFixed(2)
            }
        },
        'value.head': {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.$nextTick(() => {
                        // 方法一
                        this.getMidCon()

                        // 方法二
                        let tabList = newValue.data.searchAndTabData.tabList
                        if (tabList && tabList.length) {
                            let index = tabList.findIndex((item, index) => {
                                return item.isSelect
                            }) //找出是要正在选中的那一个元素的index
                            this.currentIndex = index
                            let { id } = tabList[index].url
                            if (this.value.head.data.searchAndTabData.linkType == 'poster') {
                                eventBus.$emit(
                                    'iframeUrl',
                                    id ? `${this.$config.shareUrl}/ModuleCommon/poster/poster?templateId=${id}&device=mobile` : ''
                                )
                            }

                            // 让选中的元素居中
                            if (
                                this.$refs['tabListItem' + index] &&
                                this.$refs['tabListItem' + index][0] &&
                                this.$refs['tabListItem' + index][0].scrollIntoView()
                            ) {
                                this.$nextTick(() => {
                                    this.$refs['tabListItem' + index][0].scrollIntoView({ inline: 'center', behavior: 'smooth' })
                                })
                            }
                        }
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    destroyed() {},
    methods: {
        // 获取搜索框的宽度和位置信息
        getMidCon() {
            if (this.$refs.midCon) {
                // console.log(111,this.$refs.midCon.offsetLeft)
                // console.log(222,this.$refs.midCon.offsetWidth)
                this.$set(this.midConInfo, 'offsetLeft', this.$refs.midCon.offsetLeft) //搜索框的居左位置
                this.$set(this.midConInfo, 'offsetWidth', this.$refs.midCon.offsetWidth) //搜索框的总宽度
            }
        },
        changeFloors(flag) {
            this.$emit('changeFloors', flag)
        },
        changeTab(index) {
            if (this.currentIndex == index) return
            for (var i = 0; i < this.value.head.data.searchAndTabData.tabList.length; i++) {
                this.value.head.data.searchAndTabData.tabList[i].isSelect = false
            }
            this.value.head.data.searchAndTabData.tabList[index].isSelect = true
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-pills {
    background-color: var(--curTabColor);
    border-radius: 15px;
    padding: 3px 10px;
    color: #ffffff !important;
}
</style>
