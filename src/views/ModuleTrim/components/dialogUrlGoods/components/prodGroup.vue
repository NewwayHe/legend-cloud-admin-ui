<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-商品分组
*/ -->
    <div class="w-100 text-center px-30 py-20">
        <div class="flex-start mb-20">
            <div class="mr-5"><el-button @click="goManage">管理分组</el-button></div>
            <el-input v-model="apiParmas.productGroupName" class="flex-1" placeholder="请输入商品分组" :maxlength="500" clearable>
                <el-button slot="append" icon="el-icon-search" @click="doSearch" />
            </el-input>
        </div>

        <template v-if="data && data.resultList && data.resultList.length">
            <el-table
                ref="refTable"
                v-loading="loading"
                class="w-100 dialog-form-table"
                tooltip-effect="dark"
                :data="data.resultList"
                :header-cell-style="{ background: '#fafafa' }"
                @select-all="handleAllSelectionChange"
                @select="selectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="分组名称" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="分组描述" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{ scope.row.description }}
                    </template>
                </el-table-column>
            </el-table>

            <el-row type="flex" justify="space-between" align="middle" class="mt-20">
                <el-checkbox v-model="checkAll" @change="checkedAll">全选</el-checkbox>
                <el-pagination
                    layout="prev, pager, next"
                    :total="data.total"
                    :page-size="data.pageSize"
                    :current-page.sync="data.curPageNO"
                    @current-change="currentChange"
                />
            </el-row>
        </template>
        <Empty v-if="noMsg" text="暂无商品分组信息" />
    </div>
</template>
<script>
import { decorate } from '@/api/ModuleTrim'
export default {
    components: { },
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
        field: {
            //如果是对象，显示的键名，选中的对象是存放到value[this.field]里的
            type: String,
            default: ''
        }
    },
    data() {
        return {
            data: '',
            apiParmas: {
                curPage: 1,
                productGroupName: '',
                pageSize: 7
            },
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor),
            loading: false,
            tempList: [], // 商品传入的临时数据。用于组件缓存数据
            noMsg: false,
        }
    },
    computed: {
        tempItem() {
            return this.tempList.map((item) => item.id)
        },
        checkAll: {
            get() {
                const tableIds = this.data.resultList.map((item) => item.id)
                return tableIds && tableIds.length && tableIds.every((item) => this.tempItem.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (this.field) {
                    if (newValue && newValue[this.field] && newValue[this.field].idList && newValue[this.field].idList.length) {
                        // 回选
                        this.tempList = this.$utils.object.deepClone(newValue[this.field].idList)
                    }else{
						this.tempList = []
					}
                } else {
                    if (newValue && newValue && newValue.idList && newValue.idList.length) {
                        // 回选
                        this.tempList = this.$utils.object.deepClone(newValue.idList)
                    }else{
						this.tempList = []
					}
                }
            },
            deep: true,
            immediate: true
        },
    },
    created() {
        this.getData()
    },
    methods: {
        doSearch() {
            this.apiParmas.curPage = 1
            this.getData()
        },
        getData() {
            this.loading = true
            this.noMsg = false
            decorate
                .prodGroup(this.apiParmas)
                .then((res) => {
                    if (res.code) {
                        this.data = res.data
                        if (!this.data.resultList.length) {
                            this.noMsg = true
                        }
                        this.$nextTick(() => {
                            this.toggleSelection(this.data.resultList)
                        })
                    }
                })
                .catch((err) => {
                    this.noMsg = true
                    console.log(err)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        currentChange(val) {
            this.apiParmas.curPage = val
            this.getData()
        },
        goManage() {
            this.$router.push({ name: 'goodReative' })
        },
        handleAllSelectionChange(selection) {
            // 如果全选
            if (selection.length) {
                const selectionIds = selection.map((item) => item.id)
                this.tempList = this.removeSame([...this.tempList, ...selection])
            } else {
                const currentList = this.data.resultList.map((item) => item.id)
                this.tempList = this.tempList.filter((item) => !currentList.includes(item.id))
            }
        },
        selectionChange(val, row) {
            const selected = val.length && val.filter((item) => item.id == row.id).length
            // 如果是取消勾选
            if (!selected) {
                this.tempList = this.tempList.filter((item) => item.id != row.id)
            } else {
                const selectionIds = val.map((item) => item.id)
                this.tempList = this.removeSame([...this.tempList, ...val])
            }
        },
        removeSame(arr) {
            const obj = {}
            return (arr = arr.reduce((item, next) => {
                if (!obj[next.id]) {
                    item.push(next)
                    obj[next.id] = true
                }
                return item
            }, []))
        },
        toggleSelection(rows) {
            rows.forEach((row) => {
                if (this.tempItem.includes(row.id)) {
                    this.$refs.refTable.toggleRowSelection(row, true)
                }
            })
        },
        // 点击单选框全选
        checkedAll(val) {
            if (val) {
                this.$refs.refTable.toggleAllSelection()
            } else {
                this.$refs.refTable.clearSelection()
                const currentList = this.data.resultList.map((item) => item.id)
                this.tempList = this.tempList.filter((item) => !currentList.includes(item.id))
            }
        },
		confirm(){
			this.$emit('getTempList', 'idList', this.tempList)
		}
    }
}
</script>

<style lang="scss" scoped></style>
