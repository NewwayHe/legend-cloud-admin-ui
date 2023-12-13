<!-- /*
 * @Descripttion:PC装修新增页面
*/ -->
<template>
    <div class="w-100 h-100 font-12">
        <div class="w-100" style="height: 63px">
            <!-- bg-menu -->
            <div
                class="position-fixed top-0 left-0 w-100 flex-end zindex-109 text-nowrap bg-fixed-menu"
                style="height: 63px"
                :style="{ background: parmas.themeColor }"
            >
                <div ref="platform" class="platform flex-1 flex-center font-14">
                    <el-button type="text" :class="{ curPlatform: platform == 'APP' }" @click="platform = 'APP'">APP端</el-button>
                    <el-button type="text" :class="{ curPlatform: platform == 'MP' }" @click="platform = 'MP'">小程序端</el-button>
                    <el-button type="text" :class="{ curPlatform: platform == 'H5' }" @click="platform = 'H5'">H5端</el-button>
                    <div class="bg-menu-triangle" :style="platformStyle"></div>
                </div>
                <div class="pr-20 flex-end" style="width: 480px; min-width: 380px">
                    <span class="flex-1 overflow-h mx-20 text-white text-right hover-scale1-2" @click="$refs.dialog.showDialog()">
                        <span class="line-clamp1">
                            <i class="el-icon-s-home font-18" />
                            页面名称{{ decoratePageDTO.name ? '：' + decoratePageDTO.name : '' }}
                        </span>
                    </span>
                    <el-button plain size="small" @click.stop="$router.push({ name: 'mbTrimIndex', params: { category: decoratePageDTO.category } })">
                        返回
                    </el-button>
                    <el-button v-ls-loading plain size="small" @click.stop="confirm('save')">保存</el-button>
                    <el-button
                        v-if="decoratePageDTO.category == 'INDEX' || decoratePageDTO.category == 'POSTER' || isUser"
                        v-ls-loading
                        plain
                        size="small"
                        @click.stop="confirm('release')"
                    >
                        发布
                    </el-button>
                </div>
            </div>
        </div>

        <div class="w-100 position-relative">
            <!-- 装修窗口 -->
            <div class="flex-1 flex-center position-relative" style="margin-right: 480px" :style="{ marginLeft: isWideScreen ? '150px' : '' }">
                <div
                    class="position-absolute right-0 top-0 text-white m-10 flex-col-end cursor-pointer zindex-2"
                    :style="{ '--setingbutbackgroundcolor': themesRGBA05, '--themecolor': parmas.themeColor }"
                >
                    <div class="seting-but" :style="{ backgroundColor: ctrlType == 'set' ? parmas.themeColor : '' }" @click="changeFloors('set')">
                        <div style="width: 12px">
                            <i class="el-icon-setting" />
                            基本配置
                        </div>
                    </div>
                    <div
                        v-if="searchAndTabMode"
                        class="seting-but"
                        :style="{ backgroundColor: ctrlType == 'setUp' ? parmas.themeColor : '' }"
                        @click="changeFloors('setUp')"
                    >
                        <div style="width: 12px">
                            <i class="el-icon-set-up" />
                            功能配置
                        </div>
                    </div>
                    <div
                        v-show="!isWideScreen && searchAndTabMode"
                        class="seting-but"
                        :style="{ backgroundColor: ctrlType == 'add' ? parmas.themeColor : '' }"
                        @click="changeFloors('add')"
                    >
                        <div style="width: 12px">
                            <i class="el-icon-circle-plus" />
                            添加楼层
                        </div>
                    </div>
                    <div
                        v-if="searchAndTabMode"
                        class="seting-but"
                        :style="{ backgroundColor: ctrlType == 'man' ? parmas.themeColor : '' }"
                        @click="changeFloors('man')"
                    >
                        <div style="width: 12px">
                            <i class="el-icon-s-tools" />
                            组件管理
                        </div>
                    </div>
                    <div class="scale-but" :style="{ backgroundColor: iphoneScale == '1.0' ? themesRGBA05 : '#999999' }" @click="iphoneScale = '1.0'">
                        大
                    </div>
                    <div class="scale-but" :style="{ backgroundColor: iphoneScale == '0.9' ? themesRGBA05 : '#999999' }" @click="iphoneScale = '0.9'">
                        中
                    </div>
                    <div class="scale-but" :style="{ backgroundColor: iphoneScale == '0.8' ? themesRGBA05 : '#999999' }" @click="iphoneScale = '0.8'">
                        小
                    </div>
                </div>
                <iphone ref="iphone" class="mt-10" :scale="iphoneScale" :background-color="parmas.backgroundColor" @scroll="onScroll">
                    <slot slot="head">
                        <!-- 头部 -->
                        <setUpHead v-model="parmas" :floors="parmas.head" :platform="platform" :scroll-top="scrollTop" @changeFloors="changeFloors" />
                        <!-- 悬浮按钮 -->
                        <suspendBut :floors="parmas.suspendBut" :parmas="parmas" :platform="platform" @changeFloors="changeFloors" />
                    </slot>
                    <template v-slot:screen="{ height }">
                        <!-- 背景 -->
                        <div v-if="parmas.backgroundImg && searchAndTabMode" class="w-100 position-absolute top-0 right-0 font-0">
                            <img class="w-100 h-auto" :src="$photoServer + parmas.backgroundImg" alt="" />
                        </div>
                        <!-- 手机状态栏的占位符 -->
                        <div v-if="platform != 'H5'" class="w-100" style="height: 20px" />
                        <!-- 海报页面上小程序上的占位符 -->
                        <div
                            v-if="(decoratePageDTO.category == 'POSTER' || decoratePageDTO.category == 'POSTER-T') && platform == 'MP'"
                            class="w-100 h-44p"
                        />

                        <!-- 搜索+轮播图 -->
                        <div
                            v-if="
                                parmas.head.type == 'searchAndBanner' &&
                                (decoratePageDTO.category == 'INDEX' || decoratePageDTO.category == 'INDEX-T')
                            "
                            class="cursor-pointer overflow-h"
                            :style="{ marginTop: !selectTabFirst ? '-20px' : '', paddingTop: !selectTabFirst ? '20px' : '' }"
                            @click.stop="changeFloors('set')"
                        >
                            <bannerHeadSearch
                                ref="bannerHeadSearch"
                                :floors="parmas.head.data.searchAndBannerData.banner"
                                :parmas="parmas"
                                :platform="platform"
                            />
                        </div>
                        <div v-if="searchAndTabMode" class="position-relative" :style="{ marginTop: `${conHeight}px` }">
                            <vuedraggable
                                v-model="parmas.floors"
                                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
                            >
                                <transition-group>
                                    <template v-for="(item, index) in parmas.floors">
                                        <div :key="item.uuid">
                                            <maskLlayer
                                                :key="item.uuid"
                                                :floors="item"
                                                :is-wide-screen="isWideScreen"
                                                @dealFloors="dealFloors($event, index)"
                                            >
                                                <component
                                                    :is="item.type"
                                                    :key="item.uuid"
                                                    :ref="item.uuid"
                                                    :class="[{ 'current-floors': item.uuid == currentUUid && isCtrlTypeEdit }]"
                                                    :floors="item"
                                                    :parmas="parmas"
                                                    :platform="platform"
                                                />
                                            </maskLlayer>
                                        </div>
                                    </template>
                                </transition-group>
                            </vuedraggable>
                        </div>
                        <!-- 搜索+标签栏 -->
                        <div
                            v-if="
                                parmas.head.type == 'searchAndTab' && (decoratePageDTO.category == 'INDEX' || decoratePageDTO.category == 'INDEX-T')
                            "
                            :style="{ marginTop: `${conHeight}px` }"
                            class="cursor-pointer overflow-h"
                            @click.stop="changeFloors('set')"
                        >
                            <iframe v-show="iframeUrl" id="iframeId" class="w-100 border-none" :src="iframeUrl" :height="height - 174"></iframe>
                        </div>
                    </template>
                </iphone>
            </div>

            <!-- 左则【添加组件】栏(isWideScreen值为true时才会出现) -->
            <div
                v-if="isWideScreen && searchAndTabMode"
                class="right-edge position-absolute bottom-0 h-100 bg-transparent p-20 overflow-x-h overflow-y-scroll top-0 left-0"
                style="width: 220px; min-width: 200px"
            >
                <addFloors v-model="parmas" :uuid.sync="currentUUid" :is-wide-screen.sync="isWideScreen" :ctrl-type="ctrlType" />
            </div>

            <!-- 右边侧边栏 -->
            <div
                ref="rightEdge"
                class="right-edge position-fixed bottom-0 right-0 shadow-sm p-20 bg-white overflow-x-h overflow-y-scroll zindex-109"
                style="width: 480px; min-width: 380px; top: 63px"
            >
                <setting v-if="ctrlType == 'set'" ref="floorFlag" v-model="parmas" :uuid.sync="currentUUid" @change="changeHead" />
                <setUp v-else-if="ctrlType == 'setUp'" v-model="parmas" :uuid.sync="currentUUid" />
                <addFloors v-else-if="ctrlType == 'add'" v-model="parmas" :uuid.sync="currentUUid" />
                <manFloors v-else-if="ctrlType == 'man'" v-model="parmas" :uuid.sync="currentUUid" @clickFloor="clickFloor" />
                <template v-else>
                    <component
                        :is="currentParmas.type + 'Ctrl'"
                        v-if="currentParmas.type"
                        ref="floorFlag"
                        :key="currentUUid"
                        v-model="currentParmas"
                        :parmas="parmas"
                    />
                </template>
                <!-- 这个是用来演示保存后的封面的，要查看该装修封面的话，可以把下面的打开 -->
                <!-- <img :src="$photoServer + decoratePageDTO.coverPicture" alt="" /> -->
            </div>

            <!-- 链接弹框组件 -->
            <dialogName ref="dialog" v-model="decoratePageDTO.name" @validatePassed="validatePassed" />
            <!-- 如果是新增，则弹出dialog引导设置 -->
            <dialogFirstComeIn ref="dialogFirstComeIn" v-model="parmas" :name.sync="decoratePageDTO.name" />
        </div>
    </div>
