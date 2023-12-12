<template>
    <!-- /*
     * @Descripttion:右边编辑栏(其它组件：辅助线)：assistLine
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">背景颜色：</span>
                <el-radio v-model="value.themeColor" :label="false">
                    <span class="mr-10">自定义</span>
                    <el-tooltip effect="dark" content="提示：可以在颜色选择器上将rgba值的a值改为0只达到透明的效果" placement="top-start">
                        <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                    </el-tooltip>
                    <el-color-picker v-model="value.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                </el-radio>
                <el-radio v-model="value.themeColor" :label="true">主题色</el-radio>
            </div>
            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">线条样式：</span>
                <el-radio v-model="value.assistType" :label="'solid'">实线</el-radio>
                <el-radio v-model="value.assistType" :label="'dotted'">点线</el-radio>
                <el-radio v-model="value.assistType" :label="'dashed'">虚线</el-radio>
                <el-radio v-model="value.assistType" :label="'none'">无</el-radio>
            </div>
            <div class="transition-all05 overflow-h w-100" :style="{ height: `${value.assistType != 'none' ? '170px' : '0px'}` }">
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">线条大小：</span>
                    <el-radio v-model="value.size" :label="1">小</el-radio>
                    <el-radio v-model="value.size" :label="2">中</el-radio>
                    <el-radio v-model="value.size" :label="3">大</el-radio>
                </div>
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">线条颜色：</span>
                    <el-radio v-model="value.fontThemeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.color" class="v-middle"></el-color-picker>
                    </el-radio>
                    <el-radio v-model="value.fontThemeColor" :label="true">主题色</el-radio>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">排列方式：</span>
                    <el-radio v-model="value.position" :label="'left'">左对齐</el-radio>
                    <el-radio v-model="value.position" :label="'middle'">居中</el-radio>
                    <el-radio v-model="value.position" :label="'right'">右对齐</el-radio>
                </div>
                <div class="flex-start text-nowrap w-100 mb-15">
                    <span class="pr-15">&emsp;&emsp;宽度：</span>
                    <el-slider v-model="value.width" class="w-100" input-size="mini" :max="100" show-input></el-slider>
                </div>
            </div>

            <div class="flex-start text-nowrap w-100 mb-15">
                <span class="pr-15">&emsp;&emsp;高度：</span>
                <el-slider v-model="value.height" class="w-100" input-size="mini" :max="400" show-input></el-slider>
            </div>
        </div>
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
export default {
    components: {},
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.assistLine
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
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
