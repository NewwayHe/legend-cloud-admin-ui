<template>
    <el-dialog :title="titleName" :visible.sync="dialog.visible" custom-class="dialog-form-small" append-to-body>
        <div>
            <el-form :model="dialogForm" size="small" label-width="98px" @submit.native.prevent @keyup.enter.native="tableSearch">
                <el-form-item :label="searchTitle">
                    <el-input v-model="dialogForm.title" placeholder="请输入">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="tableSearch" />
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                ref="dialogTable"
                v-loading="tableListLoading"
                class="w-100 dialog-form-table mt-15"
                tooltip-effect="dark"
                size="small"
                row-key="id"
                :data="dialogTable"
                @select-all="handleAllSelectionChange"
                @select="selectionChange"
                header-row-class-name="headerRow"
            >
                <el-table-column type="selection" width="42" reserve-selection/>
                <template v-for="item in colData">
                    <el-table-column v-if="item.type == 'img'" :key="item.id" :prop="item.propName" :label="item.label">
                        <template slot-scope="scope">
                            <ls-image class="v-middle" :src="scope.row[item.propName]" :options="{ w: '50', h: '50', br: '4' }" />
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="item.id" show-overflow-tooltip :prop="item.propName" :label="item.label">
                        <template slot-scope="scope">
                            {{scope.row[item.propName] || '-'}}
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="dialog-paging mt-10">
            <el-checkbox v-model="checkAll" @change="checkedAll" class="pl-10" :indeterminate="checkHalf" :disabled='!dialogTable.length'>全选</el-checkbox>
            <el-pagination
                small
                layout="prev, pager, next"
                :total="dialog.total"
                :page-size="dialog.pageSize"
                :current-page="dialog.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialog.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitGroup">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'

export default {
    name: 'DialogGroup',
    props: {
        // 商品列表
        selectedRow: {
            type: Array,
            default() {
                return []
            }
        },
        // dialog的title
        titleName: {
            type: String,
            default: '关联规格分组'
        },
        // 搜索的title
        searchTitle: {
            type: String,
            default: '标题'
        },
        // 搜索名
        searchName: {
            type: String,
            required: true
        },
        // 额外参数
        searchOther: {
            type: Object,
            default() {
                return {}
            }
        },
        // 请求数据
        url: {
            type: String,
            required: true
        },
        // 表格数据
        colData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            dialog: {
                visible: false,
                pageNo: 1,
                pageSize: 5,
                total: 5,
                checked: false,
                selectedRow: [] // 选中的行
            },
            // 搜索条件
            dialogForm: {
                title: ''
            },
            tempTableList: [], // 商品传入的临时数据。用于组件缓存数据
            dialogTable: [], // 表格数据
            tableListLoading: false
        }
    },
    computed: {
        tempTableIds() {
            return this.tempTableList.map((item) => item.id)
        },
        //底部全选按钮与表格顶部的全选按钮状态同步[半选状态]
        checkHalf() {
            if(this.checkAll) {
                return false;
            }else if(this.tempTableIds.length) {
                return true;
            }else {
                return false;
            }
        },
        checkAll: {
            get() {
                const tableIds = this.dialogTable.map((item) => item.id)
                return tableIds && tableIds.length && tableIds.every((item) => this.tempTableIds.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        selectedRow: {
            handler(newVal) {
                this.tempTableList = newVal
            },
            immediate: true
        }
    },
    methods: {
        // 初始化
        dialogInit() {
            this.tableListLoading = true
            request
                .get(this.url, {
                    curPage: this.dialog.pageNo,
                    pageSize: this.dialog.pageSize,
                    [this.searchName]: this.dialogForm.title,
                    [this.searchOther.name]: this.searchOther.value
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.dialog.total = res?.data?.total || 0
                    this.dialogTable = res?.data?.resultList || []
                    this.$nextTick(() => {
                        this.toggleSelection(this.dialogTable)
                    })
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
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
            console.log(arr)
        },
        handleAllSelectionChange(selection) {
            // 如果全选
            if (selection.length) {
                const selectionIds = selection.map((item) => item.id)
                this.tempTableList = this.removeSame([...this.tempTableList, ...selection])
            } else {
                const currentList = this.dialogTable.map((item) => item.id)
                this.tempTableList = this.tempTableList.filter((item) => !currentList.includes(item.id))
            }
        },
        selectionChange(val, row) {
            const selected = val.length && val.filter((item) => item.id == row.id).length
            // 如果是取消勾选
            if (!selected) {
                this.tempTableList = this.tempTableList.filter((item) => item.id != row.id)
            } else {
                const selectionIds = val.map((item) => item.id)
                this.tempTableList = this.removeSame([...this.tempTableList, ...val])
            }
        },
        toggleSelection(rows) {
            rows.forEach((row) => {
                if (this.tempTableIds.includes(row.id)) {
                    this.$refs.dialogTable.toggleRowSelection(row, true)
                }
            })
        },

        // 保存关联组
        submitGroup() {
            if (this.tempTableList.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            console.log(this.tempTableList)
            this.$emit('submitRow', this.tempTableList)
            this.dialog.visible = false
        },

        // 搜索
        tableSearch() {
            console.log('search')
            this.dialogInit()
        },

        // 点击单选框全选
        checkedAll(val) {
            if (val) {
                this.$refs.dialogTable.toggleAllSelection()
            } else {
                this.$refs.dialogTable.clearSelection()
                const currentList = this.dialogTable.map((item) => item.id)
                this.tempTableList = this.tempTableList.filter((item) => !currentList.includes(item.id))
            }
        },

        // 显示dialog
        showDialog() {
            this.dialog.visible = true
            this.$nextTick(() => {
                this.$refs.dialogTable.clearSelection()
                this.dialogInit()
            })
        },

        // 下一页
        dialogcurrentPageChange(value) {
            this.dialog.pageNo = value
            this.dialogInit()
        }
    }
}
</script>

<style>
.tip {
    font-size: 10px;
    color: #9c9ca5;
    margin-right: 8px;
}
</style>
