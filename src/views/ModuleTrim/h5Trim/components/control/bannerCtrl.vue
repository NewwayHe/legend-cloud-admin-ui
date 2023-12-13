<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：轮播图)：banner
    */ -->
    <div>
        <div class="font-14 text-center pb-30">
            {{ value.typeName }}
            <el-popover
                placement="top-start"
                title="备注"
                width="600"
                trigger="hover"
                content="如果第一个楼层为轮播图,则该轮播图会覆盖手机状态栏的位置。当[启用搜索栏]后，第一个轮播图禁止设置为纵向且宽度占屏幕的100%，高度自动变化，保持原图宽高比不变。"
            >
                <i slot="reference" class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
            </el-popover>
        </div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="mb-15 w-100">
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;图片高度：</span>
                    <el-slider v-model="value.height" class="w-100" input-size="mini" :max="1920" show-input></el-slider>
                </div>

                <!-- 该功能能用的，只是作用不大，先关闭 -->
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">&emsp;轮播模式：</span>
                    <el-radio-group v-model="value.cardType" size="mini" @change="change">
                        <el-radio-button label="0">默认</el-radio-button>
                        <el-radio-button label="1">卡片式</el-radio-button>
                        <el-radio-button label="2">堆叠式</el-radio-button>
                    </el-radio-group>
                    <el-tooltip
                        class="ml-10"
                        effect="dark"
                        content="注意：开启卡片模式后，原来图片的建议尺寸将会改变，请根据实际情况剪裁图片。卡片式和堆叠式建议上传三张以上的轮播图，卡片式和堆叠式以手机端显示效果为准"
                        placement="top-start"
                    >
                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                    </el-tooltip>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">&emsp;&emsp;加圆角：</span>
                    <el-switch v-model="value.borderRadius"></el-switch>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">&emsp;自动播放：</span>
                    <el-switch v-model="value.autoplay"></el-switch>
                </div>

                <!-- 该功能能用的，只是作用不大，先关闭 -->
                <div class="flex-start text-nowrap" :class="[value.autoplay ? 'animation-15px-show' : 'animation-15px-close']">
                    <span class="pr-15">&emsp;播放时间：</span>
                    <el-radio v-model="value.interval" :label="2000">2秒</el-radio>
                    <el-radio v-model="value.interval" :label="5000">5秒</el-radio>
                    <el-radio v-model="value.interval" :label="8000">
                        8秒
                        <el-tooltip effect="dark" content="备注：将自动播放关闭再打开，才会刷新播放时间" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                        </el-tooltip>
                    </el-radio>
                </div>
                <div class="flex-start text-nowrap overflow-h transition-all05" :style="{ height: value.cardType == '0' ? '0px' : '40px' }">
                    <span class="pr-15">卡片宽度(%)：</span>
                    <el-slider v-model="value.cardWidth" class="w-100" input-size="mini" :min="50" :max="100" show-input></el-slider>
                </div>

                <!-- 该功能能用的，只是作用不大，先关闭 -->
                <!-- <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">循环显示：</span>
                    <el-radio v-model="value.loop" :label="true">开启</el-radio>
                    <el-radio v-model="value.loop" :label="false">关闭</el-radio>
                </div> -->
                <div class="flex-start mb-15 text-nowrap overflow-h transition-all05" :style="{ height: value.cardType == '0' ? '40px' : '0px' }">
                    <span class="pr-15">&emsp;播放方向：</span>
                    <el-radio v-model="value.vertical" :label="false">横向</el-radio>
                    <el-radio v-model="value.vertical" :label="true">纵向</el-radio>
                </div>

                <div class="d-flex a-start text-nowrap">
                    <span class="pr-15">&emsp;&emsp;指示器：</span>
                    <div class="text-wrap">
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'default'">默认</el-radio>
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'dot'">圆点</el-radio>
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'round'">柱状</el-radio>
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'nav'">导航</el-radio>
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'indexes'">数字</el-radio>
                        <el-radio v-model="value.indicatorDots" class="mb-20" :label="'none'">关闭</el-radio>
                    </div>
                </div>
                <div
                    class="overflow-h transition-all05"
                    :style="{
                        height: value.indicatorDots == 'none' ? '0px' : value.indicatorDots == 'nav' || value.cardType != '0' ? '40px' : '95px'
                    }"
                >
                    <div class="flex-start text-nowrap">
                        <span class="pr-15">指示器颜色：</span>
                        <el-radio v-model="value.indicatorThemeColor" :label="true">主题色</el-radio>
                        <el-radio v-model="value.indicatorThemeColor" :label="false">
                            <span class="mr-10">自定义</span>
                            <el-color-picker v-model="value.indicatorColor" class="v-middle"></el-color-picker>
                        </el-radio>
                        <el-tooltip effect="dark" content="注意：当轮播图只有一张图片时，前端将会自动隐藏指示器" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                        </el-tooltip>
                    </div>

                    <div class="flex-start mt-15 text-nowrap">
                        <span class="pr-15">指示器位置：</span>
                        <el-radio-group v-model="value.indicatorPosition" size="mini">
                            <el-radio-button label="up-left">上左</el-radio-button>
                            <el-radio-button label="up-right">上右</el-radio-button>
                            <el-radio-button label="down-left">下左</el-radio-button>
                            <el-radio-button label="down-mid">下中</el-radio-button>
                            <el-radio-button label="down-right">下右</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
            </div>
        </div>

        <!-- 轮播图： -->
        <div class="mb-20">轮播图（可拖动改变顺序）</div>
        <el-form ref="ruleForm" :model="value.data">
            <vuedraggable
                v-model="value.data.imgList"
                :options="{ group: 'data1', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.data.imgList"
                        :key="index + '1'"
                        class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                    >
                        <div class="mb-20 w-100">
                            <div class="flex-start text-nowrap" :class="[value.indicatorDots == 'nav' ? 'mb-15' : '']">
                                <el-form-item
                                    class="flex-start"
                                    label="图片："
                                    :prop="'imgList.' + index + '.img'"
                                    :rules="{ required: true, message: '图片不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <imgCenter
                                        :key="index"
                                        v-model="item.img"
                                        class="pr-15"
                                        :upload-style="{ width: '80px', height: '80px' }"
                                        :is-preview="false"
                                        @input="checkForm"
                                    ></imgCenter>
                                </el-form-item>
                                <el-popover
                                    placement="top-start"
                                    title="备注"
                                    width="600"
                                    trigger="hover"
                                    :content="`建议图片尺寸：${
                                        value.cardType == '0'
                                            ? 750
                                            : value.cardType == '1'
                                            ? ((750 * value.cardWidth) / 100).toFixed(0)
                                            : (((750 - 40) * value.cardWidth) / 100).toFixed(0)
                                    }*${value.cardType == '2' ? (value.height - 20) * 2 : value.height * 2}px`"
                                >
                                    <i slot="reference" class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-popover>
                                <span class="pl-15">链接：</span>
                                <dialogUrl :key="index" v-model="value.data.imgList[index]" :parmas="parmas" />
                            </div>
                            <div v-if="value.indicatorDots == 'nav'" class="flex-start text-nowrap">
                                <span class="pr-15">导航文字：</span>
                                <div class="pl-10 flex-1">
                                    <el-input v-model="item.content" placeholder="请输入内容" size="small " clearable maxlength="100"></el-input>
                                </div>
                            </div>
                        </div>
                        <i
                            class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                            style="top: -12px; right: -12px"
                            @click.stop="del(index, 'imgList')"
                        ></i>
                    </div>
                </transition-group>
            </vuedraggable>
        </el-form>
        <el-button class="w-100 mb-20" type="primary" icon="el-icon-plus" size="small" plain @click.stop="add('imgList')">添加</el-button>
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
                return defFloorVal.banner
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
                        let mes = valobj[key][0] //{field: "advertImg.0.img",message: "图片不能为空"}
                        if (mes.field.indexOf('imgList') != -1) {
                            mes['fieldName'] = '轮播图'
                        }
                        result.push(mes) //将错误信息输出到一个数组里,如果数组有length就是校验不通过，如果result的length为0则校验通过
                    }
                })
            }
            return result
        },
        del(index, flag) {
            this.value.data[flag].splice(index, 1)
        },
        add(flag) {
            let addData = this.$utils.object.deepClone(defFloorVal.banner.data[flag][0])
            if (!this.value.data[flag]) this.$set(this.value.data, flag, []) //兼容旧数据专用，如果是旧数据里的data里没有该flag数组，下面的push会报错，所以在这里强行添加一个
            this.value.data[flag].push(addData)
            this.$emit('add', flag)
        },
        change(e) {
            if (e != '0') {
                this.value.vertical = false
                this.value.indicatorPosition = 'down-mid'
            }
            this.$forceUpdate()
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
// 自动藏起来动画
.animation-15px-show {
    transition: all 0.5s;
    overflow: hidden;
    height: 15px;
    margin-bottom: 15px;
    transform: translateY(0px);
}
.animation-15px-close {
    transition: all 0.5s;
    overflow: hidden;
    height: 0px;
    margin-bottom: 0px;
    transform: translateY(-15px);
}
</style>
