<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：图文导航)：navigation
    */ -->
    <div
        class="py-10"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            color: floors.fontThemeColor ? parmas.themeColor : floors.color
        }"
		:class="[floors.cardType?'m-10 rounded-10':'']"
    >
        <template v-if="floors.row === 1 || floors.row === 2">
            <el-carousel
                class="rounded-2 transition-all05"
                :class="'indicator-' + floors.indicatorDots"
                :style="{
                    height: `${floors.row === 1 ? 90 : 174}px`,
                    '--containerHeight': `${floors.row === 1 ? 90 - 24 : 174 - 24}px`,
                    '--indicatorColor': floors.indicatorThemeColor ? parmas.themeColor : floors.indicatorColor
                }"
                :arrow="'never'"
                :autoplay="floors.autoplay"
                :interval="floors.interval * 1"
                :loop="floors.loop"
                :direction="floors.vertical ? 'vertical' : 'horizontal'"
                :indicator-position="floors.indicatorDots == 'none' ? 'none' : 'outside'"
            >
				<!-- :type="floors.cardType ? 'card' : ''" -->
                <el-carousel-item v-for="(itemTwo, indexTwo) in imgTwoDimList" :key="indexTwo">
                    <el-row type="flex" style="flex-wrap: wrap">
                        <el-col
                            v-for="(item, index) in itemTwo"
                            :key="index"
                            class="flex-col-center overflow-h pb-10 transition-all05"
                            :style="{ width: floors.col == 3 ? '33.3%' : floors.col == 4 ? '25%' : floors.col == 5 ? '20%' : '25%' }"
                        >
                            <img v-if="item.img" style="width: 45px; height: 45px" :src="$photoServer + item.img" alt="" />
                            <div v-else class="bg-ccc flex-center" style="width: 45px; height: 45px">
                                <i class="el-icon-picture text-999 font-36"></i>
                            </div>
                            <div class="text-nowrap p-5" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">{{ item.title }}</div>
                        </el-col>
                    </el-row>
                </el-carousel-item>
            </el-carousel>
        </template>

        <el-row v-else type="flex" style="flex-wrap: wrap">
            <el-col
                v-for="(item, index) in floors.data.imgList"
                :key="index"
                class="flex-col-center overflow-h pb-10 transition-all05"
                :style="{ width: floors.col == 3 ? '33.3%' : floors.col == 4 ? '25%' : floors.col == 5 ? '20%' : '25%' }"
            >
                <img v-if="item.img" style="width: 45px; height: 45px" :src="$photoServer + item.img" alt="" />
                <div v-else class="bg-ccc flex-center" style="width: 45px; height: 45px"><i class="el-icon-picture text-999 font-36"></i></div>
                <div class="text-nowrap p-5" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">{{ item.title }}</div>
            </el-col>
        </el-row>
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
        return {}
    },
    computed: {
        imgTwoDimList() {
            //接收floors.data.imgList转化后的二维数组
            return this.$utils.array.arrToTwoDim(this.floors.data.imgList, this.floors.col * this.floors.row)
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
/* elemetl轮播图当不想用:height传固定值，而是用 style="height: 100%;" 随着外层div的高度变化时就设以下这个 */
::v-deep .el-carousel__container {
    height: var(--containerHeight);
}
::v-deep .el-carousel--horizontal {
    overflow-x: unset;
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
    ::v-deep .el-carousel__indicator--vertical.is-active .el-carousel__button {
        width: 7px !important;
        height: 21px !important;
        border-radius: 7px;
    }
}
</style>
