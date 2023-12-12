<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：图文导航)：navigation
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="mb-15 w-100">
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;背景颜色：</span>
                    <el-radio v-model="value.themeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                    </el-radio>
                    <el-radio v-model="value.themeColor" :label="true">主题色</el-radio>
                </div>
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;字体颜色：</span>
                    <el-radio v-model="value.fontThemeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.color" class="v-middle"></el-color-picker>
                    </el-radio>
                    <el-radio v-model="value.fontThemeColor" :label="true">主题色</el-radio>
                </div>
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;&emsp;&emsp;样式：</span>
                    <el-radio v-model="value.col" :label="3">每行三列</el-radio>
                    <el-radio v-model="value.col" :label="4">每行四列</el-radio>
                    <el-radio v-model="value.col" :label="5">每行五列</el-radio>
                </div>
                <div class="flex-start text-nowrap" :class="[value.row == 'none' ? '' : 'mb-15']">
                    <span class="pr-15">&emsp;排列方式：</span>
                    <el-radio v-model="value.row" :label="1">一行换页</el-radio>
                    <el-radio v-model="value.row" :label="2">两行换页</el-radio>
                    <el-radio v-model="value.row" :label="'none'">多次换行</el-radio>
                </div>
                <div
                    class="flex-start text-nowrap overflow-h transition-all05"
                    :class="[value.indicatorDots == 'none' ? '' : 'mb-10']"
                    :style="{ height: value.row == 'none' ? '0px' : '20px' }"
                >
                    <span class="pr-15">
                        <el-tooltip effect="dark" content="注意：当图文导航只有一页不用换页时，前端将会自动隐藏指示器" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                        </el-tooltip>
                        &nbsp;指示器：
                    </span>
                    <el-radio v-model="value.indicatorDots" :label="'default'">默认</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'dot'">圆点</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'round'">柱状</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'none'">关闭</el-radio>
                </div>
                <div
                    v-if="value.row != 'none'"
                    class="flex-start text-nowrap overflow-h transition-all05"
                    :style="{ height: value.indicatorDots == 'none' ? '0px' : '40px' }"
                >
                    <span class="pr-15">指示器颜色：</span>
                    <el-radio v-model="value.indicatorThemeColor" :label="true">主题色</el-radio>
                    <el-radio v-model="value.indicatorThemeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.indicatorColor" class="v-middle"></el-color-picker>
                    </el-radio>
                </div>
				<div
				  v-if="value.row != 'none'"
				  class="flex-start text-nowrap overflow-h transition-all05"
				  :style="{ height: value.indicatorDots == 'none' ? '0px' : '40px' }"
				>
				  <span class="pr-15">是否自动播放：</span>
				  <el-radio v-model="value.autoplay" :label="true">是</el-radio>
				  <el-radio v-model="value.autoplay" :label="false">否</el-radio>
				</div>
				
				<div class="flex-start mb-15">
				    <span class="pr-15">卡片样式：</span>
				    <el-switch v-model="value.cardType"></el-switch>
				</div>
            </div>
        </div>

        <!-- 轮播图： -->
        <div class="mb-20">图文导航（可拖动改变顺序）</div>
        <el-form ref="ruleForm" :model="value.data">
            <vuedraggable
                v-model="value.data.imgList"
                :options="{ group: 'data1', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.data.imgList"
                        :key="index + 1"
                        class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                    >
                        <div class="mb-20 w-100">
                            <div class="flex-start text-nowrap mb-15">
                                <el-form-item
                                    class="flex-start pl-10"
                                    label="标题："
                                    :prop="'imgList.' + index + '.title'"
                                    :rules="{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <div class="flex-1">
                                        <el-input
                                            v-model="item.title"
                                            placeholder="请输入内容"
                                            size="mini"
                                            clearable
                                            maxlength="5"
                                            show-word-limit
                                        ></el-input>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">标题颜色：</span>
                                <el-radio v-model="item.themeColor" :label="false">
                                    <span class="mr-10">自定义</span>
                                    <el-color-picker v-model="item.color" class="v-middle"></el-color-picker>
                                </el-radio>
                                <el-radio v-model="item.themeColor" :label="true">主题色</el-radio>
                            </div>
                            <div class="flex-start text-nowrap">
                                <el-form-item
                                    class="flex-start pl-10"
                                    label="图片："
                                    :prop="'imgList.' + index + '.img'"
                                    :rules="{ required: true, message: '图片不能为空', trigger: ['blur', 'change'] }"
                                >
                                    <imgCenter
                                        v-model="item.img"
                                        class="pr-15"
                                        :uploadStyle="{ width: '50px', height: '50px' }"
										:isPreview="false"
										@input="checkForm"
                                    ></imgCenter>
                                </el-form-item>
                                <el-tooltip effect="dark" content="建议尺寸:90*90px" placement="top-start">
                                    <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
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
                return defFloorVal.navigation
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
            let addData = this.$utils.object.deepClone(defFloorVal.navigation.data[flag][0])
			if (!this.value.data[flag]) this.$set(this.value.data, flag, []);//兼容旧数据专用，如果是旧数据里的data里没有该flag数组，下面的push会报错，所以在这里强行添加一个
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
