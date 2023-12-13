<template>
    <!-- /*
     * @Descripttion:右边编辑栏(其它组件：标题)：titleTab
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
                <span class="pr-15">显示图标：</span>
                <el-radio v-model="value.showIcon" :label="'none'">隐藏</el-radio>
                <el-radio v-model="value.showIcon" :label="'block'">色块</el-radio>
                <el-radio v-model="value.showIcon" :label="'diy'">
                    自定义
                    <div class="d-inline-block transition-all05 overflow-h v-middle" :style="{ width: `${value.showIcon == 'diy' ? '50px' : '0%'}` }">
                        <imgCenter
                            v-model="value.iconImg"
                            :upload-style="{ width: '40px', height: '40px' }"
                            :is-preview="false"
                            :show-close="false"
                        />
                    </div>
                    <el-tooltip v-if="value.showIcon == 'diy'" effect="dark" content="建议尺寸：60*60px" placement="top-start">
                        <i class="el-icon-question font-16 text-ccc main-hover"></i>
                    </el-tooltip>
                </el-radio>
            </div>
            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">&emsp;&emsp;样式：</span>
                <el-radio v-model="value.titleType" :label="1">样式一</el-radio>
                <el-radio v-model="value.titleType" :label="2">样式二</el-radio>
                <el-radio v-model="value.titleType" :label="3">样式三</el-radio>
            </div>
            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">显示圆角：</span>
                <el-radio v-model="value.radius" label="top">上圆角</el-radio>
                <el-radio v-model="value.radius" label="bottom">下圆角</el-radio>
                <el-radio v-model="value.radius" label="topAndBottom">上下圆角</el-radio>
                <el-radio v-model="value.radius" label="none">无</el-radio>
            </div>
            <div
                v-if="value.radius == 'top' || value.radius == 'bottom' || value.radius == 'topAndBottom'"
                class="flex-start text-nowrap mb-15 w-100"
            >
                <span class="pr-15">&emsp;圆角值：</span>
                <el-slider v-model="value.borderRadius" class="w-100" input-size="mini" :max="25" show-input></el-slider>
            </div>
            <div class="flex-start text-nowrap mb-15 w-100">
                <span class="pr-15">左右边距：</span>
                <el-slider v-model="value.paddingX" class="w-100" input-size="mini" :max="100" show-input></el-slider>
            </div>
        </div>
        <el-form ref="ruleForm" :model="value.data.title">
            <div class="border-dashed-ccc rounded-3 px-10 pt-20 pb-15 d-flex flex-wrap mb-20 position-relative">
                <div class="d-flex text-nowrap mb-15 w-100">
                    <div class="pt-5 mr-3 pr-15">
                        <span class="text-danger">*</span>
                        &nbsp;标题：
                    </div>
                    <div class="flex-1 overflow-h">
                        <div class="w-100 flex-start">
                            <el-form-item
                                class="flex-1 mr-10"
                                prop="title"
                                :rules="{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }"
                            >
                                <div class="w-100">
                                    <el-input
                                        v-model="value.data.title.title"
                                        placeholder="请输入内容"
                                        size="mini"
                                        clearable
                                        maxlength="6"
                                        show-word-limit
                                    ></el-input>
                                </div>
                            </el-form-item>
                            <span>颜色：</span>
                            <el-radio v-model="value.data.title.themeColor" class="mr-10" :label="false">
                                <span>自定义</span>
                                <el-color-picker v-model="value.data.title.color" class="v-middle"></el-color-picker>
                            </el-radio>
                            <el-radio v-model="value.data.title.themeColor" class="mr-0" :label="true">主题色</el-radio>
                        </div>
                        <div class="mt-15 d-flex">
                            <span class="pr-5">字体大小：</span>
                            <div class="flex-1">
                                <el-radio v-model="value.data.title.fontSize" class="mr-10" :label="16">大</el-radio>
                                <el-radio v-model="value.data.title.fontSize" class="mr-10" :label="14">中</el-radio>
                                <el-radio v-model="value.data.title.fontSize" class="mr-10" :label="12">小</el-radio>
                            </div>
                            <el-switch v-model="value.data.title.fontWeight" class="pl-15" active-text="加粗"></el-switch>
                        </div>
                    </div>
                </div>
                <div v-if="value.titleType == 3" class="flex-start text-nowrap">
                    <span class="pr-15">线颜色：</span>
                    <el-color-picker v-model="value.data.title.borderColor" class="v-middle" show-alpha></el-color-picker>
                </div>

                <template v-if="value.titleType == 1">
                    <div class="d-flex text-nowrap mb-15 w-100">
                        <div class="pt-5 pr-15">副标题：</div>
                        <div class="flex-1 overflow-h">
                            <div class="w-100 flex-start">
                                <div class="w-100">
                                    <el-input
                                        v-model="value.data.seTitle.title"
                                        placeholder="请输入内容"
                                        size="mini"
                                        clearable
                                        maxlength="10"
                                        show-word-limit
                                    ></el-input>
                                </div>
                                <span class="pl-10">颜色：</span>
                                <el-radio v-model="value.data.seTitle.themeColor" class="mr-10" :label="false">
                                    <span>自定义</span>
                                    <el-color-picker v-model="value.data.seTitle.color" class="v-middle"></el-color-picker>
                                </el-radio>
                                <el-radio v-model="value.data.seTitle.themeColor" class="mr-0" :label="true">主题色</el-radio>
                            </div>
                            <div class="mt-15 d-flex">
                                <span class="pr-15">字体大小：</span>
                                <div class="flex-1">
                                    <el-radio v-model="value.data.seTitle.fontSize" class="mr-10" :label="16">大</el-radio>
                                    <el-radio v-model="value.data.seTitle.fontSize" class="mr-10" :label="14">中</el-radio>
                                    <el-radio v-model="value.data.seTitle.fontSize" class="mr-10" :label="12">小</el-radio>
                                </div>
                                <el-switch v-model="value.data.seTitle.fontWeight" class="pl-15" active-text="加粗"></el-switch>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex text-nowrap mb-15 w-100">
                        <div class="pt-5 pr-15">&emsp;更多：</div>
                        <div class="flex-1 overflow-h">
                            <div class="w-100 flex-start">
                                <div class="w-100">
                                    <el-input
                                        v-model="value.data.more.title"
                                        placeholder="请输入内容"
                                        size="mini"
                                        clearable
                                        maxlength="6"
                                        show-word-limit
                                    ></el-input>
                                </div>
                                <span class="pl-10">颜色：</span>
                                <el-radio v-model="value.data.more.themeColor" class="mr-10" :label="false">
                                    <span>自定义</span>
                                    <el-color-picker v-model="value.data.more.color" class="v-middle"></el-color-picker>
                                </el-radio>
                                <el-radio v-model="value.data.more.themeColor" class="mr-0" :label="true">主题色</el-radio>
                            </div>
                            <div class="mt-15 d-flex">
                                <span class="pr-5">字体大小：</span>
                                <div class="flex-1">
                                    <el-radio v-model="value.data.more.fontSize" class="mr-10" :label="16">大</el-radio>
                                    <el-radio v-model="value.data.more.fontSize" class="mr-10" :label="14">中</el-radio>
                                    <el-radio v-model="value.data.more.fontSize" class="mr-10" :label="12">小</el-radio>
                                </div>
                                <el-switch v-model="value.data.more.fontWeight" class="pl-15" active-text="加粗"></el-switch>
                            </div>
                            <div v-if="value.data.more.title" class="flex-start text-nowrap mt-15">
                                <span class="mr-15">链接：</span>
                                <dialogUrl ref="dialog" v-model="value.data.more" :parmas="parmas" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </el-form>
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
import dialogUrl from '../../../components/dialogUrl/dialogUrl'
export default {
    components: { dialogUrl },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.titleTab
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
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
    margin-bottom: 0;
}
.border-dashed-ccc {
    ::v-deep .el-color-picker__trigger {
        width: 30px;
        height: 30px;
        margin-top: 5px;
    }
}
</style>
