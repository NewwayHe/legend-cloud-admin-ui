<template>
    <!-- /*
     * @Descripttion:右边编辑栏(楼层组件：TAB导航)：navigationTab
    */ -->
    <div>
        <div class="font-14 text-center pb-30">{{ value.typeName }}</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="mb-15 w-100">
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;&emsp;背景颜色：</span>
                    <el-radio v-model="value.themeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.backgroundColor" class="v-middle" show-alpha></el-color-picker>
                    </el-radio>
                    <el-radio v-model="value.themeColor" :label="true">主题色</el-radio>
                </div>
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;标题字体色：</span>
                    <el-radio v-model="value.fontThemeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.color" class="v-middle"></el-color-picker>
                    </el-radio>
                    <el-radio v-model="value.fontThemeColor" :label="true">主题色</el-radio>
                </div>
                <div class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;&emsp;&emsp;&emsp;样式：</span>
                    <el-radio v-model="value.col" :label="3">每行三列</el-radio>
                    <el-radio v-model="value.col" :label="4">每行四列</el-radio>
                    <el-radio v-model="value.col" :label="5">每行五列</el-radio>
                </div>
                <!-- <div class="flex-start text-nowrap overflow-h transition-all05" :class="[value.indicatorDots == 'none' ? '' : 'mb-15']">
                    <span class="pr-15">&emsp;&emsp;指示器：</span>
                    <el-radio v-model="value.indicatorDots" :label="'default'">默认</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'dot'">圆点</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'round'">柱状</el-radio>
                    <el-radio v-model="value.indicatorDots" :label="'none'">关闭</el-radio>
                </div> -->
                <!-- <div class="flex-start text-nowrap overflow-h transition-all05" :style="{ height: value.indicatorDots == 'none' ? '0px' : '40px' }" v-if="value.row != 'none'">
                    <span class="pr-15">指示器颜色：</span>
                    <el-radio v-model="value.indicatorThemeColor" :label="true">主题色</el-radio>
                    <el-radio v-model="value.indicatorThemeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker class="v-middle" v-model="value.indicatorColor"></el-color-picker>
                    </el-radio>
                </div> -->
            </div>
        </div>
        <!-- 头部菜单设置 -->
        <div class="mb-20">头部菜单设置</div>
        <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
            <div class="mb-15 w-100">
                <div class="flex-start w-100 mb-15 text-nowrap">
                    <span class="pr-15">&emsp;&emsp;启用菜单：</span>
                    <el-switch v-model="value.tabsShow" class="pr-10"></el-switch>
                </div>
                <div class="overflow-h transition-all05" :style="{ height: value.tabsShow ? '236px' : '0px' }">
                    <div class="flex-start text-nowrap mb-15">
                        <span class="pr-15">&emsp;&emsp;背景颜色：</span>
                        <el-radio v-model="value.tabBgThemeColor" :label="false">
                            <span class="mr-10">自定义</span>
                            <el-color-picker v-model="value.tabBgColor" class="v-middle" show-alpha></el-color-picker>
                            <el-tooltip
                                class="ml-10"
                                effect="dark"
                                content="tips：如果该tab背景颜色不设置或[清空]颜色，则该背景颜色就用上面整个组件的[背景颜色]为背景颜色"
                                placement="top-start"
                            >
                                <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                            </el-tooltip>
                        </el-radio>
                        <el-radio v-model="value.tabBgThemeColor" :label="true">主题色</el-radio>
                    </div>
                    <div class="flex-start text-nowrap mb-15">
                        <span class="pr-15">&emsp;&emsp;下标模式：</span>
                        <el-radio v-model="value.tabsType" :label="'pills'">胶囊模式</el-radio>
                        <el-radio v-model="value.tabsType" :label="'line'">下划线模式</el-radio>
                        <el-radio v-model="value.tabsType" :label="'none'">无</el-radio>
                    </div>
                    <div class="flex-start text-nowrap mb-15">
                        <span class="pr-15">&emsp;&emsp;选中颜色：</span>
                        <el-radio v-model="value.tabCurThemeColor" :label="false">
                            <span class="mr-10">自定义</span>
                            <el-color-picker v-model="value.tabCurColor" class="v-middle"></el-color-picker>
                        </el-radio>
                        <el-radio v-model="value.tabCurThemeColor" :label="true">主题色</el-radio>
                    </div>
                    <div class="flex-start text-nowrap mb-15">
                        <span class="pr-15">&emsp;未选中颜色：</span>
                        <el-color-picker v-model="value.tabNoCurColor" class="v-middle"></el-color-picker>
                    </div>
                    <!-- 手机端的分割线没有写出来 -->
                    <!-- <div class="flex-start text-nowrap">
                        <span class="pr-15">&emsp;&emsp;&emsp;分割线：</span>
                        <el-switch v-model="value.assistLine" class="pr-10"></el-switch>
                        <div class="flex-1">
                            <div class="flex-start transition-all05 overflow-h" :style="{ width: `${value.assistLine ? '100%' : '0%'}` }">
                                <span class="pl-15 pr-5">颜色：</span>
                                <el-color-picker v-model="value.assistLineColor" class="v-middle" show-alpha></el-color-picker>
                                <el-tooltip
                                    class="ml-10"
                                    effect="dark"
                                    content="tips：如果该分割线不设置或[清空]颜色，则该分割线颜色以[未选中字体色]为准，且透明度为40%"
                                    placement="top-start"
                                >
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>

        <!-- 轮播图： -->
        <div class="mb-20">TAB导航</div>
        <el-tabs v-model="currentUUid" type="card" editable @edit="handleTabsEdit" @tab-click="tabClick">
            <el-tab-pane v-for="(itemN, indexN) in value.data.tabList" :key="itemN.uuid" class="p-10" :label="itemN.title" :name="itemN.uuid">
                <vuedraggable
                    v-model="itemN.imgList"
                    :options="{ group: 'data1', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
                >
                    <transition-group>
                        <div
                            v-for="(item, index) in itemN.imgList"
                            :key="index + 1"
                            class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                        >
                            <div class="mb-20 w-100">
                                <div class="flex-start text-nowrap mb-15">
                                    <span class="pr-15">&emsp;&emsp;标题：</span>
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
                                </div>
                                <div class="flex-start text-nowrap mb-15">
                                    <span class="pr-15">标题颜色：</span>
                                    <el-radio v-model="item.themeColor" :label="false">
                                        <span class="mr-10">自定义</span>
                                        <el-color-picker v-model="item.color" class="v-middle"></el-color-picker>
                                    </el-radio>
                                    <el-radio v-model="item.themeColor" :label="true">主题色</el-radio>
                                </div>
                                <div class="flex-start text-nowrap mb-15">
                                    <span class="pr-15">&emsp;&emsp;图片：</span>
                                    <imgCenter
                                        v-model="item.img"
                                        class="pr-15"
                                        :upload-style="{ width: '50px', height: '50px' }"
                                        :is-preview="false"
                                    />
                                    <el-tooltip effect="dark" content="建议尺寸:90*90px" placement="top-start">
                                        <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                                    </el-tooltip>
                                    <span class="pl-15">链接：</span>
                                    <dialogUrl ref="dialog" :key="index" v-model="itemN.imgList[index]" :parmas="parmas" />
                                </div>
                                <div class="flex-start text-nowrap">
                                    <span class="pr-15">有效时间：</span>
                                    <el-date-picker
                                        v-model="item.time"
                                        size="mini"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="timestamp"
                                    ></el-date-picker>
                                    <el-tooltip
                                        class="ml-10"
                                        effect="dark"
                                        content="注意：超出[开始日期]-[结束日期]时间段的元素，左边的显示框里会断续显示，但前端页面上将不会再显示，请综合考虑排版"
                                        placement="top-start"
                                    >
                                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                            <i
                                class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                                style="top: -12px; right: -12px"
                                @click.stop="del('imgList', index, indexN)"
                            ></i>
                        </div>
                    </transition-group>
                </vuedraggable>
                <div class="flex-center">
                    <el-button class="flex-1" type="primary" icon="el-icon-setting" size="small" plain @click.stop="setName(indexN)">
                        修改菜单名字
                    </el-button>
                    <el-button class="flex-1" type="primary" icon="el-icon-plus" size="small" plain @click.stop="add('imgList', indexN)">
                        添加图文导航
                    </el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 链接弹框组件 -->
        <dialogName ref="dialogName" v-model="dialogNameTitle" field="菜单名字" @input="input" />
    </div>
