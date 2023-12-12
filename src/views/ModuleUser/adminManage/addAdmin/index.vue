<!-- /*
 * @Descripttion:添加管理员
*/ -->
<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" label-width="135px" size="small">
                <div class="form-title">编辑</div>
                <el-form-item label="管理员账号：">
                    <el-input v-show="isEdit" v-model="form.name" class="w-450p" />
                    <p v-show="!isEdit">{{form.name}}</p>
                </el-form-item>
                <el-form-item label="登录密码：">
                    <el-input v-show="isEdit" v-model="form.name" class="w-450p" />
                    <p v-show="!isEdit">******</p>
                </el-form-item>
                <el-form-item label="部门：">
                    <el-select v-model="form.region" placeholder="请选择" clearable>
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户角色：">
                    <el-tree
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultProps"
                    />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="上线" />
                        <el-radio label="下线" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" @click="isEdit = !isEdit">编辑</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script>
export default {
    data() {
        return {
            data: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: '三级 1-1-1'
                                },
                                {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    label: '一级 2',
                    children: [
                        {
                            id: 5,
                            label: '二级 2-1'
                        },
                        {
                            id: 6,
                            label: '二级 2-2'
                        }
                    ]
                },
                {
                    id: 3,
                    label: '一级 3',
                    children: [
                        {
                            id: 7,
                            label: '二级 3-1'
                        },
                        {
                            id: 8,
                            label: '二级 3-2'
                        }
                    ]
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            imageUrl: '',
            isEdit: true
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        onSubmit() {
            this.$message('submit!')
        },
        onCancel() {
            this.$message({
                message: ' cancel! ',
                type: 'warning'
            })
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>
