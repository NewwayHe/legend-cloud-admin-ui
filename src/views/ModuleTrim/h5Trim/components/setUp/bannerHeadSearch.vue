<template>
    <!-- /*
     * @Descripttion:楼层(功能组件：搜索栏轮播图)：banner
    */ -->
    <div
        v-if="
            floors.imgList &&
            floors.imgList.length &&
            parmas.head &&
            parmas.head.type == 'searchAndBanner' &&
            parmas.head.data.searchAndBannerData.showBanner
        "
        class="w-100 position-relative banner hover-mask"
        :style="{
            height: `${floors.height}px`,
            '--indicatorColor': floors.indicatorThemeColor ? parmas.themeColor : floors.indicatorColor
        }"
    >
        <el-carousel
            class="rounded-2 overflow-h"
            :class="['indicator-' + floors.indicatorDots]"
            style="height: 100%"
            :arrow="'never'"
            :autoplay="floors.autoplay"
            :interval="floors.interval * 1"
            :loop="floors.loop"
            :indicator-position="'none'"
            :initial-index="current"
            @change="change"
        >
            <el-carousel-item v-for="(item, index) in floors.imgList" :key="index" class="flex-center">
                <img
                    v-if="item.img"
                    class="w-100 position-absolute bottom-0 left-0 h-auto"
                    :src="$photoServer + item.img"
                    :mode="'aspectFill'"
                    alt=""
                />
                <div
                    v-else
                    class="flex-center w-100 position-absolute bottom-0 left-0"
                    :style="{ height: `${floors.height + 20}px`, backgroundColor: index > 3 ? imglist[1] : imglist[index] }"
                >
                    <span v-if="floors.imgList.length && !floors.imgList[0].img" class="font-12 text-white px-10 pt-40">
                        {{ `建议图片尺寸：宽=750px，高>=${floors.height * 2 + 20 * 2}px` }}
                    </span>
                </div>
                <div
                    v-if="floors.indicatorDots == 'nav'"
                    class="flex-start zindex-2 position-absolute bottom-0 left-0 w-100 text-white"
                    style="height: 40px"
                    :style="{ backgroundColor: indicatorNavRGB02 }"
                >
                    <div class="font-14 pl-20">{{ index + 1 }}/{{ floors.imgList.length }}</div>
                    <div class="flex-1 line-clamp2 pl-20">{{ item.content }}</div>
                </div>
            </el-carousel-item>
            <div
                v-if="floors.indicatorDots == 'default'"
                class="zindex-2 position-absolute bottom-0 left-0 w-100 text-white overflow-h p-10"
                :class="[startMidEnd]"
            >
                <div
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                    class="mr-5 flex-center transition-all05"
                    style="height: 2px"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: `${indexNum == current ? 15 : 7}px`
                    }"
                ></div>
            </div>
            <div
                v-if="floors.indicatorDots == 'dot'"
                class="zindex-2 position-absolute bottom-0 left-0 w-100 text-white overflow-h p-10"
                :class="[startMidEnd]"
            >
                <div
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                    class="rounded-circle mr-5 flex-center transition-all05"
                    style="width: 7px; height: 7px"
                    :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                ></div>
            </div>
            <div
                v-if="floors.indicatorDots == 'round'"
                class="zindex-2 position-absolute bottom-0 left-0 w-100 text-white overflow-h p-10"
                :class="[startMidEnd]"
            >
                <div
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                    class="rounded-circle mr-5 flex-center transition-all05"
                    style="height: 7px"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: `${indexNum == current ? 15 : 7}px`,
                        borderRadius: indexNum == current ? '7px' : '50%'
                    }"
                ></div>
            </div>
            <div
                v-if="floors.indicatorDots == 'indexes'"
                class="zindex-2 position-absolute bottom-0 left-0 w-100 text-white overflow-h p-10"
                :class="[startMidEnd]"
            >
                <div
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                    class="rounded-circle mr-5 flex-center"
                    style="width: 20px; height: 20px"
                    :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                >
                    <span>{{ itemNum }}</span>
                </div>
            </div>
            <el-carousel-item v-for="(item, index) in imglist" v-if="floors.imgList && !floors.imgList.length" :key="index" class="flex-center">
                <div class="flex-center w-100 position-absolute bottom-0 left-0" :style="{ height: `${floors.height}px`, backgroundColor: item }">
                    <span v-if="floors.imgList.length && !floors.imgList[0].img" class="font-12 text-white px-10 pt-40">
                        {{ `建议图片尺寸：宽=750px，高>=${floors.height * 2 + 20 * 2}px` }}
                    </span>
                </div>
            </el-carousel-item>
        </el-carousel>
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
        }
    },
    data() {
        return {
            imglist: ['rgba(71,86,105,0.7)', 'rgba(153,169,191,0.7)', 'rgba(211,220,230,0.7)', 'rgba(71,86,105,0.2)'],
            current: 0
        }
    },
    computed: {
        indicatorNavRGB02() {
            let rgb = this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor
            return `rgba(${this.$utils.color.colorRgb(rgb).r}, ${this.$utils.color.colorRgb(rgb).g},${this.$utils.color.colorRgb(rgb).b},.2)`
        },
        indicatorNavRGB03() {
            let rgb = this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor
            return `rgba(${this.$utils.color.colorRgb(rgb).r}, ${this.$utils.color.colorRgb(rgb).g},${this.$utils.color.colorRgb(rgb).b},.3)`
        },
        indicatorNavRGB09() {
            let rgb = this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor
            return `rgba(${this.$utils.color.colorRgb(rgb).r}, ${this.$utils.color.colorRgb(rgb).g},${this.$utils.color.colorRgb(rgb).b},.9)`
        },
        startMidEnd() {
            return this.floors.indicatorPosition == 'left' ? 'flex-start' : this.floors.indicatorPosition == 'right' ? 'flex-end' : 'flex-center'
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        change(e) {
            this.current = e * 1
        }
    }
}
</script>

<style lang="scss" scoped>
/* elemetl轮播图当不想用:height传固定值，而是用 style="height: 100%;" 随着外层div的高度变化时就设以下这个 */
::v-deep .el-carousel__container {
    height: 100%;
}

// .indicator-default{
::v-deep .el-carousel__button {
    background: var(--indicatorColor);
    opacity: 0.3;
}
::v-deep .is-active .el-carousel__button {
    opacity: 0.9;
}
// }

.indicator-dot {
    ::v-deep .el-carousel__button {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50%;
    }
}
.indicator-round {
    ::v-deep .el-carousel__button {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50%;
    }
    ::v-deep .el-carousel__indicator--horizontal.is-active .el-carousel__button {
        width: 21px !important;
        height: 7px !important;
        border-radius: 7px;
    }
}
.banner {
    ::v-deep .el-carousel__item {
        overflow: unset;
    }
    ::v-deep .el-carousel--horizontal {
        overflow: unset;
    }
}
</style>
