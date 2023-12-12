 <!-- /*
 * @Descripttion: 菜单权限->商家角色->配置权限
*/ -->
<template>
    <!-- 调整数量 -->
    <!-- 新增-编辑 -->
    <el-dialog title="配置权限" custom-class="dialog-form-small" :visible.sync="isVisible">
        <el-form ref="myForm" label-width="98px" label-position="right" size="small">
            <el-form-item label="权限列表：" prop="title">
                <el-tree
                    ref="tree"
                    :data="roleTreeData"
                    show-checkbox
                    node-key="id"
                    :props="defaultProps"
                    :default-checked-keys="roleList"
                    :check-strictly="checkStrictly"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click.stop="isVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click.stop="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { shopAuthManage } from '@/api/ModuleSystem'
export default {
    mixins: [],
    props: ['roleId'],
    data() {
        return {
            isVisible: false,
            roleTreeData: [],
            roleList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkStrictly: true
        }
    },
    computed: {},
    watch: {
        roleId(newVal) {
            this.getRoleList(newVal)
        }
    },
    created() {
        this.getRoleTree()
    },
    methods: {
        submitForm(formName) {
            const keys = this.$refs.tree.getCheckedKeys()
            const parentKeys = this.$refs.tree.getHalfCheckedKeys()//父节点也要传，不然即使选了子节点也还是没权限
            shopAuthManage.saveRole({ roleId: this.roleId, menuIds: keys.concat(parentKeys).join() }).then((res) => {
                if (res.code === 1) {
                    this.$message.success(`编辑成功`)
                } else {
                    this.$message.error(`编辑失败`)
                }
                this.isVisible = false
            })
        },
        getRoleList(id) {
            shopAuthManage.getRoleList(id).then((res) => {
                if (res.code === 1) {
                    this.checkStrictly = true
                    this.roleList = res.data || []
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(this.roleList)
                        this.checkStrictly = false
                        console.log('asdasd', this.checkStrictly)
                    })
                }
            })
        },
        getRoleTree() {
            shopAuthManage.getMenuList().then((res) => {
                if (res.code === 1) {
                    this.roleTreeData = res.data
                }
            })
        },
        resetForm(formName) {},
        showDialog() {
            this.isVisible = true
        }
    }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped></style>
