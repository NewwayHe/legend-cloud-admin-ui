<template>
    <el-dialog title="分组管理" :visible.sync="group.visible" custom-class="dialog-form-small" destroy-on-close @closed="closed">
        <div>
            <el-form :model="groupForm" size="small" label-width="98px" @submit.native.prevent @keyup.enter.native="groupSearch">
                <el-form-item label="分组名称：">
                    <el-input v-model="groupForm.title" placeholder="请输入">
                        <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click.stop="groupSearch" />
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                ref="groupTable"
                v-loading="tableListLoading"
                class="w-100 dialog-form-table mt-15"
                tooltip-effect="dark"
                size="small"
                :row-key="getRowKey"
                :data="groupList"
                @select-all="selectAll"
                @select="selectRow"
                header-row-class-name="headerRow"
            >
                <el-table-column type="selection" width="42" reserve-selection />
                <el-table-column prop="prodName" label="分组名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-link class="line-clamp1" :underline="false">{{ scope.row.name }}</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="dialog-paging mt-10">
            <el-checkbox v-model="group.checked" @change="checkedAll" class="pl-10" :indeterminate="group.halfChecked" :disabled='!groupList.length'>全选</el-checkbox>
            <el-pagination
                small
                layout="prev, pager, next"
                :total="group.total"
                :page-size="group.pageSize"
                :current-page="group.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="group.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitGroup">{{ showTip ? '保 存' : '确 定' }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'
export default {
    name: 'DialogGroup',
    props: {
        showTip: {
            type: Boolean,
            default: true
        },
        // 关联的
        relatedRow: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        'group.selectedRow.length'(nL) {
            if(nL) {
                if(!this.group.checked) {
                    this.group.halfChecked = true;
                }else {
                    this.group.halfChecked = false;
                }
            }else {
                this.group.halfChecked = false;
            }
        }
    },
    data() {
        return {
            group: {
                visible: false,
                pageNo: 1,
                pageSize: 5,
                total: 5,
                checked: false,     //全选
                halfChecked: false, //半选
                selectedRow: [] // 选中的行
            },
            // 搜索条件
            groupForm: {
                title: ''
            },
            groupList: [], // 表格数据
            tableListLoading: false
        }
    },
    methods: {
        // 初始化
        groupInit() {
            this.tableListLoading = true
            request
                .get('/product/admin/product/group/page', {
                    curPage: this.group.pageNo,
                    pageSize: this.group.pageSize,
                    name: this.groupForm.title,
                    type: '1'
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.group.total = res?.data?.total || 0
                    this.groupList = res?.data?.resultList || []
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 确定按钮
        submitGroup() {
            // console.log('this.selectedRow', this.group.selectedRow)
            if (this.group.selectedRow.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            this.$emit('relateGroup', this.group.selectedRow)
        },

        // 搜索
        groupSearch() {
            console.log('search')
            this.group.pageNo = 1
            this.groupInit()
        },

        // 全选
        selectAll(selection) {
            if (selection.length === 0) {
                this.group.checked = false
            } else {
                this.group.checked = true
            }
            this.group.selectedRow = selection
        },

        // 选择单行
        selectRow(selection, row) {
            this.group.selectedRow = selection
            if (selection.length === this.groupList.length) {
                this.group.checked = true
            }else {
                this.group.checked = false
            }
        },

        // 点击单选框全选
        checkedAll() {
            this.$refs.groupTable.toggleAllSelection()
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
            this.$refs.groupTable.clearSelection()
        },
        // 下一页
        dialogcurrentPageChange(value) {
            this.group.pageNo = value
            this.group.checked = false
            this.groupInit()
        },

        getRowKey(row) {
            return row.id
        },

        // 弹窗关闭时候的回调方法
        closed() {
            this.groupForm.title = ''
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
