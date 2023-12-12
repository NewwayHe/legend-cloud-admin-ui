<template>
    <div>
        <el-row class="mb-20">
            <el-button type="primary" size="medium" @click="showDialog">添加参数</el-button>
        </el-row>
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
            <template slot="empty">
                <empty empty-type="pro" text="暂无关联信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="propName" label="参数标题" />
            <el-table-column prop="memo" label="参数副标题" />
            <el-table-column prop="prodPropStr" label="规格值" show-overflow-tooltip min-width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.prodPropStr || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="delItem(scope)">取消关联</el-link>
                </template>
            </el-table-column>
        </el-table>

        <dialog-table
            ref="paramsDialogTable"
            title-name="关联参数"
            search-title="参数标题："
            search-name="propName"
            url="/product/admin/productProperty/page"
            :search-other="{ name: 'attributeType', value: 'P' }"
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
                    propName: 'propName',
                    label: '参数标题'
                },
                {
                    id: 2,
                    propName: 'memo',
                    label: '参数副标题'
                }
            ]
        }
    },
    methods: {
        // 显示dilog
        showDialog() {
            this.$refs.paramsDialogTable.showDialog()
        },

        // 获取选择的row
        getSelectedRow(selectedRow) {
            this.$nextTick(() => {
                this.$emit('update:tableList', selectedRow)
            })
        },

        // 删除
        delItem(scope) {
            if (!scope.row.aggPropId) {
                this.tableList.splice(scope.$index, 1)
                return
            }
            this.$emit('disassociate', scope, 'aggPropId', '/product/admin/productPropertyAgg/param/')
        },

        // 取消关联(编辑时向上触发)
        disassociate(scope) {
            this.$emit('disassociate', scope, 'aggPropId', '/product/admin/productPropertyAgg/param/')
        }
    }
}
</script>
