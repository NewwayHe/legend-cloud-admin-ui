<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：动态广播)：noticeBar
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
            <div class="flex-start text-nowrap mb-15 span-15">
                <span class="pr-15">标题内容：</span>
                <el-input v-model="value.title" placeholder="请输入内容" size="mini" clearable maxlength="10" show-word-limit></el-input>
            </div>
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">标题颜色：</span>
                <el-radio v-model="value.titleThemeColor" :label="false">
                    <span class="mr-10">自定义</span>
                    <el-color-picker v-model="value.titleColor" class="v-middle"></el-color-picker>
                </el-radio>
                <el-radio v-model="value.titleThemeColor" :label="true">主题色</el-radio>
            </div>
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">内容颜色：</span>
                <el-color-picker v-model="value.contentColor" class="v-middle"></el-color-picker>
                <el-tooltip
                    class="ml-10"
                    effect="dark"
                    content="这里是指除标题以外的所有文字的颜色(假如下面的动态广播内容单独设置了字体颜色,将优先显示动态广播内容的字体颜色)"
                    placement="top-start"
                >
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
                <span class="pl-20 pr-5">圆角：</span>
                <el-switch v-model="value.borderRadius"></el-switch>
            </div>
            <div class="flex-start text-nowrap mt-15 w-100">
                <span class="pr-15">上下边距：</span>
                <el-slider v-model="value.paddingY" class="w-100" input-size="mini" :max="100" show-input></el-slider>
            </div>
            <div class="flex-start text-nowrap mt-15 w-100">
                <span class="pr-15">左右边距：</span>
                <el-slider v-model="value.paddingX" class="w-100" input-size="mini" :max="100" show-input></el-slider>
            </div>
        </div>

        <!-- 可拖拽的列表： -->
        <div class="mb-20">
            动态广播（可拖动改变顺序）
            <el-tooltip
                effect="dark"
                content="鼠标可以拖动方框进行排序,所设的标题如果超出了搜索框宽度,超出部分将会以滑动屏幕的形式出现"
                placement="top-start"
            >
                <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
            </el-tooltip>
        </div>
        <el-form ref="ruleForm" :model="value.data">
            <vuedraggable
                v-model="value.data.contentList"
                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.data.contentList"
                        :key="index + 1"
                        class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                    >
                        <div class="mb-15 w-100">
                            <div class="flex-start text-nowrap mb-15">
                                <el-form-item
                                    class="flex-start pl-10 w-100"
                                    label="标题："
                                    :prop="'contentList.' + index + '.title'"
                                    :rules="{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <el-input
                                        v-model="item.title"
                                        placeholder="请输入内容"
                                        size="mini"
                                        clearable
                                        maxlength="20"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                            </div>
                            <div class="flex-start text-nowrap">
                                <span class="pr-15">字体颜色：</span>
                                <el-color-picker v-model="item.color" class="v-middle"></el-color-picker>
                                <span class="pr-5 ml-15">上线：</span>
                                <el-switch v-model="item.show"></el-switch>
                                <span class="pl-15">链接：</span>
                                <dialogUrl ref="dialog" :key="index" v-model="value.data.contentList[index]" :parmas="parmas" />
                            </div>
                        </div>
                        <i
                            class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                            style="top: -12px; right: -12px"
                            @click.stop="del(index, 'contentList')"
                        ></i>
                    </div>
                </transition-group>
            </vuedraggable>
        </el-form>
        <el-button class="w-100 mb-20" type="primary" icon="el-icon-plus" size="small" plain @click.stop="add('contentList')">添加</el-button>
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
import vuedraggable from 'vuedraggable'
import dialogUrl from '../../../components/dialogUrl/dialogUrl'
export default {
    components: {
        vuedraggable,
        dialogUrl
    },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.noticeBar
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
    methods: {
        checkForm() {
            let result = []
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.validate((valid, valobj) => {
                    for (var key in valobj) {
                        result.push(valobj[key][0]) //将错误信息输出到一个数组里,如果数组有length就是校验不通过，如果result的length为0则校验通过
                    }
                })
            }
            return result
        },
        del(index, flag) {
            this.value.data[flag].splice(index, 1)
        },
        add(flag) {
            let addData = this.$utils.object.deepClone(defFloorVal.noticeBar.data[flag][0])
            addData.title = ''
            // console.log(addData)
            // console.log(this.value.data)
            if (!this.value.data[flag]) this.$set(this.value.data, flag, []) //兼容旧数据专用，如果是旧数据里的data里没有该flag数组，下面的push会报错，所以在这里强行添加一个
            this.value.data[flag].push(addData)
            this.$emit('add', flag)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.el-form-item {
    margin-bottom: unset;
    .el-form-item__content {
        line-height: 1;
        width: 100%;
    }
    label {
        font-weight: unset;
    }
}
</style>
