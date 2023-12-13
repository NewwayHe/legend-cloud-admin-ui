<template>
    <el-dialog :title="titleName" :visible.sync="dialog.visible" custom-class="dialog-form-large">
        <el-table
            ref="dialogTable"
            v-loading="tableListLoading"
            class="w-100 dialog-form-table"
            tooltip-effect="dark"
            size="mini"
            :data="dialogTable"
            header-row-class-name="headerRow"
        >
            <el-table-column prop="auditUsername" label="审核人" />
            <el-table-column prop="opStatus" label="审核状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.opStatus == -1" class="status-veto">审核不通过</span>
                    <span v-if="scope.row.opStatus == 0" class="status-wait">待审核</span>
                    <span v-if="scope.row.opStatus == 1" class="status-pass">通过审核</span>
                </template>
            </el-table-column>
            <el-table-column prop="auditTime" label="审核时间" width="140" />
            <el-table-column prop="auditOpinion" label="备注">
                <template slot-scope="scope">
                    {{ scope.row.auditOpinion || '-' }}
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" align="middle" class="mt-30">
            <el-pagination
                layout="prev, pager, next"
                :total="dialog.total"
                :page-size="dialog.pageSize"
                :current-page="dialog.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <span slot="footer">
            <el-button size="small" type="primary" @click="dialog.visible = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'

export default {
    name: 'DialogGroup',
    props: {
        titleName: {
            type: String,
            default: '审核历史'
        },
        productId: {
            type: [String, Array, Number],
            default: ''
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
            type: String
            // required: true
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
            dialogTable: [], // 表格数据
            tableListLoading: false
        }
    },
    computed: {},
    watch: {},
    methods: {
        // 初始化
        dialogInit() {
            this.tableListLoading = true
            request
                .get('/basic/admin/audit/getAuditByProductId', {
                    curPage: this.dialog.pageNo,
                    pageSize: this.dialog.pageSize,
                    productId: this.productId
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.dialog.total = res?.data?.total || 0
                    this.dialogTable = res?.data?.resultList || []
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 搜索
        tableSearch() {
            console.log('search')
            this.dialogInit()
        },

        // 显示dialog
        showDialog() {
            this.dialog.visible = true
            this.$nextTick(() => {
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
