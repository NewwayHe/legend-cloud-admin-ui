<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：轮播图)：banner
    */ -->
    <div
        class="w-100 position-relative"
        :style="{
            height: `${floors.height}px`,
            '--indicatorColor': floors.indicatorThemeColor ? parmas.themeColor : floors.indicatorColor,
            '--cardwidth': floors.cardWidth + '%',
            '--cardLeft': (366 * (100 - floors.cardWidth)) / 200 + 'px',
            '--cardwidthtranslateX': (360 - (360 * floors.cardWidth) / 100) / 2 + 'px'
        }"
    >
        <el-carousel
            :key="keyIndex"
            class="rounded-2 overflow-h"
            :class="[
                'indicator-' + floors.indicatorDots,
                { card1: floors.cardType == '1', card2: floors.cardType == '2', borderRadius: floors.borderRadius }
            ]"
            style="height: 100%"
            :arrow="'never'"
            :autoplay="floors.autoplay"
            :interval="floors.interval * 1"
            :loop="floors.loop"
            :direction="floors.vertical ? 'vertical' : 'horizontal'"
            :indicator-position="'none'"
            :initial-index="current"
            :type="floors.cardType == '2' ? 'card' : ''"
            @change="change"
        >
            <el-carousel-item
                v-for="(item, index) in floors.data.imgList"
                v-if="floors.data.imgList && floors.data.imgList.length"
                :key="index"
                class="flex-center"
                :style="{
                    height: current != index && floors.cardType == '1' ? '83%' : '',
                    marginTop: current != index && floors.cardType == '1' ? `${(floors.height * (1 - 0.83)) / 2}px` : ''
                }"
            >
                <div
                    v-if="item.img"
                    class="w-100 h-100 position-absolute bottom-0 left-0 transition-all05"
                    :style="{ padding: current != index && floors.cardType == '1' ? '0 10px' : '' }"
                >
                    <img class="w-100 h-100" :src="$photoServer + item.img" alt="" />
                </div>
                <div
                    v-else
                    class="flex-center w-100 position-absolute bottom-0 left-0"
                    :style="{ height: `${floors.height}px`, backgroundColor: index > 3 ? imglist[1] : imglist[index] }"
                >
                    <span v-if="floors.data.imgList.length && !floors.data.imgList[0].img" class="font-12 text-white px-10">
                        {{
                            `建议图片尺寸：${
                                floors.cardType == '0'
                                    ? 750
                                    : floors.cardType == '1'
                                    ? ((750 * floors.cardWidth) / 100).toFixed(0)
                                    : (((750 - 40) * floors.cardWidth) / 100).toFixed(0)
                            }*${floors.cardType == '2' ? (floors.height - 20) * 2 : floors.height * 2}px`
                        }}
                    </span>
                </div>
                <template v-if="floors.indicatorDots == 'nav'">
                    <div
                        v-if="!floors.vertical"
                        class="flex-start zindex-2 position-absolute bottom-0 left-0 w-100 text-white"
                        style="height: 40px"
                        :style="{ backgroundColor: indicatorNavRGB02 }"
                    >
                        <div class="font-14 pl-20">{{ index + 1 }}/{{ floors.data.imgList.length }}</div>
                        <div class="flex-1 line-clamp2 pl-20">{{ item.content }}</div>
                    </div>
                    <div
                        v-if="floors.vertical"
                        class="zindex-2 position-absolute bottom-0 right-0 h-100 text-white overflow-h text-wrap"
                        style="width: 40px"
                        :style="{ backgroundColor: indicatorNavRGB02 }"
                    >
                        <div class="font-14 pt-10 text-center">{{ index + 1 }}/{{ floors.data.imgList.length }}</div>
                        <div class="pt-10 m-0-auto" style="width: 12px">{{ item.content }}</div>
                    </div>
                </template>
            </el-carousel-item>

            <template v-if="floors.indicatorDots == 'default'">
                <div
                    v-if="!floors.vertical"
                    class="zindex-2 position-absolute left-0 w-100 text-white overflow-h p-10"
                    :class="[topBottom, startMidEnd]"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
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
                    v-if="floors.vertical"
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 w-100 text-white overflow-h p-10"
                    :class="[leftRight, startMidEndColumn]"
                    :style="{ height: `${floors.height}px`, width: '22px' }"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="mb-5 flex-center transition-all05"
                        style="width: 2px"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            height: `${indexNum == current ? 15 : 7}px`
                        }"
                    ></div>
                </div>
            </template>

            <template v-if="floors.indicatorDots == 'dot'">
                <div
                    v-if="!floors.vertical"
                    class="zindex-2 position-absolute left-0 w-100 text-white overflow-h p-10"
                    :class="[topBottom, startMidEnd]"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="rounded-circle mr-5 flex-center transition-all05"
                        style="width: 7px; height: 7px"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    ></div>
                </div>
                <div
                    v-if="floors.vertical"
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 right-0 w-100 text-white overflow-h p-10"
                    :class="[leftRight, startMidEndColumn]"
                    :style="{ height: `${floors.height}px`, width: '27px' }"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="rounded-circle mb-5 flex-center transition-all05"
                        style="height: 7px; width: 7px"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    ></div>
                </div>
            </template>

            <template v-if="floors.indicatorDots == 'round'">
                <div
                    v-if="!floors.vertical"
                    class="zindex-2 position-absolute left-0 w-100 text-white overflow-h p-10"
                    :class="[topBottom, startMidEnd]"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
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
                    v-if="floors.vertical"
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 right-0 w-100 text-white overflow-h p-10"
                    :class="[leftRight, startMidEndColumn]"
                    :style="{ height: `${floors.height}px`, width: '27px' }"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="rounded-circle mb-5 flex-center transition-all05"
                        style="width: 7px"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            height: `${indexNum == current ? 15 : 7}px`,
                            borderRadius: indexNum == current ? '7px' : '50%'
                        }"
                    ></div>
                </div>
            </template>

            <template v-if="floors.indicatorDots == 'indexes'">
                <div
                    v-if="!floors.vertical"
                    class="zindex-2 position-absolute left-0 w-100 text-white overflow-h p-10"
                    :class="[topBottom, startMidEnd]"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="rounded-circle mr-5 flex-center"
                        style="width: 20px; height: 20px"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    >
                        <span>{{ itemNum }}</span>
                    </div>
                </div>
                <div
                    v-if="floors.vertical"
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 right-0 w-100 text-white overflow-h p-10"
                    :class="[leftRight, startMidEndColumn]"
                    :style="{ height: `${floors.height}px`, width: '40px' }"
                >
                    <div
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                        class="rounded-circle mb-5 flex-center"
                        style="width: 20px; height: 20px"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    >
                        <span>{{ itemNum }}</span>
                    </div>
                </div>
            </template>

            <el-carousel-item
                v-for="(item, index) in imglist"
                v-if="floors.data.imgList && !floors.data.imgList.length"
                :key="index"
                class="flex-center"
            >
                <div class="flex-center w-100 position-absolute bottom-0 left-0" :style="{ height: `${floors.height}px`, backgroundColor: item }">
                    <span v-if="floors.data.imgList.length && !floors.data.imgList[0].img" class="font-12 text-white px-10">
                        {{
                            `建议图片尺寸：${
                                floors.cardType == '0'
                                    ? 750
                                    : floors.cardType == '1'
                                    ? ((750 * floors.cardWidth) / 100).toFixed(0)
                                    : (((750 - 40) * floors.cardWidth) / 100).toFixed(0)
                            }*${floors.cardType == '2' ? (floors.height - 20) * 2 : floors.height * 2}px`
                        }}
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
            current: 0,
            keyIndex: 0 //用来解决当选择floors.cardType == '2'后，再切换让floors.cardType == '1'或'0'时，轮播元素还是scale(0.83)的bug
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
        topBottom() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'up-right' ? 'top-0' : 'bottom-0'
        },
        leftRight() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'up-right' ? 'left-0' : 'right-0'
        },
        startMidEnd() {
            return this.floors.indicatorPosition == 'up-right' || this.floors.indicatorPosition == 'down-right'
                ? 'flex-end'
                : this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'down-left'
                ? 'flex-start'
                : 'flex-center'
        },
        startMidEndColumn() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'down-left'
                ? 'j-end'
                : this.floors.indicatorPosition == 'up-right' || this.floors.indicatorPosition == 'down-right'
                ? 'j-start'
                : 'j-center'
        },
        previousMargin() {
            let cardWidth = 0
            if (this.floors.cardType == '1') {
                let imgWidth = (375 * this.floors.cardWidth) / 100 //计算出每张图片的宽度
                cardWidth = ((375 - imgWidth) / 2).toFixed(0) //单位：px
            }
            return cardWidth + 'px'
        }
    },
    watch: {
        'floors.cardType': {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.keyIndex++ //用来解决当选择floors.cardType == '2'后，再切换让floors.cardType == '1'或'0'时，轮播元素还是scale(0.83)的bug
                }
            },
            deep: true,
            immediate: true
        }
    },
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

.borderRadius {
    ::v-deep .el-carousel__container .el-carousel__item {
        img {
            border-radius: 12px;
            overflow: hidden;
        }
    }
}
.card1 {
    width: var(--cardwidth);
    overflow: visible;
    margin-left: var(--cardLeft);
    // padding: 0 5px;
    ::v-deep .el-carousel__item {
        // transform:scale(0.83) !important;
    }
    ::v-deep .el-carousel__item.is-active {
        // transform: scale(1) !important;
        // transform: translateX(var(--cardwidthtranslateX)) scale(1) !important;
    }
}
.card2 {
    padding: 10px;
    margin-right: 10px;
    ::v-deep .el-carousel__item--card.is-active {
        width: var(--cardwidth);
        transform: translateX(var(--cardwidthtranslateX)) scale(1) !important;
    }
}

::v-deep .el-carousel__button {
    background: var(--indicatorColor);
    opacity: 0.3;
}
::v-deep .is-active .el-carousel__button {
    opacity: 0.9;
}
</style>
