<template>
    <div>
        <el-row class="mb-20">
            <el-button type="primary" size="medium" @click="showDialog">添加关联规格</el-button>
        </el-row>
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
            <template slot="empty">
                <empty empty-type="pro" text="暂无关联信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="propName" label="规格标题" />
            <el-table-column prop="memo" label="规格副标题" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="50">
                <template slot-scope="scope">
                    <span>{{ scope.row.type == 'TXT' ? '文本' : '图片' }}</span>
                </template>
            </el-table-column>
            <!-- 使用了el-tableColumn的show-overflow-tooltip就不需要再使用line-clamp1 否则会出现表格内容高度不对齐突兀现象 -->
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
            ref="speDialogTable"
            title-name="关联规格"
            search-title="规格标题："
            search-name="propName"
            url="/product/admin/productProperty/page"
            :search-other="{ name: 'attributeType', value: 'S' }"
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
            // tableList: [],
            colData: [
                {
                    id: 1,
                    propName: 'propName',
                    label: '规格标题'
                },
                {
                    id: 2,
                    propName: 'memo',
                    label: '规格副标题'
                }
            ]
        }
    },
    mounted() {},
    methods: {
        // 显示dilog
        showDialog() {
            this.$refs.speDialogTable.showDialog()
        },

        // 获取选择的row
        getSelectedRow(selectedRow) {
            this.$nextTick(() => {
                this.$emit('update:tableList', selectedRow)
            })
        },

        // 删除item
        delItem(scope) {
            if (!scope.row.aggPropId) {
                this.tableList.splice(scope.$index, 1)
                return
            }
            this.$emit('disassociate', scope, 'aggPropId', '/product/admin/productPropertyAgg/specification/')
        },

        // 取消关联(编辑时向上触发)
        disassociate(scope) {}
    }
}
</script>

<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