</template>
<script>
// JS方法
import { defFloorVal } from './components/defFloorVal.js'
import { throttle } from '@/utils/utils.js'
import eventBus from '@/store/eventBus.js'

// API接口
import { decorate } from '@/api/ModuleTrim'

// VUE功能组件
import vuedraggable from 'vuedraggable'
import iphone from '@/components/iphone'

// 业务组件
import setting from './components/setting.vue'
import setUp from './components/setUp.vue'
import addFloors from './components/addFloors.vue'
import manFloors from './components/manFloors.vue'
import maskLlayer from './components/maskLlayer.vue'
import bannerHeadSearch from './components/setUp/bannerHeadSearch.vue'
import dialogName from '../components/dialogName'
import dialogFirstComeIn from '../components/dialogFirstComeIn'

// 功能组件
import suspendBut from './components/setUp/suspendBut.vue'
import setUpHead from './components/setUp/setUpHead.vue'

// 楼层组件
import banner from './components/floor/banner.vue'
import bannerCtrl from './components/control/bannerCtrl.vue'
import menuTab from './components/floor/menuTab.vue'
import menuTabCtrl from './components/control/menuTabCtrl.vue'
import cube from './components/floor/cube.vue'
import cubeCtrl from './components/control/cubeCtrl.vue'
import navigation from './components/floor/navigation.vue'
import navigationCtrl from './components/control/navigationCtrl.vue'
import navigationTab from './components/floor/navigationTab.vue'
import navigationTabCtrl from './components/control/navigationTabCtrl.vue'
import prodList from './components/floor/prodList.vue'
import prodListCtrl from './components/control/prodListCtrl.vue'
import noticeBar from './components/floor/noticeBar.vue'
import noticeBarCtrl from './components/control/noticeBarCtrl.vue'

