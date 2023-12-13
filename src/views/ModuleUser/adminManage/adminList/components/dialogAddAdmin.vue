<!-- /*
 * @Descripttion:新增
*/ -->
<template>
    <!-- 调整数量 -->
    <el-dialog
        :title="!ruleForm.id ? '添加管理员' : '修改管理员'"
        custom-class="dialog-form-small"
        :close-on-click-modal="false"
        :visible.sync="isVisible"
        @close="resetForm('ruleForm')"
    >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px" size="small">
            <el-form-item label="用户名：" prop="username">
                <el-input
                    v-model="ruleForm.username"
                    :disabled="ruleForm.id ? true : false"
                    placeholder="请输入用户名"
                    maxlength="10"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item v-if="ruleForm.id" label="修改密码：" prop="newPassword">
                <el-input v-model="ruleForm.newPassword" show-password placeholder="请输入修改密码" maxlength="16" />
            </el-form-item>
            <el-form-item v-else label="密码：" prop="password">
                <el-input v-model="ruleForm.password" show-password placeholder="请输入密码" maxlength="16" />
            </el-form-item>
            <el-form-item label="部门：" prop="deptId">
                <el-cascader
                    v-model="ruleForm.deptId"
                    :options="options"
                    :props="{ expandTrigger: 'hover', value: 'id', label: 'name', checkStrictly: true, emitPath: false }"
                    style="width: 100%"
                    @change="handleChange"
                />
            </el-form-item>
            <el-form-item label="角色：" prop="roleIdList">
                <el-select v-model="ruleForm.roleIdList" multiple placeholder="请选择" collapse-tags clearable>
                    <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="lockFlag">
                <el-radio-group v-model="ruleForm.lockFlag">
                    <el-radio :label="true">上线</el-radio>
                    <el-radio :label="false">下线</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="isVisible = false">取 消</el-button>
            <ls-button size="small" type="primary" :async-function="submitForm" :time="0">确 定</ls-button>
        </span>
    </el-dialog>
</template>
<script>
import { menuAuthManage } from '@/api/ModuleSystem'
import { userManage, departmentApi } from '@/api/ModuleUser'
export default {
    mixins: [],
    props: {},
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value && this.$checkInfo([{ type: 'loginPassword', value: value }])) {
                callback()
            } else {
                callback(new Error('请输入由数字、字母不含特殊字符组成5-16长度的密码'))
            }
        }
        return {
            roleList: [],
            isVisible: false,
            ruleForm: {
                id: '',
                roleIdList: [],
                password: '',
                lockFlag: true,
                username: '',
                deptId: undefined
            },
            options: [],
            rules: {
                username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
                roleIdList: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
                lockFlag: [{ required: true, message: '请选择状态', trigger: 'blur' }],
                deptId: [{ required: true, message: '请选择部门角色', trigger: 'blur' }],
                newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            // 部门数据
            options: []
        }
    },
    computed: {},
    watch: {},
    created() {
        this.getRoleList()
    },
    methods: {
        getRoleList() {
            menuAuthManage.getAllRoleList().then((res) => {
                if (res.code === 1) {
                    this.roleList = res.data
                }
            })
        },
        submitForm(formName) {
            return new Promise((resolve) => {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        const params = JSON.parse(JSON.stringify(this.ruleForm)) //深拷贝
                        console.log(this.ruleForm, 'shuju')
                        userManage[!this.ruleForm.id ? 'addAdmin' : 'editAdmin'](params)
                            .then((res) => {
                                if (res.code === 1) {
                                    this.isVisible = false
                                    this.$message.success((this.ruleForm.id ? '修改' : '添加') + '成功')
                                    this.$emit('finish')
                                }
                            })
                            .finally((_) => {
                                console.log('4444444444444')
                                resolve()
                            })
                    } else {
                        resolve()
                    }
                })
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        showDialog() {
            this.isVisible = true
            // 获取 部门信息
            this.getDepartmentList()
        },
        // 获取 部门信息
        getDepartmentList() {
            departmentApi.getAllDeptList().then((res) => {
                if (res.code == 1) {
                    this.options = this.getTreeData(res.data)
                }
            })
        },
        getTreeData(data) {
            // 循环遍历json数据
            for (var i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].children = undefined
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].children)
                }
            }
            return data
        },
        handleChange(value) {
            console.log(this.ruleForm.deptId, 'id')
        }
    }
}
</script>

<style lang="scss" scoped></style>
