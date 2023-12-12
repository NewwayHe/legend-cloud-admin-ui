<template>
    <div>
        <el-row class="mb-20">
            <el-button type="primary" size="medium" @click="showDialog">添加关联品牌</el-button>
        </el-row>
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
            <template slot="empty">
                <empty empty-type="pro" text="暂无关联信息" />
            </template>
            <el-table-column label="序号" type="index" width="48" />
            <el-table-column prop="brandPic" label="品牌LOGO">
                <template slot-scope="scope">
                    <ls-image class="v-middle" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '4' }"/>
                </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称" />
            <el-table-column label="推荐品牌">
                <template slot-scope="scope">
                    <span>{{ scope.row.commendFlag ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <el-link v-if="scope.row.status == 0" :underline="false" type="danger">下线</el-link>
                    <el-link v-if="scope.row.status == 1" :underline="false" type="success">上线</el-link>
                    <el-link v-if="scope.row.status == -1" :underline="false" type="warning">待审核</el-link>
                    <el-link v-if="scope.row.status == -2" :underline="false" type="danger">未通过</el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="delItem(scope)">取消关联</el-link>
                    <!-- <el-link v-else :underline="false" type="primary" @click="disassociate(scope)">取消关联</el-link> -->
                </template>
            </el-table-column>
        </el-table>

        <dialog-table
            ref="brandDialogTable"
            title-name="关联品牌"
            search-title="品牌名称："
            search-name="brandName"
            url="/product/admin/brand/page"
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
                    propName: 'brandPic',
                    label: '品牌LOGO',
                    type: 'img'
                },
                {
                    id: 2,
                    propName: 'brandName',
                    label: '品牌名称'
                }
            ]
        }
    },
    methods: {
        // 显示dilog
        showDialog() {
            this.$refs.brandDialogTable.showDialog()
        },

        // 获取选择的row
        getSelectedRow(selectedRow) {
            this.$nextTick(() => {
                this.$emit('update:tableList', selectedRow)
            })
        },

        // 删除
        delItem(scope) {
            if (!scope.row.aggBrandId) {
                this.tableList.splice(scope.$index, 1)
                return
            }
            this.$emit('disassociate', scope, 'aggBrandId', '/product/admin/productPropertyAgg/brand/')
        },

        // 取消关联(编辑时向上触发)
        disassociate(scope) {
            this.$emit('disassociate', scope, 'aggBrandId', '/product/admin/productPropertyAgg/brand/')
        }
    }
}
</script>
