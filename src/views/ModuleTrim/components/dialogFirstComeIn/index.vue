<template>
    <!-- /*
   * @Descripttion:如果是新增，则弹出dialog引导设置
  */ -->
    <!-- 引导设置 -->
    <el-dialog
        :title="stepName"
        custom-class="dialog-form"
        width="600px"
        append-to-body
        :visible.sync="ruleForm.isVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
        <!-- 备注：不能用v-if -->
        <el-form v-show="step == 1" ref="ruleForm" :model="ruleForm" @submit.native.prevent>
            <el-form-item
                class="flex-start"
                :label="`${value.category == 'POSTER'||value.category == 'POSTER-T' ? '海报' : '首页'}名称`"
                prop="name"
                :rules="{ required: true, message: `${value.category == 'POSTER'||value.category == 'POSTER-T' ? '海报' : '首页'}名称不能为空` }"
            >
                <el-input v-model="ruleForm.name" placeholder="请输入" size="small" clearable maxlength="10" show-word-limit />
            </el-form-item>
        </el-form>

        <!-- 商城主题色： -->
        <div v-show="step == 2" class="mb-30">
            <div class="pb-15 mall-set-theme" :style="{ '--settingBackground': value.themeColor }">
                <el-radio v-model="themeColorCustom" :label="false">推荐配色</el-radio>
                <el-radio v-model="themeColorCustom" :label="true">自定义配色</el-radio>
            </div>
            <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
                <div
                    v-for="(item, index) in themeColorDefault"
                    v-show="!themeColorCustom"
                    :key="index"
                    class="mr-20 mb-20 d-flex hover-scale1-2 rounded-2 overflow-h zoom-out0002"
                    :class="[item == value.themeColor ? 'shadow-lg scale11' : '']"
                    @click="changeThemeColor(item)"
                >
                    <div style="width: 18px; height: 18px" :style="{ backgroundColor: item }"></div>
                    <div style="width: 18px; height: 18px; opacity: 0.2" :style="{ backgroundColor: item }"></div>
                    <div class="border" style="width: 18px; height: 18px; background-color: white"></div>
                </div>
                <div v-show="themeColorCustom" class="mb-15 zoom-out0002"><el-color-picker v-model="value.themeColor"></el-color-picker></div>
            </div>
        </div>

        <!-- 背景色/背景图： -->
        <div v-show="step == 3" class="mb-30">
            <div class="pb-15">
                备注：
                <el-tooltip effect="dark" content="若同时上传了背景图和设置了背景色，则填充背景色，上面覆盖背景图" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
                <div class="mb-15 w-100 flex-start">
                    <div class="flex-1 flex-start">
                        <span class="pr-15">背景颜色：</span>
                        <el-color-picker v-model="value.backgroundColor" show-alpha></el-color-picker>
                    </div>
                    <div class="flex-1 flex-start">
                        <span class="pr-15">背景图片：</span>
                        <imgCenter
                            v-model="value.backgroundImg"
                            class="pr-15"
                            :uploadStyle="{ width: '80px', height: '80px' }"
                        ></imgCenter>
                        <el-tooltip effect="dark" content="建议尺寸：宽750px，默认置顶显示" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="source != 'pc'&&step == 4 && (value.category == 'INDEX'||value.category == 'INDEX-T')" class="mb-15 floor-head">
            <el-radio-group v-model="value.head.type" size="mini">
                <el-radio v-for="(item, index) in floorHead.botton" :key="index" border :label="item.flag" :disabled="item.disabled">
                    {{ item.name }}
                </el-radio>
            </el-radio-group>
        </div>

        <div slot="footer">
            <el-button v-if="step == 1" size="small" @click="$router.back()">返&emsp;回</el-button>
            <el-button v-if="step > 1" size="small" @click="clickStep('back')">上一步</el-button>
            <el-button type="primary" size="small" @click="clickStep('next')">下一步</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    components: { },
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        source: String //来源，pc和H5
    },
    data() {
        return {
            ruleForm: {
                name: '',
                isVisible: false
            },
            step: 1, //步骤

            themeColorCustom: false, //是否自定义商城主题色，默认false
            themeColorDefault: ['#e1251b', '#fd8cb0', '#FFD700', '#ff9000', '#bc9f5f', '#409EFF', '#29d7ce', '#11A983', '#5fc221', '#333333'], //预设的默认主题颜色

            floorHead: {
                title: '头部组件',
                botton: [
                    { name: '搜索+轮播图', flag: 'searchAndBanner' },
                    { name: '搜索+标签页', flag: 'searchAndTab' },
                    { name: '无', flag: 'none' }
                ]
            }
        }
    },
    computed: {
        stepName() {
            let title = ''
            if (this.step == 1) {
                title = this.value.category == 'POSTER'||this.value.category == 'POSTER-T' ? '请输入海报名称' : '请输入页面名称'
            }
            if (this.step == 2) {
                title = this.value.category == 'POSTER'||this.value.category == 'POSTER-T' ? '海报主题色' : '商城主题色'
            }
            if (this.step == 3) {
                title = '背景色/背景图(非必填)'
            }
            if (this.step == 4) {
                title = '头部显示设置'
            }
            return title
        }
    },
    watch: {},
    methods: {
        submitForm(formName) {
            return new Promise((resolve) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        console.log('error submit!!')
                        resolve(false)
                    }
                })
            })
        },
        showDialog() {
            this.ruleForm.isVisible = true
        },
        closeDialog() {
            this.ruleForm.isVisible = false
        },
        async clickStep(flag) {
            if (flag == 'back') {
                this.step--
            }
            if (flag == 'next') {
                if (this.step == 1) {
                    let result = await this.submitForm('ruleForm')
                    if (result) {
                        this.$emit('update:name', this.ruleForm.name)
                    } else {
                        return
                    }
                }
                this.step++
                if (this.step == 5) {
                    this.ruleForm.isVisible = false
                }
                if ((this.value.category == 'POSTER'||this.value.category == 'POSTER-T'||this.source == 'pc') && this.step == 4) {
                    this.ruleForm.isVisible = false
                }
            }
            this.$forceUpdate()
        },
        changeThemeColor(color) {
            this.value.themeColor = color
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__content {
    flex: 1;
}
::v-deep .el-dialog__body{
	overflow: unset!important;
}
::v-deep .mall-set-theme .el-radio__input.is-checked .el-radio__inner {
    border-color: var(--settingBackground);
    background: var(--settingBackground);
}
::v-deep .mall-set-theme .el-radio__input.is-checked + .el-radio__label {
    color: var(--settingBackground);
}
.floor-head {
    ::v-deep .el-radio {
        margin-right: 0;
        margin-left: 10px !important;
        padding-right: 10px;
    }
}
</style>
