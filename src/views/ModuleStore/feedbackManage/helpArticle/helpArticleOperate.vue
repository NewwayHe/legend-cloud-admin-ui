<!-- /*
 * @Descripttion:帮助文章 - 新增/编辑
*/ -->
<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small">
                <el-form-item label="添加方式：" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">输入内容添加</el-radio>
                        <el-radio :label="2">配置链接添加</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="显示页面：" prop="displayPage">
                    <el-checkbox-group v-model="pageTypeList" @change="pageType">
                        <el-checkbox :label="1">用户端帮助中心</el-checkbox>
                        <el-checkbox :label="2">商家端帮助中心</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="帮助栏目：" prop="newsCategoryId">
                    <el-select v-model="form.newsCategoryId" class="w-450p" clearable filterable placeholder="请选择">
                        <el-option v-for="item in newsCategoryList" :key="item.id" :label="item.newsCategoryName" :value="item.id" />
                    </el-select>
                </el-form-item>
				
                <el-form-item label="标题：" prop="newsTitle">
                    <el-input v-model="form.newsTitle" class="w-450p" maxlength="20" show-word-limit placeholder="请输入"/>
                </el-form-item>

                <el-form-item v-if="form.type == 2" label="跳转链接：" prop="url">
                    <el-input v-model="form.url" class="w-450p" type="textarea" maxlength="150" show-word-limit autosize/>
                </el-form-item>

                <el-form-item v-show="form.type == 1" label="摘要：">
                    <el-input v-model="form.newsBrief" class="w-450p" type="textarea" maxlength="50" rows="3" show-word-limit placeholder="请输入"/>
                </el-form-item>

                <el-form-item label="顺序：" prop="seq">
                    <el-input
                        v-model="form.seq"
                        type="number"
                        class="w-450p"
                        oninput="if(value.length>6)value=value.slice(0,10)"
                        onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                        placeholder="请输入"
                    />
                </el-form-item>

                <el-form-item v-if="form.type == 1" label="描述：" prop="newsContent">
                    <TinyMce :key="tinymceIndex" v-model="form.newsContent" />
                </el-form-item>

                <el-form-item label="状态：" prop="status" class="btn_lastItem">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="btnArea">
                    <el-button @click="onCancel">取消</el-button>
                    <ls-button type="primary" :asyncFunction="onSubmit">
						保存
					</ls-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script>
import TinyMce from '@/components/TinyMceNew'
import { helpArticle } from '@/api/ModuleStore'

export default {
    components: { TinyMce },
    watch: {
        'pageTypeList.length'(nL) {
            if(nL > 0) {
                this.$refs.form.clearValidate('displayPage')
            }else {
                this.$nextTick(()=> {       //数组清空了 但是displayPage还没有被清空 
                    this.$refs.form.validateField('displayPage')
                })
            }
        }
    },
    data() {
        return {
            form: {
                id: '',
                newsCategoryId: undefined,
                newsTitle: '',
                newsBrief: '',
                newsContent: '',
                seq: '',
                status: 1,
                type: 1,
                displayPage: 1,
                url: ''
            },
            tinymceIndex: 1,
            pageTypeList: [1], // 显示页面数组
            rules: {
                type: [{ required: true, message: '请选择添加方式', trigger: ['blur', 'change'] }],
                newsCategoryId: [{ required: true, message: '请选择栏目', trigger: ['blur', 'change'] }],
                newsTitle: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                displayPage: [{ required: true, message: '请选择显示页面', trigger: 'blur' }],
                seq: [{ required: true, message: '请输入顺序', trigger: 'blur' }],
                newsContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
                url: [{ required: true, message: '请输入外链链接', trigger: 'blur' }]
            },
            isEdit: false,
            newsCategoryList: []
        }
    },
    beforeRouteEnter(to,from,next) {
        if(to.query.type == 'edit') {
            to.meta.title = '编辑帮助文章'     //更改tab页同步标题
        }else {
            to.meta.title = '新增帮助文章'     //更改tab页同步标题
        }
        next()
    },
    mounted() {
        this.getAllNewsCategory()
        if (this.$route.query.type == 'edit') {
            this.isEdit = true
            this.getDetail()
        } else {
            this.isEdit = false
        }
    },
    methods: {
        // 获取所有栏目
        getAllNewsCategory() {
            helpArticle
                .newsDisplayCategory({
                    displayPage: this.form.displayPage
                })
                .then((res) => {
                    this.newsCategoryList = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取详情(编辑时调用)
        getDetail() {
            helpArticle
                .detail({
                    id: this.$route.query.id
                })
                .then((res) => {
                    this.$nextTick(() => {
                        this.$set(this, 'form', res.data)
                        if (res.data.displayPage == 1 || res.data.displayPage == 2) {
                            this.pageTypeList = [res.data.displayPage]
                        } else {
                            this.pageTypeList = [1, 2]
                        }
                        this.tinymceIndex++
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 选择显示的页面
        pageType(value) {
            if (value.length > 1) {
                this.$set(this.form, 'displayPage', 3)
            } else if (value.length == 0) {
                this.$set(this.form, 'displayPage', '')
            } else {
                this.$set(this.form, 'displayPage', value[0])
            }
            this.newsCategoryList = []
            this.$set(this.form, 'newsCategoryId', '')
            if (this.form.displayPage) {
                this.getAllNewsCategory()
            }
        },

        // 提交
        onSubmit() {
            return new Promise(resolve=>{
                this.$refs.form.validate(async (valid) => {
                console.log(this.form)
                    if (valid) {
                        if (this.isEdit) {
                            await this.edit()
                        } else {
                            await this.add()
                        }
                        resolve()
                    }else{
                        resolve()
                    }
                })
            })
        },

        // 新增
        add() {
            return new Promise(resolve=>{
                helpArticle
                .add(this.form)
                .then((res) => {
                    if (res.code) {
                        this.$message({
                            message: '新增成功',
                            type: 'success',
                        })
                        this.$router.push({ path: '/ModuleStore/feedbackManage/helpArticle' })
                    }
                })
                .catch((err) => {
                    console.log(err)
                }).finally(()=>{
                    resolve()
                })
            })
            
        },

        // 编辑
        edit() {
            return new Promise(resolve=>{
            helpArticle
                .edit(this.form)
                .then((res) => {
                    if (res.code) {
                        this.$message({
                            message: '编辑成功',
                            type: 'success',
                        })
                        this.$router.push({ path: '/ModuleStore/feedbackManage/helpArticle' })
                    }
                })
                .catch((err) => {
                    console.log(err)
                }).finally(()=>{
                    resolve()
                })
            })
        },

        // 取消
        onCancel() {
            this.$router.push({ path: '/ModuleStore/feedbackManage/helpArticle' })
        }
    }
}
</script>
<style lang="scss" scoped>
    >>>.el-textarea{
        >.el-textarea__inner{
            overflow: hidden;
            word-break: break-all;
        }
        .el-input__count{
            line-height: 1;
        }
    }
</style>
