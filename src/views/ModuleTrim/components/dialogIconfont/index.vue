<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-矢量图标
*/ -->
    <el-dialog
        :custom-class="'dialog-form dialog-trim-url ' + (isCompatible ? 'compatibleWidth' : '')"
        append-to-body
        :visible.sync="dialogTableVisible"
        title="矢量图标"
    >
        <div class="w-100 text-center px-30 py-20 overflow-y-scroll" style="height: 630px">
            <keep-alive v-if="reload">
                <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
                    <el-col v-for="(item, index) in data.glyphs" :key="item.font_class" class="mb-15" :span="4">
                        <div
                            class="w-100 rounded-5 hover-current flex-col-center bg-fa p-10 font-12 position-relative overflow-h"
                            :style="{
                                border: valueTemp == item.font_class ? `2px solid ${parmas.themeColor || '#409EFF'}` : '2px solid #ffffff',
                                color: valueTemp == item.font_class ? parmas.themeColor || '#409EFF' : '#999999'
                            }"
                            @click="choice(item.font_class)"
                        >
                            <i
                                v-if="valueTemp == item.font_class"
                                class="iconfont icon-xuanze position-absolute line-h"
                                style="bottom: -1px; right: -1px; font-size: 24px"
                            />
                            <div class="flex-center" style="width: 40px; height: 40px">
                                <i :class="[data.font_family, item.font_class]" style="font-size: 36px" />
                            </div>
                            <div class="line-clamp1">{{ item.name }}</div>
                        </div>
                    </el-col>
                </el-row>
            </keep-alive>
        </div>
        <div slot="footer">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import iconfont from '@/fonts/iconfont.json'
export default {
    components: {},
    props: {
        value: String, //回选用的
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            data: {},
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            dialogTableVisible: false,
            valueTemp: {},
            reload: true, //点击【重置】按钮时，让所有页面的状态都重置(包括已经搜索出来的内容)
            isCompatible: false //是否兼容1366px
        }
    },
    computed: {},
    watch: {
        dialogTableVisible: {
            handler(newValue, oldValue) {
                this.valueTemp = this.value
                if (!newValue) {
                    // 如果弹窗关闭了 则清除事件监听
                    window.removeEventListener('resize', this.compatibleChange)
                } else {
                    this.$nextTick(() => {
                        window.addEventListener('resize', this.compatibleChange)
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.data = this.$utils.object.deepClone(iconfont)
        this.data.glyphs = iconfont.glyphs.map(item => {
            return { font_class: iconfont.css_prefix_text + item.font_class, id: item.icon_id, name: item.name }
        })
    },
    created() {},
    methods: {
        showDialog() {
            //这个方法是父组件来引用的，不能删
            this.dialogTableVisible = true
        },
        // 重置
        resetForm() {
            this.valueTemp = ''
            this.reload = false
            setTimeout(() => {
                this.reload = true
            }, 100)
        },
        confirm() {
            this.dialogTableVisible = false
            this.$emit('input', this.valueTemp)
        },
        choice(item) {
            this.$set(this, 'valueTemp', item)
        },
        // 兼容1366px
        compatibleChange() {
            if (window.innerWidth <= 1366) {
                this.isCompatible = true
            } else {
                this.isCompatible = false
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.dialog-form.dialog-trim-url {
    max-height: 80vh;
    &.compatibleWidth {
        //兼容1366px下的弹窗最小宽度
        min-width: 60vw;
    }
}
</style>
