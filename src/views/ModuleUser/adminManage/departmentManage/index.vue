<!-- /*
 * @Descripttion:部门管理
*/ -->
<template>
    <section>
        <!-- 查询 -->
        <div class="table">
            <el-card class="mb-15">
                <el-row class="mb-20">
                   <el-col><el-button type="primary" size="medium" @click="handleCreate">新增</el-button></el-col>
                </el-row>
                <!--列表-->
                <el-table
                    ref="table"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    lazy
                    :indent="20"
                    :load="load"
                    :tree-props="{ hasChildren: 'hasChildren' }"
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column prop="name" label="部门名称" />
                    <el-table-column prop="contact" label="部门联系人" />
                    <el-table-column prop="mobile" label="联系电话" />
                    <el-table-column prop="createTime" label="创建日期" width="140"/>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    编辑
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" icon="el-icon-plus" @click="handleCreate(scope.row)">新增下级</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <!-- 新增-编辑 -->
        <el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="98px" size="small" label-position="right">
                <el-form-item v-if="dialogForm.formData.parentId != -1" label="上级部门：" prop="parentName">
                    {{ parentName }}
                </el-form-item>
                <el-form-item label="部门名称：" prop="name">
                    <el-input v-model="dialogForm.formData.name" placeholder="部门名称" />
                </el-form-item>
                <el-form-item label="部门联系人：" prop="contact">
                    <el-input v-model="dialogForm.formData.contact" placeholder="部门联系人" />
                </el-form-item>
                <el-form-item label="联系电话：" prop="mobile">
                    <el-input v-model="dialogForm.formData.mobile" placeholder="联系电话" maxlength="11" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <ls-button type="primary" size="small" :asyncFunction="saveSubmit">确 定</ls-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import { departmentApi } from '@/api/ModuleUser.js'
import { debounce } from '@/utils/utils.js'

export default {
    name: 'DepartmentManage',
    components: {},
    data() {
        return {
            tableListLoading: false,
            dialogForm: {
                isHasTop: false, // 是否有上级
                isEdit: false, // 是否修改
                isVisible: false, // 是否显示
                title: '', // 弹窗标题
                formRule: {
                    name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
                    contact: [{ required: true, message: '请输入部门联系人', trigger: 'blur' }],
                    mobile: [
                        { required: true, message: `请输入正确的手机号码`, trigger: 'blur' },
                        { min: 11, max: 11, message: '请输入11位数字的手机号码', trigger: 'blur' }
                    ]
                },
                formData: {
                    parentId: -1,
                    name: '',
                    contact: '',
                    mobile: ''
                }
            },
            parentName: '',
            tableList: [],
            searchFilters: {
                parentId: '-1'
            }
        }
    },
    watch: {
        'dialogForm.isVisible': {
            handler(newV) {
                if (newV === false) {
                    this.$refs.myForm && this.$refs.myForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        dbnSearch: debounce(function () {
            this.getData()
        }),
        // 初始化
        getData() {
            this.tableListLoading = true
            departmentApi
                .getSubDeptList(this.searchFilters.parentId)
                .then((res) => {
                    this.tableListLoading = false
                    this.tableList = res.data
                    this.$refs.table.doLayout()
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },
        // 编辑
        handleEdit(row) {
            this.dialogForm.isEdit = true
            this.dialogForm.title = '编辑'
            this.dialogForm.isVisible = true
            this.$nextTick(() => {
                this.parentName = row.parentName
                this.dialogForm.formData = this.$utils.object.deepClone(row)
            })
        },
        handleCreate(row) {
            this.$refs.myForm && this.$refs.myForm.resetFields()
            this.dialogForm.isEdit = false
            this.dialogForm.title = '新增'
            this.dialogForm.isVisible = true
            if (row) {
                this.$nextTick(() => {
                    this.parentName = row.name
                    this.dialogForm.formData.parentId = row.id
                })
            } else {
                this.dialogForm.formData.parentId = -1
            }
            console.log(row)
        },
        // 懒加载
        load(row, treeNode, resolve) {
            departmentApi
                .getSubDeptList(row.id)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        //更新子部门数据
        updateSubDepData(parentId) {
            if (parentId == -1) {
                this.getData()
            } else {
                departmentApi.getSubDeptList(parentId).then((res) => {
                    this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, res.data)
                })
            }
        },
        saveSubmit() {
            return new Promise(resolve=>{
                this.sumbitLoading = true
                this.$refs.myForm.validate((valid) => {
                    if (valid) {
                        departmentApi[this.dialogForm.isEdit ? 'editDept' : 'addDept'](this.dialogForm.formData)
                            .then((res) => {
                                if (res.code === 1) {
                                    this.$message.success(`${this.dialogForm.title}成功`)
                                    // 解决当一级没有下级的时候，不会显示拥有下级图标，手动添加一个hasChildren
                                    this.tableList.forEach((item) => {
                                        if (item.id == this.dialogForm.formData.parentId) {
                                            item.hasChildren = true
                                        }
                                    })
                                    this.updateSubDepData(this.dialogForm.formData.parentId || -1)
                                    this.dialogForm.isVisible = false
                                }
                                this.sumbitLoading = false
                            })
                            .catch((err) => {
                                console.log(err)
                                this.sumbitLoading = false
                            }).finally(_=>{
                                resolve()
                            })
                    } else {
                        this.sumbitLoading = false
                        resolve()
                        return false
                    }
                })
            })
        },
        // 删除
        handleDel(row) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                departmentApi.deleteDept(row.id).then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
                        if (row.parentId == -1) {
                            this.getData()
                        } else {
                            departmentApi.getSubDeptList(row.parentId).then((res) => {
                                this.updateSubDepData(row.parentId)
                            })
                        }
                    }
                })
            })
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
    margin-right: 10px !important;
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