// 其它组件
import richText from './components/floor/richText.vue'
import richTextCtrl from './components/control/richTextCtrl.vue'
import assistLine from './components/floor/assistLine.vue'
import assistLineCtrl from './components/control/assistLineCtrl.vue'
import titleTab from './components/floor/titleTab.vue'
import titleTabCtrl from './components/control/titleTabCtrl.vue'

// 营销组件
import coupon from './components/floor/coupon.vue'
import couponCtrl from './components/control/couponCtrl.vue'

export default {
    name: 'MobileTrim',
    components: {
        // VUE功能组件
        vuedraggable,
        iphone,

        // 业务组件
        setting,
        setUp,
        addFloors,
        manFloors,
        maskLlayer,
        bannerHeadSearch,
        dialogName,
        dialogFirstComeIn,

        // 功能组件
        suspendBut,
        setUpHead,

        // 楼层组件
        banner,
        bannerCtrl,
        menuTab,
        menuTabCtrl,
        cube,
        cubeCtrl,
        navigation,
        navigationCtrl,
        navigationTab,
        navigationTabCtrl,
        prodList,
        prodListCtrl,
        noticeBar,
        noticeBarCtrl,

        // 其它组件
        richText,
        richTextCtrl,
        assistLine,
        assistLineCtrl,
        titleTab,
        titleTabCtrl,

        // 营销组件
        coupon,
        couponCtrl
    },
    filters: {},
    data() {
        return {
            decoratePageDTO: {
                category: this.$route.query.category ? this.$route.query.category : 'INDEX', // 页面类型 [INDEX：首页，INDEX-T：首页模板，POSTER：海报页，POSTER-T：海报模板]
                coverPicture: '', // 封面图
                data: this.parmas, // 可编辑的装修数据
                id: this.$route.query.id ? this.$route.query.id : '', // 主键
                name: '', // 页面名称
                source: 'mobile' // 来源[pc：pc端 mobile：移动端]
            },
            parmas: {
                // 要传到服务器的(手机端识别该数据是首页或海报时有用)
                category: this.$route.query.category ? this.$route.query.category : 'INDEX', // 页面类型，这个变量海报页面时用
                name: '', // 页面名称，这个变量海报页面时用于显示头部标题栏用

                themeColor: '#409EFF', // 商城主题色,默认是蓝色
                backgroundColor: '#f5f5f5', // 首页背景色/背景图
                backgroundImg: '', // 首页背景图

                head: {
                    //头部组件
                    type: 'searchAndBanner', //头部组件类型：searchAndBanner：搜索+轮播图，searchAndTitle：搜索+标题栏，searchAndTab：搜索+标签页，none：无
                    themeColor: true, // 是否应用主题颜色(此时backgroundColor将会失效)
                    backgroundColor: '', // 背景颜色
                    backgroundImg: '', // 背景图
                    seachColor: '', // 搜索框颜色
                    bgGradualChange: false, // 背景色渐变
                    color: '#ffffff', // 文字颜色
                    // showLocation: true, // 显示关闭定位
                    locationAndLogo: {
                        flag: 0, //默认显示定位 0为无 1为定位 2为logo
                        logo: '', //logo图标
                        logoWidth: 28, //logo宽度
                        logoBorderRadius: 28 //logo圆角
                    },
                    showMessage: true, // 显示信息
                    title: {
                        name: '', //商城名字
                        size: 18, //字体大小
                        fontWeight: 'bold' //字重
                    },
                    data: {
                        //不同type头部组件的专属数据
                        searchAndBannerData: {
                            showBanner: false, //是否开启轮播图
                            banner: {
                                autoplay: true, //是否自动播放
                                interval: 5000, //自动播放的时间间隔，单位为毫秒
                                loop: true, //是否循环显示
                                indicatorDots: 'default', //指示器：default：默认(条形)，dot：圆点，round：柱状，nav：导航，indexes：数字，none：关闭
                                indicatorThemeColor: true, //指示器采用主题颜色(此时indicatorColor将会失效)
                                indicatorColor: '#333333', //指示器颜色
                                indicatorPosition: 'mid', //指示器位置，left：左、mid：中、right：右，
                                height: 180, //轮播图的高度
                                imgList: [
                                    //轮播图
                                    // {
                                    //     img:'',//图片
                                    //     url:{},//把对应的type的选中的元素对象赋值到该对象中
                                    //     content:'',//当indicatorDots==nav时，可以输入文本内容
                                    // }
                                ]
                            }
                        },
                        searchAndTitleData: {},
                        searchAndTabData: {
                            tabBgThemeColor: false, //tab栏背景颜色采用主题色(这时tabBgColor会失效)
                            tabBgColor: '#fff', //tab栏自定义颜色
                            tabsType: 'pills', //下标样式，pills：胶囊模式，line：下划线模式，none：不显示下标
                            tabCurThemeColor: true, //tab栏选中的字体颜色采用主题色(这时tabCurColor会失效)
                            tabCurColor: '#333333', //tab栏选中的字体颜色
                            tabNoCurColor: '#999999', //tab栏未选中的字体颜色
                            tabsShow: true, //是否显示tab菜单栏。
                            linkType: 'poster', //海报链接的类型
                            bgGradualChange: false, // 背景色渐变
                            showCategoryText: true, //显示文字
                            showCategoryIcon: true, //显示图标
                            tabList: [
                                {
                                    uuid: this.$utils.createUUID(),
                                    isSelect: true,
                                    title: '首页',
                                    type: 'homePage', //首页 不可删除
                                    themeColor: false,
                                    color: '', //字体颜色
                                    url: {} //把对应的type的选中的元素对象赋值到该对象中
                                }
                            ]
                        }
                    }
                },

                floors: [
                    // 楼层配置
                    // this.$utils.object.deepClone(defFloorVal.banner)
                ],
                //功能配置
                suspendBut: {
                    // 悬浮按钮
                    show: false, // 开启悬浮按钮
                    themeColor: false, // 是否应用主题颜色(此时backgroundColor将会失效)
                    backgroundColor: '#ffffff', // 背景颜色
                    position: 'right', //位置：left：左边，right：右边
                    offsetBottom: 30, //距离底部导航栏多少px
                    img: '',
                    url: {}
                }
            },
            currentUUid: '', // 记录当前编辑的楼层的UUid
            ctrlType: 'set', // 右则栏的状态，set：基本配置，setUp：功能配置，add：添加楼层，man：管理组件，其它不是set或add或man的值：编辑(各个)楼层的edit，copy，delete，down，up
            platform: 'APP', //'APP'：APP端，'MP'：小程序端，'H5'：H5端
            iphoneScale: '1.0', // 手机视窗的大小
            isWideScreen: true, //监听PC屏幕是不是宽屏
            scrollTop: 0, //监听屏幕滚动
            isUser: this.$route.query.isUser ? true : '', //如果是点击了【页面模板】或【海报模板】里的【应用】进来的

            // 顶部栏[三端宽度]
            platformWidth: [], //分别为三个按钮的宽度
            platformMove: 0, //移动距离
            platformStyle: {
                //顶部栏三角形样式
                opacity: 0,
                left: 0,
                transfrom: 'translateX(0)',
                transition: 'all ease .4s'
            },
            iframeUrl: ''
        }
    },
    computed: {
        // 编辑当前楼层时临时保存的数据
        currentParmas: {
            get() {
                if (!this.currentUUid) {
                    return {}
                }
                return this.parmas.floors.find((item) => item.uuid == this.currentUUid)
            }
        },
        themesRGBA05() {
            const color = this.$utils.color.colorRgb(this.parmas.themeColor)
            return `rgba(${color.r}, ${color.g},${color.b},.5)`
        },
        isCtrlTypeEdit() {
            //当前左侧侧边栏不是【基本配置】【功能配置】【添加楼层】【组件管理】时，并且有当前currentUUid时，手机屏幕上才显示当前编辑楼层的蓝色边框
            if (this.ctrlType == 'set' || this.ctrlType == 'setUp') {
                // if (this.ctrlType == 'set' || this.ctrlType == 'add' || this.ctrlType == 'man' || this.ctrlType == 'setUp') {
                this.currentUUid = '' //如果右侧侧边栏不是编辑中，则清空currentUUid，不然点击添加楼层时，生成的新楼层位置会在该currentUUid值的楼层以下
            }
            return this.ctrlType != 'set' && this.ctrlType != 'setUp' ? true : false
            // return this.ctrlType != 'set' && this.ctrlType != 'add' && this.ctrlType != 'man' && this.ctrlType != 'setUp' ? true : false;
        },
        searchAndTabMode() {
            // 用于判断头部组件是否开启了 搜索+标签页 如果开启了，且选择了第一个标签（默认首页），则显示组件楼层
            return (
                !['searchAndTab'].includes(this.parmas.head.type) ||
                this.parmas.head.data.searchAndTabData.tabList.some((item) => item.isSelect && item.type == 'homePage')
            )
        },
        selectTabFirst() {
            // 用于判断是否选中了 搜索+标签页 的首页
            return (
                ['searchAndTab'].includes(this.parmas.head.type) &&
                this.parmas.head.data.searchAndTabData.tabList.some((item) => item.isSelect && item.type == 'homePage')
            )
        },

        // 如果是后台选择了[搜索+轮播图]且开了轮播图开关且已经上传了轮播图
        showBanner() {
            return (
                this.parmas.head &&
                this.parmas.head.type == 'searchAndBanner' &&
                this.parmas.head.data.searchAndBannerData.showBanner &&
                this.parmas.head.data.searchAndBannerData.banner.imgList.length
            )
        },

        // 用来处理各种情况下的占位符
        conHeight() {
            let height = 0
            // setUpHead头部组件高度的占位符(注意：这个如果手机端是写在setUpHead里的话，由于手机端是用了竖向flex布局，而这个头部组件是在滚动view之外的，就会出现页面向下滚动时，页面显示穿透不了点位符的问题)
            // if(this.selectTabFirst){
            if (this.parmas.head.type == 'searchAndTab' && (this.decoratePageDTO.category == 'INDEX' || this.decoratePageDTO.category == 'INDEX-T')) {
                // 之前的代码
                // height = (this.selectTabFirst&&this.parmas.head.data.searchAndTabData.tabsShow?40:0) + (this.parmas.head.title.name?40:0) + (this.selectTabFirst?44:0)
                // 现在的代码
                height = (this.parmas.head.data.searchAndTabData.tabsShow ? 40 : 0) + (this.parmas.head.title.name ? 40 : 0) + 44
            } else if (
                this.parmas.head.type == 'searchAndBanner' &&
                (this.decoratePageDTO.category == 'INDEX' || this.decoratePageDTO.category == 'INDEX-T')
            ) {
                // 如果没有设置头部轮播图或者设置了轮播图却没上传一张图片时，则加一个44px的占位符
                // 如果没有设置商城名字，则加一个40px的占位符
                height = (!this.showBanner ? 40 : 0) + (this.parmas.head.title.name && !this.showBanner ? 40 : 0)
            }
            return height
        }
    },
    watch: {
        currentUUid: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.clickFloor(newValue)
                }
            },
            deep: true,
            immediate: true
        },
        'decoratePageDTO.name': {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.parmas.name = newValue //这个赋值是用于海报页面上显示头部标题
                }
            },
            deep: true,
            immediate: true
        },
        // 监听[三个按钮]的切换 做动画
        platform(nV, oV) {
            const weightMap = {
                //权重对应
                APP: 0,
                MP: 1,
                H5: 2
            }
            let platformWidth = this.platformWidth //缩短作用域链
            let step = weightMap[nV] - weightMap[oV]
            let direction = step < 0 //左移[true]还是右移[false]
            let diffDis = 0 //移动距离
            if (Math.abs(step) > 1) {
                //走2步
                diffDis = platformWidth[0] / 2 + platformWidth[1] + platformWidth[2] / 2 + 2 * 10 //1,3按钮宽度各一半+2按钮+2间距
            } else {
                //走1步
                diffDis = platformWidth[weightMap[nV]] / 2 + platformWidth[weightMap[oV]] / 2 + 10 //各自按钮一半 + 1间距
            }
            diffDis *= direction ? -1 : 1
            this.platformMove += diffDis //移动距离
            this.platformStyle.transform = `translateX(${this.platformMove}px)`
        }
    },
    activated() {
        console.log('走了activated')
    },
    mounted() {
        eventBus.$on('iframeUrl', (val) => {
            // console.log('组件传过来的值：',val)
            this.iframeUrl = val
        })
        this.getPlatformBtnWidth() //获取顶部栏按钮宽度
        if (this.$route.query.category) {
            //这个赋值要放在mounted的第一位，不然下面dialogFirstComeIn.showDialog()时由于没赋到值而出现bug
            this.decoratePageDTO.category = this.parmas.category = this.$route.query.category
        }
        this.decoratePageDTO.data = this.parmas // 建立引用关系

        this.setBannerHeight(window.innerWidth * 1) //如果屏幕宽度没变化,不会走window.onresize方法,所以要在这里给floorBanner.mediaHeight赋值
        // 监听屏幕宽度让floorBanner单轮播图插件可以自动改变高度(因为IE里媒体查询@media里不能用var传高度改值,所以要用这个方法监听)
        window.onresize = () => {
            //注意这里必须要用that传值，this不起作用
            this.setBannerHeight(document.documentElement.clientWidth * 1) //元素高度：scrollHeight，元素宽度：scrollWidth，整个元素的高/宽度（包括带滚动条的隐蔽的地方）
        }

        if (this.$route.query.id) {
            const loading = this.$loading({ lock: true, text: 'Loading', spinner: 'el-icon-loading' })
            decorate
                .edit({ id: this.$route.query.id })
                .then((res) => {
                    if (res.code) {
                        if (res.data) {
                            this.decoratePageDTO = res.data
                            let parmasData = JSON.parse(res.data.data)
                            this.$set(this, 'parmas', this.$utils.object.deepMerge(this.parmas, parmasData)) //防止增加或修改参数后，旧数据报错
                            console.log('edit-parmas~~~~~~~~', this.parmas)
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.$message.error(err.msg)
                })
                .finally(() => {
                    loading.close()
                })
        } else {
            this.$refs.dialogFirstComeIn.showDialog()
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$refs.dialogFirstComeIn.closeDialog() //解决点击新增进该页面后，点击浏览器的返回，dialogFirstComeIn窗口不会关闭的bug
        next()
    },
    methods: {
        // 根据屏幕宽度设置单轮播图楼层的高度
        setBannerHeight(scrollWidth) {
            if (scrollWidth <= 1180) {
                this.isWideScreen = false
                if (scrollWidth <= 1000) {
                    this.iphoneScale = (scrollWidth * 0.8) / 1000
                }
            } else {
                this.iphoneScale = 1
                this.isWideScreen = true
            }
            this.$forceUpdate() //不强制刷新的话值页面不会渲染
        },
        onScroll(scrollTop) {
            this.scrollTop = scrollTop
        },
        // 处理楼层
        dealFloors(type, index) {
            const that = this
            const timer = setInterval(() => {
                const ispeed = Math.floor(-that.$refs.rightEdge.scrollTop / 5)
                that.$refs.rightEdge.scrollTop = that.$refs.rightEdge.scrollTop + ispeed
                if (that.$refs.rightEdge.scrollTop === 0) {
                    // 当切换楼层时，让左侧侧边栏重新置顶
                    clearInterval(timer)
                }
            }, 16)

            if (type == 'delete') {
                if (this.isWideScreen) {
                    //如果是宽屏，点击楼层里的【删除】图标后，右边侧边栏显示【组件管理】组件
                    this.ctrlType = 'man'
                } else {
                    //如果不是宽屏，点击楼层里的【删除】图标后，右边侧边栏显示【添加楼层】组件
                    this.ctrlType = 'add'
                }
                this.parmas.floors.splice(index, 1)
                return
            }

            if (!this.getFormMessage()) return //如果form表单里的必填项校验没有通过，则在这里return

            this.currentUUid = this.parmas.floors[index].uuid
            this.ctrlType = type
            if (type == 'add') return
            if (type == 'edit') {
            }

            if (type == 'copy') {
                if (
                    this.parmas.floors[index].type == 'prodList' &&
                    this.parmas?.floors?.filter((item) => {
                        return item.type == 'prodList'
                    })?.length >= 5
                ) {
                    this.$message({ message: '备注：出于性能上的考虑，该楼层整个页面最多只允许存在五个', type: 'warning' })
                    return
                }
                if (
                    this.parmas.floors[index].type != 'assistLine' &&
                    this.parmas?.floors?.filter((item) => {
                        return item.type != 'assistLine'
                    })?.length >= 30
                ) {
                    this.$message({ message: '备注：出于性能上的考虑，页面最多只允许存在30个楼层', type: 'warning' })
                    return
                }
                const addFloor = this.$utils.object.deepClone(this.parmas.floors[index])
                addFloor.uuid = this.$utils.createUUID()
                this.parmas.floors.splice(index + 1, 0, addFloor)
            }

            if (type == 'down') {
                if (this.parmas.floors.length == 1) {
                    return
                } else if (index == this.parmas.floors.length - 1) {
                    return
                } else {
                    this.$utils.array.swapArray(this.parmas.floors, index, index + 1)
                }
            }
            if (type == 'up') {
                if (this.parmas.floors.length == 1) {
                    return
                } else if (index == 0) {
                    return
                } else {
                    this.$utils.array.swapArray(this.parmas.floors, index - 1, index)
                }
            }
        },
        validatePassed(api) {
            this.confirm(api)
        },

        getFormMessage() {
            let validate = true //校验是否通过
            if (this.$refs.floorFlag && this.$refs.floorFlag.checkForm && this.$refs.floorFlag.checkForm().length) {
                let alertMessage = ''
                this.$refs.floorFlag.checkForm().forEach((element) => {
                    alertMessage += `右侧底部列表${
                        element.field.split('.')[1]
                            ? `的<span style="color:red">${element.fieldName || ''}</span>第<span style="color:red">` +
                              (Number(element.field.split('.')[1]) + 1) +
                              '</span>项'
                            : ''
                    }：<span style="color:red">${element.message}</span>；</br>`
                })
                this.$alert(`<strong>页面右侧操作框内有以下必填项没填，请先去完善数据:</strong></br>${alertMessage}`, '警告：', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '知道了'
                })
                validate = false
            }
            return validate
        },
        async confirm(api) {
            let that = this

            if (!this.getFormMessage()) return //如果form表单里的必填项校验没有通过，则在这里return

            if (!this.decoratePageDTO.name) {
                // 如果页面还未有名字，则先跳到设置名字s
                this.$refs.dialog.showDialog(api)
                return
            }
            this.ctrlType = 'add' // 取消当前的选择，以免截取到的图片当前选择的楼层有阴影
            this.currentUUid = '' // 取消当前的选择，以免截取到的图片当前选择的楼层有阴影

            // 以下这段不能删
            // this.$refs.iphone.domToImg().then(resIphone => {
            //     that.decoratePageDTO.coverPicture = resIphone.data.url;

            that.decoratePageDTO.data = JSON.stringify(that.parmas)
            console.log('confirm-parmas~~~~~~~~~', that.parmas)
            console.log('decoratePageDTO:', that.decoratePageDTO)
            if (that.isUser) {
                that.decoratePageDTO.id = ''
                if (that.decoratePageDTO.category == 'INDEX-T') {
                    that.decoratePageDTO.category = 'INDEX'
                }
                if (that.decoratePageDTO.category == 'POSTER-T') {
                    that.decoratePageDTO.category = 'POSTER'
                }
            }
            decorate[api](that.decoratePageDTO)
                .then((res) => {
                    if (res.code) {
                        that.$message({ message: `${api == 'save' ? '保存' : '发布'}成功`, type: 'success' })
                        if (api == 'save') {
                            that.decoratePageDTO.id = res.data
                            if (that.isUser) {
                                that.isUser = ''
                            }
                        }
                        if (api == 'release') {
                            that.$router.push({ name: 'mbTrimIndex', params: { category: that.decoratePageDTO.category } })
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    that.$message.error(err.msg)
                })
            // });
        },

        changeFloors(flag) {
            if (!this.getFormMessage()) return //如果form表单里的必填项校验没有通过，则在这里return
            this.ctrlType = flag
        },
        // 点击【添加楼层】里的按钮或点击【组件管理】里的楼层触发
        clickFloor: throttle(function (curUid) {
            //如果是宽屏，点击【楼层】添加楼层，右则侧边栏切换到编辑界面。如果不是宽屏并且右则侧边栏为【添加楼层】，点击【楼层】添加楼层，右则侧边栏切换到编辑界面。
            // if (curUid && ((!this.isWideScreen&&this.ctrlType == 'add')||this.isWideScreen) ) {
            // 如果点击了【添加楼层】里的的楼层添加楼层
            this.ctrlType = 'edit' // 右边侧边栏马上跳到该添加的楼层的编辑组件里
            this.$nextTick(() => {
                this.$refs[curUid][0].$el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) //定位到当前楼层
            })
        }),
        // 获取顶部栏的按钮宽度
        getPlatformBtnWidth() {
            // console.log('ref--', [this.$refs.platform])
            let ref_platform = this.$refs.platform
            let index = 0,
                tempWidth = [],
                totalWidth = 0
            for (let each of ref_platform.children) {
                if (index > 2) {
                    break
                }
                tempWidth.push(each.offsetWidth)
                ++index
            }
            this.platformWidth = tempWidth
            totalWidth = tempWidth.reduce((pre, cur) => pre + cur, 0)
            // console.log('plat--', this.platformWidth)
            Object.assign(this.platformStyle, {
                left: `calc((100% - ${totalWidth}px) / 2)`
            })
            this.$nextTick(() => {
                let id = setTimeout(() => {
                    //延迟显示
                    this.platformStyle.opacity = 1
                    clearTimeout(id)
                }, 300)
            })
        },
        changeHead(type) {
            if (type == 'searchAndBanner') {
                //搜索+轮播图
                this.$refs.bannerHeadSearch.$el.scrollIntoView &&
                    this.$refs.bannerHeadSearch.$el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            } else if (type == 'searchAndTab') {
                //搜索+标签页
                // this.$refs.setUpHead.$el && this.$refs.setUpHead.$el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.seting-but {
    width: 28px;
    background-color: var(--setingbutbackgroundcolor);
    // 以下其实是：flex-center text-white rounded-15 overflow-h line-h-sm py-10 mb-5
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    line-height: 1.2 !important;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    &:hover {
        background-color: var(--themecolor);
    }
}
.scale-but {
    width: 28px;
    height: 28px;
    // 以下其实是：rounded-circle flex-center mb-5
    border-radius: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}
.current-floors {
    z-index: 3;
    box-shadow: rgba(45, 140, 240, 1) solid 2px;
    border: 3px solid rgba(45, 140, 240, 1);
}
// .platform {
//     margin-left: 210px;
//     ::v-deep .el-radio__input.is-checked + .el-radio__label {
//         color: #ffffff;
//     }
//     ::v-deep .el-radio__input.is-checked .el-radio__inner {
//         border-color: #ffffff;
//         background: #666666;
//     }
// 	::v-deep .el-radio__label{
// 		 color: #666666;
// 	}
// }

::v-deep .el-radio__label {
    font-size: 12px;
}

// 谷歌浏览上就将原生的scrollbar去掉
.right-edge::-webkit-scrollbar {
    display: none;
}

.right-edge {
    // 火狐浏览上就将原生的scrollbar去掉
    scrollbar-width: none;

    // ie 去掉滚动条
    -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-overflow-style: none;
}

// 修改body的滚动条
body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
body::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
}
body::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
}
body::-webkit-scrollbar-thumb:hover {
    background: #333;
}
body::-webkit-scrollbar-corner {
    background: #179a16;
}

/* 顶部固定栏 */
.bg-fixed-menu {
    .platform {
        position: relative;
        margin-left: 210px;
        .el-button--text {
            color: #fff;
            &.curPlatform {
                //当前激活按钮样式
                transition: all ease 0.4s;
                transform: scale(1.2);
            }
        }
        .bg-menu-triangle {
            position: absolute;
            left: 0;
            bottom: -12px;
            border: 12px solid transparent;
            border-bottom: 12px solid #fff;
        }
    }
}
</style>
