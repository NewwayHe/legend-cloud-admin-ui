<!-- /*
 * @Descripttion:管理员列表
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <div class="table">
            <el-card class="mb-15">
                <!--列表-->
                <vxe-table border height="600" :span-method="rowspanMethod" :data="tableData">
                    <vxe-table-column field="name1" title="功能模块">
                        <template v-slot="{ row }">
                            {{ row.name1 }}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="name2" title="详细功能">
                        <template v-slot="{ row }">
                            {{ row.name2 }}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="name3" title="权限类型">
                        <template v-slot="{ row }">
                            {{ row.name3 }}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="name4" title="权限列表">
                        <template v-slot="{ row }">
                            {{ row.name4 }}
                        </template>
                    </vxe-table-column>
                </vxe-table>
                <el-alert type="warning" class="defalult mt-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <p>用户分为两种类型：用户、商家；</p>
                        <p>用户状态为有效时，用户才可正常使用；若状态为失效。用户不可正常登录使用。</p>
                    </div>
                </el-alert>
            </el-card>
        </div>
    </section>
</template>
<script>
import XEUtils from 'xe-utils'

export default {
    components: {},
    data() {
        return {
            tableData: []
        }
    },
    mounted() {
        const treeData = XEUtils.toArrayTree(this.getList())
        this.toColTreeData(treeData)
    },
    methods: {
        getList() {
            const list = [
                { id: '10000', parentId: null, name: '账号管理' },
                { id: '11000', parentId: '10000', name: '用户管理' },
                { id: '11100', parentId: '11000', name: '查看' },
                { id: '11110', parentId: '11100', name: '用户列表' },
                { id: '11200', parentId: '11000', name: '编辑' },
                { id: '11210', parentId: '11200', name: '用户列表' },
                { id: '11220', parentId: '11200', name: '新增用户' },
                { id: '11300', parentId: '11000', name: '操作' },
                { id: '11310', parentId: '11300', name: '新增' },
                { id: '11320', parentId: '11300', name: '删除' },
                { id: '11330', parentId: '11300', name: '修改' },
                { id: '12000', parentId: '10000', name: '角色管理' },
                { id: '12100', parentId: '12000', name: '查看' },
                { id: '12110', parentId: '12100', name: '角色列表' },
                { id: '12200', parentId: '12000', name: '编辑' },
                { id: '122100', parentId: '12200', name: '角色列表' },
                { id: '12220', parentId: '12200', name: '新增角色' },
                { id: '12300', parentId: '12000', name: '操作' },
                { id: '12310', parentId: '12300', name: '新增' },
                { id: '12320', parentId: '12300', name: '删除' },
                { id: '12330', parentId: '12300', name: '修改' },
                { id: '20000', parentId: null, name: '个人中心' },
                { id: '21000', parentId: '20000', name: '个性化设置' },
                { id: '21100', parentId: '21000', name: '查看' },
                { id: '21110', parentId: '21100', name: '信息列表' },
                { id: '21200', parentId: '21000', name: '操作' },
                { id: '21210', parentId: '21200', name: '重置信息' },
                { id: '22000', parentId: '20000', name: '账户管理' },
                { id: '22100', parentId: '22000', name: '查看' },
                { id: '22110', parentId: '22100', name: '账户余额' },
                { id: '22120', parentId: '22100', name: '帐变记录' }
            ]
            return list
        },
        // 将普通树结构转换为横向树列表
        toColTreeData(treeData) {
            const options = { children: 'children' }
            const list = []
            const keyMap = {}
            XEUtils.eachTree(
                treeData,
                (item, index, result, paths, parent) => {
                    keyMap[item.id] = item
                    item.keys = parent ? parent.keys.concat([item.id]) : [item.id]
                    if (!item.children || !item.children.length) {
                        const row = {}
                        item.keys.forEach((key, index) => {
                            const level = index + 1
                            const obj = keyMap[key]
                            row[`check${level}`] = false
                            row[`id${level}`] = obj.id
                            row[`name${level}`] = obj.name
                        })
                        list.push(row)
                    }
                },
                options
            )
            console.log(list)
            this.keyMap = keyMap
            this.tableData = list
        },
        // 通用行合并函数（将相同多列数据合并为一行）
        rowspanMethod({ row, $rowIndex, column, data }) {
            const fields = ['name1', 'name2', 'name3']
            const cellValue = XEUtils.get(row, column.property)
            if (cellValue && fields.includes(column.property)) {
                const prevRow = data[$rowIndex - 1]
                let nextRow = data[$rowIndex + 1]
                if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
                    return { rowspan: 0, colspan: 0 }
                } else {
                    let countRowspan = 1
                    while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
                        nextRow = data[++countRowspan + $rowIndex]
                    }
                    if (countRowspan > 1) {
                        return { rowspan: countRowspan, colspan: 1 }
                    }
                }
            }
        }
    }
}
</script>
