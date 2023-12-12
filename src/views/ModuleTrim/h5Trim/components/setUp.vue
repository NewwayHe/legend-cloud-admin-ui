<template>
    <!-- /*
     * @Descripttion:右边编辑栏(功能配置)
    */ -->
    <!-- 右边编辑栏(功能配置) -->
    <div>
        <div class="font-16 text-center pb-30">功能配置</div>

        <!-- 悬浮按钮： -->
        <div class="mb-20">
            <div class="pb-15">悬浮按钮：</div>
            <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
                <div class="flex-start w-100 mb-15 text-nowrap">
                    <span class="pr-15">启用按钮：</span>
                    <el-switch v-model="value.suspendBut.show" class="pr-10"></el-switch>
                    <el-tooltip effect="dark" content="备注：勾选后，悬浮按钮将在装修页面中显示" placement="top-start">
                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                    </el-tooltip>
                </div>
                <div class="w-100" :class="[value.suspendBut.show ? 'animation-180px-show' : 'animation-close']">
                    <div class="flex-start mb-15 text-nowrap">
                        <span class="pr-15">背景颜色：</span>
                        <el-radio v-model="value.suspendBut.themeColor" :label="true">主题色</el-radio>
                        <el-radio v-model="value.suspendBut.themeColor" :label="false">
                            <span class="mr-10">自定义</span>
                            <el-color-picker v-model="value.suspendBut.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                        </el-radio>
                    </div>

                    <div class="flex-start mb-15 text-nowrap">
                        <span class="pr-15">吸附位置：</span>
                        <el-radio v-model="value.suspendBut.position" :label="'left'">左边</el-radio>
                        <el-radio v-model="value.suspendBut.position" :label="'right'">右边</el-radio>
                    </div>

                    <div class="flex-start text-nowrap mb-15">
                        <span class="pr-15">距底高度：</span>
                        <el-slider v-model="value.suspendBut.offsetBottom" class="w-100" input-size="mini" :max="500" show-input></el-slider>
                    </div>
                    <div class="flex-start text-nowrap">
                        <span class="pr-15">&emsp;&emsp;图标：</span>
                        <imgCenter
                            v-model="value.suspendBut.img"
                            class="pr-15"
                            :uploadStyle="{ width: '35px', height: '35px' }"
                            :isPreview="false"
                        ></imgCenter>
                        <el-tooltip effect="dark" content="必填，建议尺寸：40*40px" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                        </el-tooltip>
                        <span class="pl-15">链接：</span>
						<dialogUrl v-model="value.suspendBut" :parmas="value" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dialogUrl from '../../components/dialogUrl/dialogUrl'
export default {
    components: { dialogUrl },
    filters: {},
    props: {
        value: {
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
::v-deep .el-radio {
    margin-right: 0;
    margin-left: 5px !important;
    padding-right: 10px;
}
// 自动藏起来动画
.animation-90px-show {
    transition: all 0.5s;
    overflow: hidden;
    height: 90px;
    margin-bottom: 15px;
    transform: translateY(0px);
}
.animation-180px-show {
    transition: all 0.5s;
    overflow: hidden;
    height: 180px;
    margin-bottom: 15px;
    transform: translateY(0px);
}
.animation-close {
    transition: all 0.5s;
    overflow: hidden;
    height: 0px;
    margin-bottom: 0px;
    transform: translateY(-20px);
}
</style>
