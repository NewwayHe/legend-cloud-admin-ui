<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：商品列表)：prodList
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 mb-20">
            <div class="flex-start text-nowrap mb-15">
                <span class="pr-15">背景颜色：</span>
                <el-radio v-model="value.themeColor" :label="false">
                    <span class="mr-10">自定义</span>
                    <el-color-picker v-model="value.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                </el-radio>
                <el-radio v-model="value.themeColor" :label="true">主题色</el-radio>
            </div>
            <div class="d-flex a-start mb-15 text-nowrap">
                <span class="pr-15">列表样式：</span>
                <el-radio-group v-model="value.listType" size="mini" @change="changeListType">
                    <el-radio-button label="1">详细列表</el-radio-button>
                    <el-radio-button label="2">小图两列</el-radio-button>
                    <el-radio-button label="3">小图三列</el-radio-button>
                    <el-radio-button label="4">小图四列</el-radio-button>
                </el-radio-group>
            </div>
            <div class="flex-start mb-15 text-nowrap transition-all05 overflow-h" :style="{ height: value.listType == 1 ? '0px' : '40px' }">
                <span class="pr-15">商品换行：</span>
                <el-switch v-model="value.wrap"></el-switch>
                <el-tooltip class="ml-10" effect="dark" content="备注:开启商品换行后，商品将在一行内显示，超出部分滑动屏幕显示" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">卡片样式：</span>
                <el-switch v-model="value.cardType"></el-switch>
            </div>

            <div class="flex-start mb-15 text-nowrap">
                <span class="pr-15">商品名称：</span>
                <el-switch v-model="value.showSpuName"></el-switch>
                <span class="pl-30">商品价格：</span>
                <el-switch v-model="value.showPrice" @change="changeShowPrice"></el-switch>
                <el-tooltip effect="dark" content="备注：当关闭[商品价格]时，[购物车]图标会自动关闭" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
                <!-- (由于点击是不会进入购物车的，应客户要求屏蔽掉) -->
                <!-- <span class="pl-30">&emsp;购物车：</span>
                <el-switch v-model="value.showShopCart" :disabled="value.listType == '4' || !value.showPrice"></el-switch> -->
            </div>

            <div class="d-flex flex-wrap mb-15 text-nowrap">
                <span class="pr-15">&emsp;&emsp;角标：</span>
                <div class="flex-1">
                    <div>
                        <el-radio v-model="value.showIcon" :label="'none'">隐藏</el-radio>
                        <el-radio v-model="value.showIcon" :label="'new'">新品</el-radio>
                        <el-radio v-model="value.showIcon" :label="'hot'">热卖</el-radio>
                        <el-radio v-model="value.showIcon" :label="'diy'">自定义</el-radio>
                    </div>
                    <div class="transition-all05 overflow-h" :style="{ height: `${value.showIcon == 'diy' ? '60px' : '0px'}` }">
                        <div class="mt-15 flex-start">
                            <imgCenter
                                v-model="value.iconImg"
                                class="pr-15"
                                :upload-style="{ width: '40px', height: '40px' }"
                                :is-preview="false"
                            ></imgCenter>
                            <el-tooltip effect="dark" content="建议尺寸：60*60px" placement="top-start">
                                <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-wrap pb-15 text-nowrap">
                <span class="pr-15">商品来源：</span>
                <div class="flex-1 overflow-h">
                    <div>
                        <el-radio v-model="value.sourceType" :label="'goods'">手动选择</el-radio>
                        <el-radio v-model="value.sourceType" :label="'category'">关联分类</el-radio>
                        <el-radio v-model="value.sourceType" :label="'prodGroup'">关联分组</el-radio>
                    </div>

                    <div v-if="value.sourceType == 'goods'" class="mt-15 flex-start">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="showDialog('商品')">新增</el-button>
                        <span class="flex-1 pl-10 text-wrap">
                            (可拖动改变顺序)
                            <el-tooltip
                                effect="dark"
                                content="备注:可点击下面商品的图片来自定义商品图片,自定义的图片在左上角会有“自定义”的标识"
                                placement="top-start"
                            >
                                <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                            </el-tooltip>
                        </span>
                    </div>
                    <div v-if="value.sourceType == 'category'" class="mt-15 flex-start">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="showDialog('商品分类')">
                            {{ value.data.categoryData.id ? `已选择：${value.data.categoryData.name}` : '请选择商品分类' }}
                        </el-button>
                        <span class="flex-1 pl-10 text-wrap">
                            自动展示该分类下的前
                            <span class="text-danger">{{ value.maxNum }}</span>
                            个商品
                        </span>
                    </div>
                    <div v-if="value.sourceType == 'prodGroup'" class="mt-15 flex-start">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="showDialog('商品分组')">
                            {{ value.data.prodGroupData.id ? `已选择：${value.data.prodGroupData.name}` : '请选择商品分组' }}
                        </el-button>
                        <span class="flex-1 pl-10 text-wrap">
                            自动展示该分组下的前
                            <span class="text-danger">{{ value.maxNum }}</span>
                            个商品
                        </span>
                    </div>
                </div>
            </div>
            <vuedraggable
                v-if="value.sourceType == 'goods'"
                v-model="value.data.goodsList"
                class="text-wrap ml-15"
                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group class="d-flex flex-wrap">
                    <div v-for="(item, index) in value.data.goodsList" :key="index + 1" class="d-inline-block">
                        <div class="mr-15 mb-10 rounded-3 hover-current hover-border position-relative" style="height: 80px; width: 80px">
                            <!-- <img class="w-100 h-100" :src="$photoServer + item.pic" alt="" v-if="item.pic"> -->
                            <imgCenter
                                v-model="item.pic"
                                :upload-style="{ width: '80px', height: '80px', margin: '0' }"
                                :is-preview="false"
                                :show-close="false"
                                @afterChoose="onSuccess(item)"
                            ></imgCenter>
                            <span
                                v-if="item.siteName"
                                class="w-100 position-absolute bottom-0 left-0 px-5 overflow-h text-nowrap text-center text-white"
                                style="height: 20px; background-color: rgba(0, 0, 0, 0.5)"
                            >
                                {{ item.siteName }}
                            </span>
                            <i
                                class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                                style="top: -12px; right: -12px"
                                @click.stop="del(index, 'goodsList')"
                            ></i>
                            <i
                                v-if="item.diyPic"
                                class="iconfont icon-zidingyi position-absolute font-32 left-0"
                                :style="{ color: parmas.themeColor, top: `-7px` }"
                            />
                        </div>
                    </div>
                </transition-group>
            </vuedraggable>
            <div v-if="value.sourceType == 'category' || value.sourceType == 'prodGroup'" class="flex-start text-nowrap w-100 pb-15">
                <span class="pr-15">商品数量：</span>
                <el-slider v-model="value.maxNum" class="w-100" :step="2" input-size="mini" :min="2" :max="100" show-input></el-slider>
            </div>
        </div>

        <!-- 链接弹框组件 -->
        <dialog-url ref="dialog" v-model="value.data" :parmas="parmas" :tab="tab" :field="field" />
        <dialog-url-multiple ref="dialogMultiple" v-model="value.data.goodsList" :parmas="parmas" :tab="tab" />
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
import vuedraggable from 'vuedraggable'
import dialogUrl from '../../../components/dialogUrl'
import dialogUrlMultiple from '../../../components/dialogUrlMultiple'
export default {
    components: { vuedraggable, 'dialog-url': dialogUrl, 'dialog-url-multiple': dialogUrlMultiple },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.prodList
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
            tab: [],
            field: ''
        }
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        del(index, flag) {
            this.value.data[flag].splice(index, 1)
        },
        add(flag) {
            let addData = this.$utils.object.deepClone(defFloorVal.prodList.data[flag][0])
            if (!this.value.data[flag]) this.$set(this.value.data, flag, []) //兼容旧数据专用，如果是旧数据里的data里没有该flag数组，下面的push会报错，所以在这里强行添加一个
            this.value.data[flag].push(addData)
            this.$emit('add', flag)
        },
        showDialog(type) {
            this.tab = [type]
            if (type == '商品') {
                this.$refs.dialogMultiple.showDialog() //多选的dialog
            }
            if (type == '商品分组') {
                this.$refs.dialog.showDialog() //单选的dialog
                this.field = 'prodGroupData'
            }
            if (type == '商品分类') {
                this.$refs.dialog.showDialog() //单选的dialog
                this.field = 'categoryData'
            }
        },
        onSuccess(item) {
            item['diyPic'] = true
        },
        changeListType(e) {
            // if (e == '4') {
            //     this.value.showShopCart = false
            // }
            this.$forceUpdate()
        },
        changeShowPrice(e) {
            // if (!e) {
            //     this.value.showShopCart = false
            // }
            this.$forceUpdate()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .lsUpload {
    .ml-5 {
        margin-left: 0px;
    }
}
</style>
