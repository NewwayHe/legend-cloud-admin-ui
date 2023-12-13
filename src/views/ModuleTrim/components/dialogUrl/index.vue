<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件(只支持单选，要多选请参考dialogUrlMultiple)
 * 用法：import dialogUrl from '../../../components/dialogUrl';
 *      一、普通用法(同一个数组元素里只有一个链接且链接的key值为url)：
 *          <dialog-url ref="dialog" v-model="dialogItem" :parmas="parmas"  @input="input"/>
            showDialog(item) {
                this.dialogItem = item
                this.$refs.dialog.showDialog()
            },
			input(val){
				this.value.data.hotZoneList[this.dialog.index] = val
				this.$set(this.value.data,'hotZoneList',$utils.object.deepClone(this.value.data.hotZoneList))//不写这个的话hotZone.vue组件里的数据不会变更
			},
 *      一、高级用法(同一个数组元素里有多个链接且链接的key值不同)：
 *          链接1：<div @click="showDialog(item,['分类'])">
 *          链接2：<div @click="showDialog(item)">
 *          <dialogUrl :key="index+'##'" v-model="value.data.dateList[index]" :parmas="parmas" :tab="['商品分组', '商品分类']" field="sourceUrl" placeholder="请选择分组/分类名称"/>
 *         	<dialogUrl :key="index" v-model="value.data.dateList[index]" :parmas="parmas" />
*/ -->
    <!-- 选择链接 -->
    <el-dialog
        :custom-class="'dialog-form dialog-trim-url ' + (isCompatible ? 'compatibleWidth' : '')"
        append-to-body
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="false"
    >
        <el-tabs v-model="type" style="overflow-y: hidden" :style="{ height: height + 'px' }" @tab-click="handleClick">
            <Empty v-if="!type" text="暂无内容" />
            <el-tab-pane v-for="(item, index) in tabList" :key="index" :style="{ height: height - 40 + 'px' }" :label="item.name" :name="item.name">
                <keep-alive v-if="reload">
                    <component :is="item.type" v-if="type == item.name" v-model="valueTemp" :parmas="parmas" :field="field"></component>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
        <i class="el-icon-close position-absolute font-24 cursor-pointer" style="top: 20px; right: 5px" @click.stop="dialogTableVisible = false" />
    </el-dialog>
</template>
<script>
import prod from './components/prod.vue'
import prodGroup from './components/prodGroup.vue'
import haiBao from './components/haiBao.vue'
import page from './components/page.vue'
import diyUrl from './components/diyUrl.vue'
import category from './components/category.vue'
export default {
    components: { prod, prodGroup, haiBao, page, diyUrl, category },
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        tab: {
            //可以选择只要哪几个tab页面，如只要'商品':tab="[{name:'商品',type:'prod'}]"
            type: Array,
            default: () => {
                return []
            }
        },
        field: {
            //如果是对象，显示的键名，选中的对象是存放到value[this.field]里的
            type: String,
            default: 'url'
        },
        // 是否建立引用关系(建立了引用关系，那点击选项时，外面的值会马上变化，不用点‘确认’)
        isQuote: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            type: '商品',
            valueTemp: {},
            reload: true, //点击【重置】按钮时，让所有页面的状态都重置(包括已经搜索出来的内容)
            isCompatible: false, //是否兼容1366px
            height: 630
        }
    },
    computed: {
        //如果是PC端装修，则有些没有的功能要屏蔽
        isPcTrim() {
            return this.$route.name == 'pcTrim' || this.$route.name == 'PcTrim'
        },
        tabList() {
            const listTemp = [
                { name: '商品', type: 'prod' },
                { name: '商品分组', type: 'prodGroup' },
                { name: '商品分类', type: 'category' },
                { name: '海报页', type: 'haiBao' },
                { name: '常用功能', type: 'page' },
                { name: '自定义', type: 'diyUrl' }
            ]
            let list = []
            if (this.tab.length) {
                this.tab.forEach((element) => {
                    listTemp.forEach((item) => {
                        if (item.name == element) {
                            list.push(item)
                        }
                    })
                })
            }
            if (!list.length) {
                list = listTemp
            }
            return list
        }
    },
    watch: {
        dialogTableVisible: {
            handler(newValue, oldValue) {
                if (newValue && this.tabList.length) {
                    if (this.isQuote) {
                        this.valueTemp = this.value
                    } else {
                        this.valueTemp = this.$utils.object.deepClone(this.value)
                    }
                    this.type = this.value[this.field] && this.value[this.field].type ? this.value[this.field].type : this.tabList[0].name //tab栏回选及赋默认值
                }
                if (!newValue) {
                    // 如果弹窗关闭了 则清除事件监听
                    window.removeEventListener('resize', this.compatibleChange)
                } else {
                    this.$nextTick(() => {
                        window.addEventListener('resize', this.compatibleChange)
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.compatibleChange()
    },
    methods: {
        showDialog() {
            //这个方法是父组件来引用的，不能删
            this.dialogTableVisible = true
        },
        // 重置
        resetForm() {
            this.valueTemp[this.field] = {}
            this.reload = false
            setTimeout(() => {
                this.reload = true
            }, 100)
        },
        confirm() {
            this.dialogTableVisible = false
            this.$emit('input', this.valueTemp)
        },
        handleClick(tab, event) {
            // console.log(tab);
            // console.log(event);
        },
        // 兼容1366px
        compatibleChange() {
            if (window.innerWidth <= 1366) {
                this.isCompatible = true
            } else {
                this.isCompatible = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// 当input框启用show-word-limit时,防止.el-form-item__content元素的 line-height: 40px;对.el-input__count元素的line-height进行样式污染
::v-deep .el-textarea {
    .el-input__count {
        line-height: normal !important;
    }
}
::v-deep .el-dialog__header {
    padding: 0;
}
::v-deep .el-dialog__close.el-icon.el-icon-close {
    padding: 0;
}
::v-deep .el-dialog__body {
    padding: 15px 0 15px 0;
}
::v-deep .el-tabs__header {
    margin: 0 0 5px 0;
    padding: 0 30px 0 30px;
}
::v-deep .el-dialog__headerbtn {
    display: none;
}
</style>
<style lang="scss">
.dialog-form.dialog-trim-url {
    max-height: 80vh;
    &.compatibleWidth {
        //兼容1366px下的弹窗最小宽度
        min-width: 60vw;
    }
}
</style>