</template>

<script>
import { defFloorVal } from '../defFloorVal.js'
import vuedraggable from 'vuedraggable'
import dialogName from '../../../components/dialogName'
import dialogUrl from '../../../components/dialogUrl/dialogUrl'
export default {
    components: {
        vuedraggable,
        dialogUrl,
        dialogName
    },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return defFloorVal.navigationTab
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
            dialogNameTitle: '',
            currentUUid: '' //当前选中的tab
        }
    },
    computed: {},
    watch: {
        currentUUid: {
            handler(newValue, oldValue) {
                if (newValue) {
                    for (var i = 0; i < this.value.data.tabList.length; i++) {
                        this.value.data.tabList[i].isSelect = false
                    }
                    let index = this.value.data.tabList.findIndex((item) => {
                        return item.uuid === newValue
                    }) //找出是要正在选中的那一个元素的index
                    this.value.data.tabList[index].isSelect = true
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        let currentItem = ''
        currentItem = this.value.data.tabList.filter((item) => {
            return item.isSelect
        })
        this.currentUUid = currentItem.length ? currentItem[0].uuid : this.value.data.tabList[0].uuid
    },
    destroyed() {},
    methods: {
        del(flag, index, indexN) {
            this.value.data.tabList[indexN][flag].splice(index, 1)
        },
        add(flag, index) {
            let addData = this.$utils.object.deepClone(defFloorVal.navigationTab.data.tabList[0][flag][0])
            this.value.data.tabList[index][flag].push(addData)
            this.$emit('add', flag)
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                this.dialogNameTitle = ''
                this.$nextTick(() => {
                    this.$refs.dialogName.showDialog()
                })
            }
            if (action === 'remove') {
                let index = this.value.data.tabList.findIndex((item) => {
                    return item.uuid === targetName
                }) //找出是要删除那一个元素的index
                this.value.data.tabList = this.value.data.tabList.filter((item) => {
                    return item.uuid !== targetName
                }) //删除元素
                if (this.value.data.tabList.length > 0 && this.currentUUid == targetName) {
                    //只有点击当前选中的tab选项并且当前数组大于1时才执行以下方法
                    this.currentUUid = this.value.data.tabList[index > 0 ? index - 1 : 0].uuid //删除元素后，默认选中删除的前一个元素
                }
            }
        },
        setName(index) {
            this.dialogNameTitle = this.value.data.tabList[index].title
            this.$refs.dialogName.showDialog(this.value.data.tabList[index].uuid)
        },
        input(e, flag) {
            if (e) {
                if (flag) {
                    //如果是修改
                    let index = this.value.data.tabList.findIndex((item) => {
                        return item.uuid === flag
                    }) //找出是要修改名字的那一个元素的index
                    this.value.data.tabList[index].title = this.dialogNameTitle
                } else {
                    //如果是新增
                    let index = 0
                    if (this.currentUUid) {
                        index = this.value.data.tabList.findIndex((item) => {
                            return item.uuid === this.currentUUid
                        }) //找出当前被选中的元素的index
                    }
                    let addData = this.$utils.object.deepClone(defFloorVal.navigationTab.data.tabList[0])
                    addData.title = e
                    this.currentUUid = addData.uuid = this.$utils.createUUID()
                    this.value.data.tabList.splice(index + 1, 0, addData)
                }
            }
        },
        tabClick(e) {}
    }
}
</script>

<style lang="scss" scoped></style>
