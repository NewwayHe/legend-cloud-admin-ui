<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件(多选)
*/ -->
    <!-- 选择链接 -->
    <el-dialog
        :custom-class="'dialog-form dialog-trim-url ' + (isCompatible ? 'compatibleWidth' : '')"
        append-to-body
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="false"
    >
        <el-tabs v-model="temp.type" style="height: 630px; overflow-y: hidden" @tab-click="handleClick">
            <Empty v-if="!temp.type" text="暂无内容" />

            <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.name" :name="item.name">
                <keep-alive>
                    <component :is="item.type" v-if="temp.type == item.name" v-model="valueTemp" :parmas="parmas" @getTempList="getTempList" />
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
        <i class="el-icon-close position-absolute font-24 cursor-pointer" style="top: 20px; right: 20px" @click.stop="dialogTableVisible = false" />
    </el-dialog>
</template>
<script>
import prod from './components/prod.vue'
export default {
    components: { prod },
    props: {
        // value: [Object,Array,String,Number],//选中的元素，可以是数组，也可以是对象(用于回选)
        value: {
            type: Array,
            default: () => {
                return []
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
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            temp: {
                // 缓存文件
                type: '商品'
            },
            tempItem: [], //传到子组件里的元素，建议引用关系,这个不能删(用于回选)
            valueTemp: [],
            isCompatible: false //是否兼容1366px
        }
    },
    computed: {
        tabList() {
            const listTemp = [{ name: '商品', type: 'prod' }]
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
                if (newValue) {
                    this.valueTemp = this.$utils.object.deepClone(this.value)
                    if (newValue && this.tabList.length) {
                        this.temp.type = this.value.length ? this.value[0].type : this.tabList[0].name //tab栏回选及赋默认值
                    }
                    // 去掉没有id的空数组
                    this.tempItem =
                        this.tempItem &&
                        this.tempItem.length &&
                        this.tempItem.filter((item) => {
                            return item && item.id
                        })
                    if (this.tempItem && this.tempItem.length) {
                        this.$emit('input', this.tempItem)
                    }
                }
            },
            deep: true,
            immediate: true
        },
        value: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.tempItem = newValue
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.compatibleChange()
    },
    mounted() {},
    methods: {
        showDialog() {
            // 这个方法是父组件来引用的，不能删
            this.dialogTableVisible = true
        },
        // 重置
        resetForm() {
            // this.$emit('input', [])
            this.valueTemp = []
        },
        // 确定
        confirm() {
            this.dialogTableVisible = false
            // this.$emit('confirm', this.value)
            this.$emit('input', this.valueTemp)
        },
        handleClick(tab, event) {
            this.temp.type = event.target.innerText
        },
        getTempList(key, value) {
            this.temp[key] = value
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
