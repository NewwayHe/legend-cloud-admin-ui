<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件
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

            <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.name" :name="item.name" lazy>
                <keep-alive>
                    <component
                        :is="item.type"
                        v-if="temp.type == item.name"
                        :ref="'class' + item.name"
                        v-model="value"
                        :field="field"
                        :parmas="parmas"
                        @getTempList="getTempList"
                    />
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
import prodGroup from './components/prodGroup.vue'
import category from './components/category.vue'
export default {
    components: { prodGroup, category },
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
            default: ''
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            temp: {
                // 缓存文件
                type: '商品分组'
            },
            isCompatible: false //是否兼容1366px
        }
    },
    computed: {
        tabList() {
            const listTemp = [
                { name: '商品分组', type: 'prodGroup' },
                { name: '商品分类', type: 'category' }
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
                if (newValue) {
                    if (this.field) {
                        this.temp.type = this.value[this.field].type ? this.value[this.field].type : this.tabList[0].name //tab栏回选及赋默认值
                    } else {
                        this.temp.type = this.value.type ? this.value.type : this.tabList[0].name //tab栏回选及赋默认值
                    }

                    // 去掉没有id的空数组(如果后台删掉了该分类或数组)
                    if (this.field) {
                        this.value[this.field].idList =
                            this.value[this.field].idList &&
                            this.value[this.field].idList.length &&
                            this.value[this.field].idList.filter((item) => {
                                return item && item.id
                            })
                        this.value[this.field].categoryIdList =
                            this.value[this.field].categoryIdList &&
                            this.value[this.field].categoryIdList.length &&
                            this.value[this.field].categoryIdList.filter((item) => {
                                return item && item.id
                            })
                    } else {
                        this.value.idList =
                            this.value.idList &&
                            this.value.idList.length &&
                            this.value.idList.filter((item) => {
                                return item && item.id
                            })
                        this.value.categoryIdList =
                            this.value.categoryIdList &&
                            this.value.categoryIdList.length &&
                            this.value.categoryIdList.filter((item) => {
                                return item && item.id
                            })
                    }
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
            this.$nextTick(() => {
                this.$refs['class' + this.temp.type][0].getData()
            })
        },
        // 重置
        resetForm() {
            this.$refs['class' + this.temp.type][0].tempList = []
            if (this.$refs['class' + this.temp.type][0]) {
                if (this.temp.type == '商品分类') {
                    this.$refs['class' + this.temp.type][0].cascaderValue = []
                } else if (this.temp.type == '商品分组') {
                    this.$refs['class' + this.temp.type][0].$refs.refTable.clearSelection()
                }
            }
        },
        // 确定
        confirm() {
            if (this.$refs['class' + this.temp.type][0]) {
                this.$refs['class' + this.temp.type][0].confirm()
                this.$nextTick(() => {
                    this.dialogTableVisible = false
                    if (this.field) {
                        this.value[this.field] = this.$utils.object.deepClone({ ...this.value[this.field], ...this.temp })
                    } else {
                        let value = this.$utils.object.deepClone({ ...this.value, ...this.temp })
                        this.$emit('input', value)
                    }
                    this.$emit('confirm', this.value)
                })
            }
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
