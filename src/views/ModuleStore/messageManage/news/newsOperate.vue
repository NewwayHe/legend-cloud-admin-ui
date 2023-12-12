<!-- /*
 * @Descripttion:新增/编辑 编辑新闻
*/ -->
<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" class="w-450p" />
                </el-form-item>

                <el-form-item label="图片" prop="pic">
                    <imgCenter v-model="form.pic" :uploadStyle="{ width: '80px' }" @input="$refs.form.validateField('pic')"></imgCenter>
                </el-form-item>

                <el-form-item label="序号" prop="seq">
                    <el-input v-model="form.seq" type="number" class="w-450p" />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="描述" prop="detail">
                    <TinyMce v-if="form.detail" v-model="form.detail" />
                </el-form-item>

                <el-form-item>
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">
						保存
						<!-- {{ isEdit ? '编辑' : '新增' }} -->
					</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script>
import TinyMce from '@/components/TinyMceNew'
import { specifications } from '@/api/ModuleGoods'
import { news } from '@/api/ModuleStore'

export default {
    components: { TinyMce },
    data() {
        return {
            form: {
                id: '',
                title: '',
                pic: '',
                seq: '',
                status: '',
                detail: ''
            },
            rules: {
                title: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                pic: [{ required: true, message: '请上传图片', trigger: 'change' }],
                seq: [{ required: true, message: '请输入顺序', trigger: 'blur' }],
                status: [{ required: true, message: '请选择状态', trigger: 'change' }],
                detail: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            isEdit: false
        }
    },
    mounted() {
        if (this.$route.query.type == 'edit') {
            this.isEdit = true
            this.getDetail()
        } else {
            this.isEdit = false
        }
    },
    methods: {
        // 获取详情(编辑时调用)
        getDetail() {
            news.detail({
                id: this.$route.query.id
            })
                .then((res) => {
                    this.form = Object.assign({}, this.form, res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 提交
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.isEdit) {
                        this.edit()
                    } else {
                        this.add()
                    }
                }
            })
        },

        // 新增
        add() {
            news.add(this.form)
                .then((res) => {
                    this.$message({
                        message: '新增成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({ path: '/ModuleStore/messageManage/news' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 编辑
        edit() {
            news.edit(this.form)
                .then((res) => {
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({ path: '/ModuleStore/messageManage/news' })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 取消
        onCancel() {
            this.$router.push({ path: '/ModuleStore/messageManage/news' })
        }
    }
}
</script>
