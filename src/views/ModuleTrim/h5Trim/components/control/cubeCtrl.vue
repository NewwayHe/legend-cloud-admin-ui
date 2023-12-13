<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：魔方)：cube
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="d-flex a-start text-nowrap">
                <span class="pr-15">魔方样式：</span>
                <div class="text-wrap">
                    <el-radio v-for="(item, index) in cubeTypeList" :key="index" v-model="value.cubeType" class="mb-20" :label="item.value">
                        {{ item.title }}
                    </el-radio>
                </div>
            </div>
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">卡片模式：</span>
                <el-radio v-model="value.cardType" :label="false">关闭</el-radio>
                <el-radio v-model="value.cardType" :label="true">开启</el-radio>
                <el-tooltip effect="dark" content="注意：开启卡片模式后，原来图片的建议尺寸将会改变，请根据实际情况剪裁图片" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <div class="flex-start text-nowrap mb-15 w-100">
                <div class="flex-1 flex-start">
                    <span class="pr-15">背景颜色：</span>
                    <el-color-picker v-model="value.backgroundColor" show-alpha></el-color-picker>
                </div>
                <div class="flex-1 flex-start">
                    <span class="pr-15">背景图片：</span>
                    <imgCenter v-model="value.backgroundImg" class="pr-15" :upload-style="{ width: '40px', height: '40px' }"></imgCenter>
                    <el-tooltip
                        effect="dark"
                        content="建议尺寸：宽750px，默认置顶显示。tips：广告图可以上传半透明度的图片,就能让背景图显示出来"
                        placement="top-start"
                    >
                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="flex-start text-nowrap w-100 mb-15">
                <span class="pr-15">魔方高度：</span>
                <el-slider v-model="value.height" class="w-100" input-size="mini" :max="1920" show-input></el-slider>
            </div>
        </div>

        <!-- 广告图： -->
        <div class="mb-20">广告图（可拖动改变顺序）</div>
        <el-form ref="ruleForm" :model="value.data">
            <vuedraggable
                v-model="value.data.imgList"
                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.data.imgList"
                        :key="index + 1"
                        class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                    >
                        <div class="mb-20 w-100">
                            <div class="flex-start text-nowrap">
                                <el-form-item
                                    class="flex-start"
                                    label="图片："
                                    :prop="'imgList.' + index + '.img'"
                                    :rules="{ required: true, message: '图片不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <imgCenter
                                        v-model="item.img"
                                        class="pr-15"
                                        :upload-style="{ width: '80px', height: '80px' }"
                                        :is-preview="false"
                                        @input="checkForm"
                                    ></imgCenter>
                                </el-form-item>
                                <el-tooltip
                                    effect="dark"
                                    :content="`必填项，建议尺寸：
                                        ${
                                            value.cubeType == '1-2' && index == 0
                                                ? `${value.cardType ? 345 : 375}*${value.cardType ? (value.height - 20) * 2 : value.height * 2}`
                                                : value.cubeType == '1-2' && index != 0
                                                ? `${value.cardType ? 345 : 375}*${value.cardType ? value.height - 30 : value.height}`
                                                : value.cubeType == '1*2'
                                                ? `${value.cardType ? 345 : 375}*${value.cardType ? (value.height - 20) * 2 : value.height * 2}`
                                                : value.cubeType == '1*3'
                                                ? `${value.cardType ? 223 : 250}*${value.cardType ? (value.height - 20) * 2 : value.height * 2}`
                                                : value.cubeType == '1*4'
                                                ? `${value.cardType ? 162.5 : 187.5}*${value.cardType ? (value.height - 20) * 2 : value.height * 2}`
                                                : value.cubeType == '2*2'
                                                ? `${value.cardType ? 345 : 375}*${value.cardType ? value.height - 30 : value.height}`
                                                : value.cubeType == '2*3'
                                                ? `${value.cardType ? 223 : 250}*${value.cardType ? value.height - 30 : value.height}`
                                                : ''
                                        }px`"
                                    placement="top-start"
                                >
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                                <span class="pl-15">链接：</span>
                                <dialogUrl ref="dialog" :key="index" v-model="value.data.imgList[index]" :parmas="parmas" />
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
        <el-button
            v-if="value.data.imgList.length < cubeTypeNum[value.cubeType]"
            class="w-100 mb-20"
            type="primary"
            icon="el-icon-plus"
            size="small"
            plain
            @click.stop="add('imgList')"
        >
            添加
        </el-button>
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
                return defFloorVal.cube
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
            cubeTypeList: [
                {
                    value: '1-2',
                    title: '1左2右',
                    num: 3
                },
                {
                    value: '1*2',
                    title: '1行2列',
                    num: 2
                },
                {
                    value: '1*3',
                    title: '1行3列',
                    num: 3
                },
                {
                    value: '1*4',
                    title: '1行4列',
                    num: 4
                },
                {
                    value: '2*2',
                    title: '2行2列',
                    num: 4
                },
                {
                    value: '2*3',
                    title: '2行3列',
                    num: 6
                }
            ],
            cubeTypeNum: { '1-2': 3, '1*2': 2, '1*3': 3, '1*4': 4, '2*2': 4, '2*3': 6 },
            cubeTypeHeight: { '1-2': 375, '1*2': 187.5, '1*3': 125, '1*4': 93.75, '2*2': 375, '2*3': 250 }
        }
    },
    computed: {},
    watch: {
        'value.cubeType': {
            handler(newValue, oldValue) {
                if (newValue) {
                    //点击魔方样式时让魔方有自己相对应的默认高度，这个如果是编辑的话会影响体验，先屏蔽
                    let num = this.value.data.imgList.length - this.cubeTypeNum[newValue]
                    if (num > 0) {
                        this.value.data.imgList.splice(this.cubeTypeNum[newValue], num)
                    }
                    if (num < 0) {
                        for (var i = 0; i < -num; i++) {
                            let addData = { img: '', url: '' }
                            this.value.data.imgList.push(addData)
                        }
                    }
                    // this.value.height = this.cubeTypeHeight[newValue]
                }
            },
            deep: true
            // immediate: true//这个不能开，如果开了，点击魔方编辑时，会就将魔方的高度还原回cubeTypeHeight里的默认值
        }
    },
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
                            mes['fieldName'] = '广告图'
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
            let addData = this.$utils.object.deepClone(defFloorVal.cube.data[flag][0])
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
