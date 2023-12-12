<template>
    <div>
        <el-row class="mb-20">
            <el-button type="primary" size="medium" @click="showDialog">添加关联参数组</el-button>
        </el-row>
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
            <template slot="empty">
                <empty empty-type="pro" text="暂无关联信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="name" label="参数组标题"/>
            <el-table-column prop="memo" label="参数组副标题"/>
            <el-table-column prop="propertyStr" label="关联参数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.paramsStr || scope.row.propertyStr || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="delItem(scope)">取消关联</el-link>
                </template>
            </el-table-column>
        </el-table>

        <dialog-table
            ref="paramsGroupDialogTable"
            title-name="关联参数组"
            search-title="参数标题："
            search-name="name"
            url="/product/admin/paramGroup/page"
            :col-data="colData"
            :selected-row="tableList"
            @submitRow="getSelectedRow"
        />
    </div>
</template>

<script>
import DialogTable from './dialogTable'

export default {
    components: { DialogTable },
    props: {
        tableList: {
            type: Array,
            required: true
        },
        isEdit: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            colData: [
                {
                    id: 1,
                    propName: 'name',
                    label: '参数组标题'
                },
                {
                    id: 2,
                    propName: 'memo',
                    label: '参数组副标题'
                },
                {
                    id: 3,
                    propName: 'paramsStr',
                    label: '关联参数'
                }
            ]
        }
    },
    methods: {
        // 显示dilog
        showDialog() {
            this.$refs.paramsGroupDialogTable.showDialog()
        },

        // 获取选择的row
        getSelectedRow(selectedRow) {
            this.$nextTick(() => {
                this.$emit('update:tableList', selectedRow)
            })
        },

        // 删除
        delItem(scope) {
            if (!scope.row.aggGroupId) {
                this.tableList.splice(scope.$index, 1)
                return
            }
            this.$emit('disassociate', scope, 'aggGroupId', '/product/admin/productPropertyAgg/paramGroup/')
        },

        // 取消关联(编辑时向上触发)
        disassociate(scope) {
            if (scope.row.aggGroupId) this.tableList.splice(scope.$index, 1)
            this.$emit('disassociate', scope, 'aggGroupId', '/product/admin/productPropertyAgg/paramGroup/')
        }
    }
}
</script>
