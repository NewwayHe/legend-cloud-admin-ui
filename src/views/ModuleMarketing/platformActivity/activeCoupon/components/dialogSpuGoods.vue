<template>
    <el-dialog title="选择店铺" :visible.sync="group.visible" width="600px" custom-class="dialog-form">
        <div>
            <div>
                <el-form :inline="true" :model="groupForm" size="small">
                    <el-form-item label="店铺名称">
                        <el-input v-model="groupForm.shopName" placeholder="请输入">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="groupSearch" />
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-table
                    ref="groupTable"
                    v-loading="tableListLoading"
                    class="w-100 dialog-form-table"
                    tooltip-effect="dark"
                    size="mini"
                    row-key="id"
                    :data="groupList"
                    :header-cell-style="{ background: '#fafafa' }"
                    @select-all="handleAllSelectionChange"
                    @select="selectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="shopName" label="店铺名称" align="center">
                        <template slot-scope="scope">
                            <div class="d-flex">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.shopAvatar" :options="{ w: '50', h: '50', br: '6' }" />
                                <el-link class="ml-5" :underline="false" type="primary" style="height: 45px">
                                    <div class="line-clamp2">{{ scope.row.shopName }}</div>
                                </el-link>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="mt-20">
            <el-checkbox v-model="checkAll" @change="checkedAll">全选</el-checkbox>
            <el-pagination
                layout="prev, pager, next"
                :total="group.total"
                :page-size="group.pageSize"
                :current-page="group.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <span slot="footer">
            <el-button size="small" @click="group.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitGroup">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'
import { couponApi } from '@/api/ModuleMarketing'

export default {
    props: {
        // 店铺列表
        shopListIds: {
            type: Array,
            default() {
                return []
            }
        },
        couponId: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            group: {
                visible: false,
                pageNo: 1,
                pageSize: 5,
                total: 5,
                checked: false,
                selectedRow: [] // 选中的行
            },
            // 搜索条件
            groupForm: {
                shopName: ''
            },
            tempShopIds: [], // 商品传入的临时数据。用于组件缓存数据
            groupList: [], // 表格数据
            tableListLoading: false
        }
    },
    computed: {
        checkAll: {
            get() {
                const tableIds = this.groupList.map((item) => item.id)
                return tableIds && tableIds.length && tableIds.every((item) => this.tempShopIds.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        shopListIds: {
            handler(newVal) {
                this.tempShopIds = newVal
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 初始化
        groupInit() {
            this.tableListLoading = true
            request
                .get('/shop/admin/shop/detail/shopInformation', {
                    curPage: this.group.pageNo,
                    pageSize: this.group.pageSize,
                    shopName: this.groupForm.shopName
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.group.total = res?.data?.total || 0
                    this.groupList = res?.data?.resultList || []
                    this.$nextTick(() => {
                        this.toggleSelection(this.groupList)
                    })
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },
        // 去重
        removeSame(arr) {
            const obj = {}
            return (arr = arr.reduce((item, next) => {
                if (!obj[next]) {
                    item.push(next)
                    obj[next] = true
                }
                return item
            }, []))
        },
        handleAllSelectionChange(selection) {
            // 如果全选
            if (selection.length) {
                const selectionIds = selection.map((item) => item.id)
                this.tempShopIds = this.removeSame([...this.tempShopIds, ...selectionIds])
            } else {
                const currentList = this.groupList.map((item) => item.id)
                this.tempShopIds = this.tempShopIds.filter((item) => !currentList.includes(item))
            }
        },
        selectionChange(val, row) {
            const selected = val.length && val.filter((item) => item.id == row.id).length
            // 如果是取消勾选
            if (!selected) {
                this.tempShopIds = this.tempShopIds.filter((item) => item != row.id)
            } else {
                const selectionIds = val.map((item) => item.id)
                this.tempShopIds = this.removeSame([...this.tempShopIds, ...selectionIds])
            }
        },
        toggleSelection(rows) {
            rows.forEach((row) => {
                if (this.tempShopIds.includes(row.id)) {
                    this.$refs.groupTable.toggleRowSelection(row, true)
                }
            })
        },

        // 保存关联组
        submitGroup() {
            if (this.tempShopIds.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            couponApi
                .couponShopPut({
                    selectShopId: this.tempShopIds,
                    id: this.couponId
                })
                .then((res) => {
                    if (res.code) {
                        this.$emit('update:couponId', res.data)
                        this.$emit('sumbitTable', this.tempShopIds)
                        this.group.visible = false
                    }
                })
        },
        // 搜索
        groupSearch() {
            console.log('search')
            this.groupInit()
        },
        // 选择单行
        selectRow(selection, row) {
            this.group.selectedRow = selection
            if (selection.length === this.groupList.length) {
                this.group.checked = true
            }
        },
        // 点击单选框全选
        checkedAll(val) {
            if (val) {
                this.$refs.groupTable.toggleAllSelection()
            } else {
                this.$refs.groupTable.clearSelection()
                const currentList = this.groupList.map((item) => item.id)
                this.tempShopIds = this.tempShopIds.filter((item) => !currentList.includes(item))
            }
        },

        // 显示dialog
        dialogShow() {
            this.group.visible = true
            this.group.checked = false
            // 需要等待数据更新完才能初始化
            this.$nextTick(() => {
                this.groupInit()
            })
        },

        // 关闭dialog
        dialogClose() {
            this.group.visible = false
            this.group.selectedRow = []
        },

        // 下一页
        dialogcurrentPageChange(value) {
            this.group.pageNo = value
            this.group.checked = false
            this.groupInit()
        },

        // 是否禁用当前列
        checkRow(row) {
            return !this.relatedRow.map((item) => item.id).includes(row.id)
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
