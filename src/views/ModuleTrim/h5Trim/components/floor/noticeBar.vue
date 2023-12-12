<template>
    <!-- /*
     * @Descripttion:(楼层组件：动态广播)：noticeBar
    */ -->
    <div :style="{ color: floors.fontThemeColor ? parmas.themeColor : floors.color,padding: `${floors.paddingY}px ${floors.paddingX}px` }">
        <div
            class="font-14 overflow-h flex-start px-15"
			:class="[{ 'rounded-10': floors.borderRadius }]"
            :style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor, color: floors.contentColor }"
            style="height: 32px;"
        >
            <div class="font-weight" :style="{ color: floors.titleThemeColor ? parmas.themeColor : floors.titleColor }">{{ floors.title }}</div>
            <div class="pl-15 flex-1 flex-start" :style="{ color: floors.contentColor }">
                <i class="iconfont icon-laba1 mr-5"></i>
                <el-carousel class="flex-1" height="32px" direction="vertical" :autoplay="true" :indicator-position="'none'">
                    <el-carousel-item v-for="(item, index) in list" :key="index">
						<div class="flex-start w-100 h-100 overflow-h">
							<span class="line-clamp1" :style="{ color: item.color ? item.color : '' }" v-html="item.title"></span>
						</div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <!-- 微信的胶囊 -->
        <!-- <div style="height: 44 px;width:100px;" v-if="isFirstFloor&&platform == 'MP'"></div> -->
    </div>
</template>

<script>
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
        return {}
    },
    computed: {
        // isFirstFloor() {
        //     //如果菜单组件是第一层，在小程序时加入胶囊点占符
        //     return this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid ? true : false;
        // },
        list() {
            let arr = []
            arr = this.floors.data.contentList.filter((item) => {
                return item.show
            })
            return arr
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
