<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：魔方)：cube
    */ -->
    <div class="w-100 transition-all05 position-relative" :style="{ height: `${floors.height}px`, backgroundColor: floors.backgroundColor }">
        <!-- 背景图片 -->
        <img
            v-if="floors.backgroundImg"
            class="w-100 h-100 position-absolute top-0 right-0 font-0"
            :src="$photoServer + floors.backgroundImg"
            alt=""
        />
        <!-- 魔方：魔方类型(cubeType)：1-2:1左2右,1*2:1行2列,1*3:1行3列,1*4:1行4列,2*2:2行2列 -->
        <el-row
            v-if="
                floors.cubeType == '1*2' ||
                floors.cubeType == '1*3' ||
                floors.cubeType == '1*4' ||
                floors.cubeType == '2*2' ||
                floors.cubeType == '2*3'
            "
            :gutter="floors.cardType ? 10 : 0"
            :class="{ 'p-10': floors.cardType }"
            class="overflow-h h-100"
        >
            <template v-if="floors.data.imgList && floors.data.imgList.length">
                <el-col
                    v-for="(item, index) in floors.data.imgList"
                    v-if="
                        floors.cubeType == '1*2'
                            ? index <= 1
                            : floors.cubeType == '1*3' || floors.cubeType == '1-2'
                            ? index <= 2
                            : floors.cubeType == '2*3'
                            ? index <= 5
                            : index <= 3
                    "
                    :key="index"
                    :span="
                        floors.cubeType == '1*2' || floors.cubeType == '2*2'
                            ? 12
                            : floors.cubeType == '1*3' || floors.cubeType == '2*3'
                            ? 8
                            : floors.cubeType == '1*4'
                            ? 6
                            : 24
                    "
                    :style="{ height: floors.cubeType == '2*2' || floors.cubeType == '2*3' ? '50%' : '100%' }"
                    :class="{
                        'pb-5':
                            floors.cardType &&
                            ((floors.cubeType == '2*2' && (index == 0 || index == 1)) ||
                                (floors.cubeType == '2*3' && (index == 0 || index == 1 || index == 2))),
                        'pt-5':
                            floors.cardType &&
                            ((floors.cubeType == '2*2' && (index == 2 || index == 3)) ||
                                (floors.cubeType == '2*3' && (index == 3 || index == 4 || index == 5)))
                    }"
                >
                    <img
                        v-if="item.img"
                        class="w-100 h-100 overflow-h"
                        :class="{ 'rounded-12': floors.cardType }"
                        :src="$photoServer + item.img"
                        alt=""
                    />
                    <div
                        v-else
                        class="h-100 overflow-h flex-center text-center font-14 text-white"
                        :class="{ 'rounded-12': floors.cardType }"
                        :style="{ backgroundColor: index > 3 ? imglist[1] : imglist[index] }"
                    >
                        <span v-if="floors.cubeType == '2*3'">
                            图片尺寸{{ floors.cardType ? 223 : 250 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                        </span>
                        <span v-if="floors.cubeType == '2*2'">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                        </span>
                        <span v-if="floors.cubeType == '1*4'" class="font-12">
                            图片尺寸{{ floors.cardType ? 162.5 : 187.5 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                        <span v-if="floors.cubeType == '1*3'">
                            图片尺寸{{ floors.cardType ? 223 : 250 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                        <span v-if="floors.cubeType == '1*2'">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                    </div>
                </el-col>
            </template>
            <template v-if="floors.data.imgList && !floors.data.imgList.length">
                <el-col
                    v-for="(item, index) in imglist"
                    v-if="
                        floors.cubeType == '1*2'
                            ? index <= 1
                            : floors.cubeType == '1*3' || floors.cubeType == '1-2'
                            ? index <= 2
                            : floors.cubeType == '2*3'
                            ? index <= 5
                            : index <= 3
                    "
                    :key="index"
                    :span="
                        floors.cubeType == '1*2' || floors.cubeType == '2*2'
                            ? 12
                            : floors.cubeType == '1*3' || floors.cubeType == '2*3'
                            ? 8
                            : floors.cubeType == '1*4'
                            ? 6
                            : 24
                    "
                    :class="{
                        'pb-5':
                            floors.cardType &&
                            ((floors.cubeType == '2*2' && (index == 0 || index == 1)) ||
                                (floors.cubeType == '2*3' && (index == 0 || index == 1 || index == 2))),
                        'pt-5':
                            floors.cardType &&
                            ((floors.cubeType == '2*2' && (index == 2 || index == 3)) ||
                                (floors.cubeType == '2*3' && (index == 3 || index == 4 || index == 5)))
                    }"
                    :style="{ height: floors.cubeType == '2*2' || floors.cubeType == '2*3' ? '50%' : '100%' }"
                >
                    <div
                        class="h-100 overflow-h flex-center text-center font-14 text-white"
                        :class="{ 'rounded-12': floors.cardType }"
                        :style="{ backgroundColor: item }"
                    >
                        <span v-if="floors.cubeType == '2*3'">
                            图片尺寸{{ floors.cardType ? 223 : 250 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                        </span>
                        <span v-if="floors.cubeType == '2*2'">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                        </span>
                        <span v-if="floors.cubeType == '1*4'" class="font-12">
                            图片尺寸{{ floors.cardType ? 162.5 : 187.5 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                        <span v-if="floors.cubeType == '1*3'">
                            图片尺寸{{ floors.cardType ? 223 : 250 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                        <span v-if="floors.cubeType == '1*2'">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                    </div>
                </el-col>
            </template>
        </el-row>
        <el-row v-if="floors.cubeType == '1-2'" :gutter="floors.cardType ? 10 : 0" :class="{ 'p-10': floors.cardType }" class="overflow-h h-100">
            <template v-if="floors.data.imgList && floors.data.imgList.length">
                <el-col :span="12" style="height: 100%">
                    <img
                        v-if="floors.data.imgList[0] && floors.data.imgList[0].img"
                        class="w-100 h-100 overflow-h"
                        :class="{ 'rounded-12': floors.cardType }"
                        :src="$photoServer + floors.data.imgList[0].img"
                        alt=""
                    />
                    <div
                        v-else
                        class="flex-center w-100 h-100 overflow-h"
                        :class="{ 'rounded-12': floors.cardType }"
                        :style="{ backgroundColor: imglist[0] }"
                    >
                        <span class="font-14 text-white">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                    </div>
                </el-col>
                <el-col :span="12" style="height: 100%">
                    <div class="h-100 w-100 flex-col-between h-100">
                        <div class="rounded-2 overflow-h flex-center w-100" style="height: 50%">
                            <img
                                v-if="floors.data.imgList[1] && floors.data.imgList[1].img"
                                class="w-100 h-100 overflow-h"
                                :class="{ 'rounded-12 pb-5': floors.cardType }"
                                :src="$photoServer + floors.data.imgList[1].img"
                            />
                            <span
                                v-else
                                class="flex-center font-14 text-white w-100 h-100 overflow-h"
                                :class="{ 'rounded-12 mb-5': floors.cardType }"
                                :style="{ backgroundColor: imglist[1] }"
                            >
                                图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                            </span>
                        </div>
                        <div class="rounded-2 overflow-h flex-center w-100" style="height: 50%">
                            <img
                                v-if="floors.data.imgList[2] && floors.data.imgList[2].img"
                                class="w-100 h-100 overflow-h"
                                :class="{ 'rounded-12 pt-5': floors.cardType }"
                                :src="$photoServer + floors.data.imgList[2].img"
                            />
                            <span
                                v-else
                                class="flex-center font-14 text-white w-100 h-100 overflow-h"
                                :class="{ 'rounded-12 mt-5': floors.cardType }"
                                :style="{ backgroundColor: imglist[2] }"
                            >
                                图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                            </span>
                        </div>
                    </div>
                </el-col>
            </template>
            <template v-if="floors.data.imgList && !floors.data.imgList.length">
                <el-col v-for="(item, index) in imglist" v-if="index == 0" :key="index" :span="12" style="height: 100%">
                    <div class="flex-center w-100 h-100 overflow-h" :class="{ 'rounded-12': floors.cardType }" :style="{ backgroundColor: item }">
                        <span class="font-14 text-white">
                            图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? (floors.height - 20) * 2 : floors.height * 2 }}px
                        </span>
                    </div>
                </el-col>
                <el-col :span="12" style="height: 100%">
                    <div class="h-100 w-100 flex-col-between h-100">
                        <div
                            v-for="(item, index) in imglist"
                            v-if="index != 0 && index <= 2"
                            :key="index"
                            class="rounded-2 overflow-h flex-center w-100"
                            :class="{ 'mb-5 rounded-12': floors.cardType && index == 1, 'mt-5 rounded-12': floors.cardType && index == 2 }"
                            :style="{ backgroundColor: item, height: '50%' }"
                        >
                            <span class="font-14 text-white">
                                图片尺寸{{ floors.cardType ? 345 : 375 }}*{{ floors.cardType ? floors.height - 30 : floors.height }}px
                            </span>
                        </div>
                    </div>
                </el-col>
            </template>
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
        return {
            imglist: [
                'rgba(71,86,105,0.7)',
                'rgba(153,169,191,0.7)',
                'rgba(211,220,230,0.7)',
                'rgba(71,86,105,0.2)',
                'rgba(211,220,230,0.5)',
                'rgba(71,86,105,0.5)'
            ]
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
