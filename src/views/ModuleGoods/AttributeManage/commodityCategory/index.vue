<!-- /*
 * @Descripttion:商品类目
*/ -->
<template>
    <section>
        <div class="table">
            <el-card class="mb-15" shadow>
                <!-- 指引 -->
                <step />
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="toAdd">新增一级类目</el-button>
                </el-row>
                <el-row class="mb-20">
                    <el-alert class="theme" :closable="false" show-icon>
                        <p>商品类目：用于管理商品，需要先创建一级类目＞再创建二级类目＞再创建三级类目</p>
                    </el-alert>
                </el-row>

                <el-table
                    ref="table"
                    :key="reloadTime"
                    v-loading="tableListLoading"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    lazy
                    border
                    :indent="70"
                    :data="tableList"
                    :load="load"
                    :tree-props="{ hasChildren: 'hasChildren' }"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无相关类目" />
                    </template>
                    <el-table-column prop="name" label="类目类型" align="left" width="300">
                        <template slot-scope="scope">
                            <span v-if="scope.row.grade == 1" class="ml-10">一级类目</span>
                            <span v-if="scope.row.grade == 2" class="ml-10">二级类目</span>
                            <span v-if="scope.row.grade == 3" class="ml-10">三级类目</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="类目名称" min-width="300" align="left" />
                    <el-table-column prop="icon" label="类目图片" width="200">
                        <template slot-scope="scope">
                            <ls-image :src="scope.row.icon" :options="{ w: '50', h: '50', br: '4' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="seq" label="权重" min-width="80" align="left" />
                    <el-table-column prop="icon" label="状态" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                            <span v-else class="status-done">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="checkDetail(scope.row)">查看</el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">编辑</el-link>
                                <el-link :underline="false" type="primary" @click.stop="dialogOpen(scope.row)">
                                    {{ scope.row.status ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row)">删除</el-link>
                                <el-link v-if="scope.row.grade < 3" :underline="false" type="primary" @click="addNextCategory(scope.row)">
                                    {{ scope.row.grade == 1 ? '添加二级类目' : '添加三级类目' }}
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" custom-class="dialog-form-small" :before-close="dialogClose">
            <div>
                <el-alert show-icon class="theme" :closable="false">
                    <template v-if="updateStateItem.hasChildren">
                        <span slot="title">
                            {{ updateStateItem.status ? '类目下线后，是否下线关联的商品？' : '类目上线后，是否上线关联的商品？' }}
                        </span>
                    </template>
                    <template v-else>
                        <span slot="title">
                            {{ updateStateItem.status ? '类目下线后，用户无法浏览该类目。确定下线？' : '类目上线后，用户无法浏览该类目。确定上线？' }}
                        </span>
                    </template>
                </el-alert>
                <el-form v-if="updateStateItem.hasChildren" label-width="98px" size="small" class="mt-20">
                    <el-form-item label="选择下线范围：" style="padding: 0 16px">
                        <el-radio-group v-model="radioStatus">
                            <el-radio :label="true">{{ updateStateItem.status ? '下线' : '上线' }}类目和商品</el-radio>
                            <el-radio :label="false">仅{{ updateStateItem.status ? '下线' : '上线' }}类目</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogClose">取 消</el-button>
                <el-button v-ls-loading type="primary" size="small" @click="updateState(undefined)">确定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import Step from '../components/Step'
import { category } from '@/api/ModuleGoods'
import { debounce } from '@/utils/utils.js'
export default {
    name: 'CommodityCategory',
    components: {
        Step
    },
    data() {
        return {
            searchFilters: {
                parentId: '-1'
            },
            tableListLoading: false,
            tableList: [],
            dialogVisible: false,
            reloadTime: Date.now(),
            updateStateItem: {},
            radioStatus: true //下线范围单选
        }
    },
    mounted() {},
    activated() {
        console.log('进入了activated')
        //如果页面从添加分类进来就会获取分类父级id，初始化该子级的数据
        let parentId = localStorage.getItem('categoryParentId')
        console.log(parentId)
        localStorage.removeItem('categoryParentId')
        this.updateSubDepData(parentId)
    },
    methods: {
        // 初始化
        getData() {
            this.tableListLoading = true
            category
                .page({
                    parentId: this.searchFilters.parentId
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.tableList = res.data
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 搜索
        dbnSearch: debounce(function () {
            this.page.curPage = 1
            this.getData()
        }),

        // 懒加载
        load(row, treeNode, resolve) {
            category
                .page({
                    parentId: row.id
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 查看详情
        checkDetail(row) {
            this.$router.push({
                name: 'categoryDetail',
                query: { id: row.id }
            })
        },

        // 新增一级类目
        toAdd() {
            this.$router.push({
                name: 'categoryOperate',
                query: { status: 'add', grade: '1' }
            })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({
                name: 'categoryOperate',
                query: { status: 'edit', grade: row.grade, parentId: row.parentId, categoryId: row.id }
            })

            localStorage.setItem('categoryParentId', row.parentId || -1)
        },

        // 添加下级类目
        addNextCategory(row) {
            localStorage.setItem('categoryParentId', row.id || -1)
            this.$router.push({
                name: 'categoryOperate',
                query: { parentName: row.name, status: 'add', grade: row.grade + 1, parentId: row.id }
            })
        },
        //更新子类目数据
        updateSubDepData(parentId) {
            console.log(this.tableList)
            if (!parentId || parentId == -1) {
                this.getData()
            } else {
                console.log(12121212121)
                category.page({ parentId }).then((res) => {
                    this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, res.data)
                    // this.reloadTime = Date.now()
                })
            }
        },
        // 上/下线
        updateState: debounce(function (includeProduct) {
            if (this.updateStateItem.hasChildren) {
                includeProduct = this.radioStatus
            }
            category
                .changeStatus(this.updateStateItem.id, Number(!this.updateStateItem.status), { includeProduct: includeProduct })
                .then((res) => {
                    if (res.code) {
                        this.$message.success('操作成功')
                        this.updateSubDepData(this.updateStateItem.parentId) //更新自身
                        if (includeProduct == true) {
                            this.updateSubDepData(this.updateStateItem.id) //更新子
                        }
                        this.dialogClose()
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            // })
        }),

        // 删除
        handleDel(row) {
            console.log(this.$refs.table.store.states.lazyTreeNodeMap)
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                category.delete(row.id).then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
                        this.updateSubDepData(row.parentId)
                    }
                })
            })
        },
        dialogOpen(row) {
            this.dialogVisible = true
            this.updateStateItem = row
        },
        dialogClose() {
            this.dialogVisible = false
            this.updateStateItem = {}
            this.radioStatus = true
        }
    }
}
</script>

<style lang="scss" scoped>
.el-tree ::v-deep .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

::v-deep .el-table__expand-icon {
    transition: none;
    vertical-align: bottom;
    margin-right: 0 !important;
}

//有子节点 且未展开
.el-table::v-deep .el-icon-arrow-right:before {
    content: '\E78A';
    display: block;
    width: 20px;
    height: 20px;
    font-size: 20px;
    background-size: 16px;
    color: #409eff;
}
//有子节点 且已展开
.el-table::v-deep .el-table__expand-icon--expanded {
    transform: none;
    .el-icon-arrow-right:before {
        content: '\E784';
        display: block;
        width: 20px;
        height: 20px;
        font-size: 20px;
        background-size: 16px;
        color: #409eff;
    }
}
</style>
