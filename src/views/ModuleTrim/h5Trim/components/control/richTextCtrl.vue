<template>
    <!-- /*
     * @Descripttion:右边编辑栏(其它组件：富文本)：richText
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">背景颜色：</span>
                <el-radio v-model="value.themeColor" :label="false">
                    <span class="mr-10">自定义</span>
                    <el-color-picker v-model="value.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                </el-radio>
                <el-radio v-model="value.themeColor" :label="true">主题色</el-radio>
            </div>
            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">是否全屏：</span>
                <el-switch v-model="value.fullScreen" class="pr-10"></el-switch>
            </div>
        </div>

        <div class="mb-20">
            <TinyMce v-model="value.data.richTextData" :width="440" :height="700" />
        </div>
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
import TinyMce from '@/components/TinyMceNew'
export default {
    components: { TinyMce },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.richText
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

<style lang="scss" scoped>
</style>
