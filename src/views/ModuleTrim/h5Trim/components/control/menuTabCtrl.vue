<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：菜单)：menuTab
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
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">字体颜色：</span>
                <el-radio v-model="value.fontThemeColor" :label="false">
                    <span class="mr-10">自定义</span>
                    <el-color-picker v-model="value.color" class="v-middle"></el-color-picker>
                </el-radio>
                <el-radio v-model="value.fontThemeColor" :label="true">主题色</el-radio>
            </div>

            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">排列方式：</span>
                <el-radio-group v-model="value.position" size="mini">
                    <el-radio-button label="start">左对齐</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="around">等距</el-radio-button>
                    <el-radio-button label="between">左右对齐</el-radio-button>
                    <el-radio-button label="end">右对齐</el-radio-button>
                </el-radio-group>
                <el-tooltip class="ml-5" effect="dark" content="备注：[等距]和[左右对齐]不支持[分割线]" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <div
                class="flex-start mb-15 text-nowrap overflow-h transition-all05"
                :style="{ height: value.position == 'around' || value.position == 'between' ? '0px' : '40px' }"
            >
                <span class="pr-15">&emsp;分割线：</span>
                <el-switch v-model="value.assistLine" class="pr-10"></el-switch>
                <div class="flex-1">
                    <div class="flex-start transition-all05 overflow-h" :style="{ width: `${value.assistLine ? '100%' : '0%'}` }">
                        <span class="pl-15 pr-5">颜色：</span>
                        <el-radio v-model="value.bdThemeColor" :label="false">
                            <span class="mr-10">自定义</span>
                            <el-color-picker v-model="value.borderColor" class="v-middle" show-alpha></el-color-picker>
                        </el-radio>
                        <el-radio v-model="value.bdThemeColor" :label="true">主题色</el-radio>
                    </div>
                </div>
            </div>
        </div>

        <!-- 可拖拽的列表： -->
        <div class="mb-20">
            菜单（可拖动改变顺序）
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
                v-model="value.data.titleList"
                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.data.titleList"
                        :key="index + '1'"
                        class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                    >
                        <div class="mb-15 w-100">
                            <div class="flex-start text-nowrap mb-15">
                                <el-form-item
                                    class="flex-start pl-10"
                                    label="标题："
                                    :prop="'titleList.' + index + '.title'"
                                    :rules="{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <div class="flex-1">
                                        <el-input
                                            v-model="item.title"
                                            placeholder="请输入内容"
                                            size="mini"
                                            clearable
                                            maxlength="10"
                                            show-word-limit
                                        ></el-input>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">字体颜色：</span>
                                <el-radio v-model="item.themeColor" :label="false">
                                    <span class="mr-10">自定义</span>
                                    <el-color-picker v-model="item.color" class="v-middle"></el-color-picker>
                                </el-radio>
                                <el-radio v-model="item.themeColor" :label="true">主题色</el-radio>
                            </div>
                            <div class="flex-start text-nowrap">
                                <span class="pr-15">&emsp;&emsp;图标：</span>
                                <imgCenter
                                    v-model="item.img"
                                    class="pr-15"
                                    :upload-style="{ width: '35px', height: '35px' }"
                                    :is-preview="false"
                                ></imgCenter>
                                <el-tooltip effect="dark" content="该项为非必填，建议尺寸：20*20px" placement="top-start">
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                                <span class="pl-15">链接：</span>
                                <dialogUrl ref="dialog" :key="index" v-model="value.data.titleList[index]" :parmas="parmas" />
                            </div>
                        </div>
                        <i
                            class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                            style="top: -12px; right: -12px"
                            @click.stop="del(index, 'titleList')"
                        ></i>
                    </div>
                </transition-group>
            </vuedraggable>
        </el-form>
        <el-button class="w-100 mb-20" type="primary" icon="el-icon-plus" size="small" plain @click.stop="add('titleList')">添加</el-button>
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
                return defFloorVal.menuTab
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
            let addData = this.$utils.object.deepClone(defFloorVal.menuTab.data[flag][0])
            addData.title = ''
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
    }
    label {
        font-weight: unset;
    }
}
</style>
