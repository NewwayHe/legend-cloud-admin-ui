<!-- /*
 * @Descripttion: 菜单权限->商家菜单
*/ -->
<template>
    <section>
        <el-card>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="handleCreate(false)">新增</el-button>
                </el-row>
                <!--列表-->
                <el-table
                    v-loading="tableListLoading"
                    :data="menuList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    :tree-props="{ children: 'children', hasChildren: '' }"
					header-row-class-name="headerRow"
                >
                    <el-table-column  prop="name" label="菜单名称" align="left" width="300">
						<template slot-scope="scope">
							<span class="line-clamp1">{{scope.row.name}}</span>
						</template>
					</el-table-column>
                    <el-table-column prop="icon" width="120" label="图标">
                        <template slot-scope="scope">
                            <svg-icon :icon-class="scope.row.icon" class="el-input__icon" v-if="scope.row.icon"/>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="path" label="链接地址" min-width="150"/>
                    <el-table-column prop="component" label="组件地址" min-width="250"/>
                    <el-table-column prop="icon" label="菜单类型">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type == 0 && scope.row.hiddenFlag" type="success">左侧菜单</el-tag>
                            <el-tag v-else-if="scope.row.type == 0 && !scope.row.hiddenFlag" type="warning">隐藏菜单</el-tag>
                            <el-tag v-else type="danger">按钮</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="permission" label="权限标识" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            <span class="line-clamp1 w-100">
                                {{ scope.row.permission || "-" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="顺序" width="100"/>
                    <el-table-column label="操作" fixed="right" width="200" >
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click.stop="handleEdit(scope.row, scope.column, scope.$index)"
                                >
                                    修改
                                </el-link>
                                <el-link :underline="false" type="primary" icon="el-icon-plus" @click="handleCreate(true, scope.row)">
                                    新增下级
                                </el-link>
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    icon="el-icon-delete"
                                    @click.stop="deleteMemu(scope.row, scope.column, scope.$index)"
                                >
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!-- 新增-编辑 -->
        <el-dialog
            :title="dialogForm.title"
            custom-class="dialog-form-small"
            :visible.sync="dialogForm.isVisible"
            :close-on-click-modal="false"
        >
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="98px" label-position="right" size="small">
                <el-form-item label="类型：" prop="type">
                    <el-radio-group v-model="dialogForm.formData.type" size="mini">
                        <el-radio-button label="0">左侧菜单</el-radio-button>
                        <el-radio-button label="1">按钮</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="dialogForm.formData.type == 0" label="上级菜单：" prop="parentId">
                    <template v-if="dialogForm.formData.parentId == -1">
                        <span>顶级菜单</span>
                    </template>
                    <template v-else>
                        <el-cascader
                            v-model="dialogForm.formData.parentId"
                            :options="parentMenuList"
                            :props="{ checkStrictly: true, label: 'name', value: 'id', emitPath: false }"
                            clearable
                            :show-all-levels="false"
                        />
                    </template>
                </el-form-item>

                <el-form-item label="菜单名称：" prop="name">
                    <el-input v-model="dialogForm.formData.name" placeholder="菜单名称" maxlength="20" show-word-limit />
                </el-form-item>
                <template v-if="dialogForm.formData.type == 0">
                    <el-form-item label="链接地址：" prop="path">
                        <el-input v-model="dialogForm.formData.path" placeholder="链接地址" />
                    </el-form-item>
                    <el-form-item label="组件地址：" prop="component">
                        <el-input v-model="dialogForm.formData.component" placeholder="组件地址" />
                    </el-form-item>
                </template>
                <el-form-item label="权限编码：" prop="permission">
                    <el-input v-model="dialogForm.formData.permission" type="textarea" :rows="2" placeholder="权限编码" maxlength="1000" />
                </el-form-item>
                <el-form-item label="顺序：" prop="sort">
                    <el-input v-model="dialogForm.formData.sort" :oninput="$inputMoney" :maxlength="3" placeholder="顺序" />
                </el-form-item>
                <template v-if="dialogForm.formData.type == 0">
                    <el-form-item label="图标：" prop="icon">
                        <el-popover placement="bottom-start" width="450" trigger="click">
                            <IconSelect ref="iconSelect" @selected="selected" />
                            <el-input slot="reference" v-model="dialogForm.formData.icon" placeholder="点击选择图标">
                                <svg-icon
                                    v-if="dialogForm.formData.icon"
                                    slot="prefix"
                                    :icon-class="dialogForm.formData.icon"
                                    class="el-input__icon"
                                />
                                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                            </el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="显示侧边栏：" prop="createUserCode">
                        <el-radio-group v-model="dialogForm.formData.hiddenFlag">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button :loading="sumbitLoading" type="primary" size="small" @click.stop="saveSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import { shopAuthManage } from '@/api/ModuleSystem'
import IconSelect from '@/components/IconSelect'
import { debounce } from '@/utils/utils.js'
export default {
    components: {
        IconSelect
    },
    data() {
        const validParentId = (rule, value, callback) => {
            if (value == this.dialogForm.formData.id) {
                console.log(123)
                console.log(value)
                callback(new Error('非法操作'))
            }
            callback()
        }

        return {
            menuList: [], // 菜单列表
            parentMenuList: [], // 商家端菜单树
            tableListLoading: false, // 表格请求loading
            sumbitLoading: false, // 提交请求loading
            parentName: '', // 父级名称
            searchFilters: {}, // 搜索字段
            dialogForm: {
                isHasTop: false, // 是否有上级
                isEdit: false, // 是否修改
                isVisible: false, // 是否显示
                title: '', // 弹窗标题
                formRule: {
                    name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                    path: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
                    component: [{ required: true, message: '请输入组件地址', trigger: 'blur' }],
                    parentId: [{ validator: validParentId, trigger: 'change' }]
                },
                formData: {
                    icon: '',
                    type: '0',
                    hiddenFlag: true
                }
            }
        }
    },
    created() {
        this.getMenuList()
    },
    mounted() {},
    methods: {
        // 获取整个菜单树
        getMenuTree() {
            shopAuthManage.getShopMenuSelect().then((res) => {
                if (res.code === 1) {
                    this.parentMenuList = res.data
                }
            })
        },

        handleEdit(row = {}) {
            this.dialogForm.isEdit = true
            this.dialogForm.title = '编辑'
            this.dialogForm.isVisible = true
            this.$nextTick(() => {
                this.dialogForm.formData = Object.assign({}, row)
            })
        },
        selected(name) {
            this.dialogForm.formData.icon = name
        },
        handleCreate(isHasTop, row) {
            this.$refs.myForm && this.$refs.myForm.resetFields()
            this.dialogForm.isEdit = false
            this.dialogForm.title = '新增'
            this.dialogForm.isVisible = true
            this.dialogForm.isHasTop = isHasTop
            this.dialogForm.formData.hiddenFlag = true
            this.dialogForm.formData.id = ""     //清除[编辑]连带的数据影响
            this.dialogForm.formData.type = '0'
            if (row) {
                this.parentName = row.name
                this.dialogForm.formData.parentId = row.id
            } else {
                this.dialogForm.formData.parentId = '-1'
            }
            console.log(this.dialogForm.formData)
        },
        getMenuList(params) {
            this.tableListLoading = true
            shopAuthManage.getMenuList({ params, ...this.searchFilters }).then((res) => {
                if (res.code === 1) {
                    this.menuList = res.data
                    this.tableListLoading = false
                }
            })
            this.getMenuTree()
        },
        deleteMemu(row) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            })
                .then((res) => {
                    shopAuthManage.deleteMenu(row.id).then((res) => {
                        if (res.code === 1) {
                            this.$message.success('删除成功')
                            this.getMenuList()
                        }
                    })
                })
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
        dbnSearch: debounce(function () {
            this.getMenuList()
        }),
        saveSubmit(formName) {
            this.sumbitLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    shopAuthManage[this.dialogForm.isEdit ? 'editMenu' : 'saveMenu'](this.dialogForm.formData)
                        .then((res) => {
                            if (res.code === 1) {
                                this.$message.success(`${this.dialogForm.title}成功`)
                                this.getMenuList()
                                this.dialogForm.isVisible = false
                            }
                            this.sumbitLoading = false
                        })
                        .catch((err) => {
                            console.log(err)
                            this.sumbitLoading = false
                        })
                } else {
                    this.sumbitLoading = false
                    return false
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
    }
}
</script>
