<template>
    <section class="formWarp">
        <el-card>
            <el-form ref="form" :model="form" :rules="formRule" label-width="150px" size="small">
                <el-form-item label="类目类型：" prop="grade">
                    <span v-if="form.grade == 1">一级类目</span>
                    <span v-if="form.grade == 2">二级类目</span>
                    <span v-if="form.grade == 3">三级类目</span>
                </el-form-item>
                <el-form-item label="类目名称：" prop="name">
                    <el-input v-model.trim="form.name" class="w-450p" maxlength="6" placeholder="请输入" show-word-limit/>
                    <span class="m-20 text-999">类目名称，会显示在用户端给用户查看</span>
					<imgPreview placement="bottom" :src="require(`@/assets/images/exampleImgs/leimuName${form.grade}.png`)" v-if="form.grade"/>
				</el-form-item>
                <el-form-item label="权重：" prop="seq">
					<lsInput class="w-450p" placeholder='请输入' v-model="form.seq" textAlign="left" :precision="0" :min="0" :max="999999"/>
                    <span class="m-20 text-999">设置类目权重</span>
                </el-form-item>
                <!-- <el-form-item v-if="form.grade == 1" label="选择图标：" prop="icon"> -->
                <el-form-item label="选择图标：" prop="icon">
                    <div class="d-flex a-end">
                        <imgCenter v-model="form.icon"></imgCenter>
                        <span class="mx-20 text-999">图标展示在用户端{{form.grade == 1?'一':(form.grade == 2?'二':'三')}}级类目，建议尺寸120*120px</span>
						<imgPreview class="ml-20" placement="bottom" :src="require(`@/assets/images/exampleImgs/label${form.grade == 1||form.grade == 2?'2':'3'}.png`)" />
						<imgPreview class="ml-20" placement="top" text="PC用户端示例" :src="require('@/assets/images/exampleImgs/label.png')" />
                    </div>
                </el-form-item>
                <el-form-item label="关联规格参数分组：" prop="aggId">
                    <el-select v-model="form.aggId" placeholder="请选择" class="w-450p" clearable>
                        <el-option v-for="item in aggList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <span class="m-20 text-999">关联规格参数分组后，使用该类目的商品可使用关联的规格、参数、品牌等信息</span>
                </el-form-item>
                <el-form-item label="退货有效时间：" prop="returnValidPeriod">
                    <div class="refundPeriod">
                        <div class="d-flex a-center w-450p">
							<lsInput class="flex-1" placeholder='请输入天数' v-model="form.returnValidPeriod" :precision="0" :min="0" :max="999999">
								<span class="" slot="append">天</span>
							</lsInput>
                        </div>
                        <span class="mx-20 text-999">若没设置类别有效时间，则使用平台有效时间</span>
                    </div>
                </el-form-item>
                <el-form-item label="状态：" prop="status" class="btn_lastItem">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="btnArea">
                    <el-button @click="onCancel">取消</el-button>
                    <el-button v-ls-loading type="primary" @click="onSubmit">
						保存
					</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>
<script>
import { category } from '@/api/ModuleGoods'
export default {
    components: {},
    data() {
        return {
            form: {
                id: '',
                grade: '',
                parentId: '',
                parentName: '', // 父级名称
                name: '',
                seq: undefined,
                icon: '',
                aggId: '',
                returnValidPeriod: undefined,
                keyword: '',
                catDesc: '',
                title: '',
                status: 1
            },
            formRule: {
                parentId: [{ required: true }],
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                seq: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '请选择类目状态', trigger: 'blur' }]
            },
            aggList: [], // 规格参数分组数组
            isEdit: false // 编辑标识
        }
    },
    beforeRouteEnter(to,from,next) {
        if(to.query.status == 'edit') {
            to.meta.title = '编辑商品类目'     //更改tab页同步标题
        }else {
            to.meta.title = '新增商品类目'     //更改tab页同步标题
        }
        next()
    },
    mounted() {
        this.getAggList()
        this.form.grade = Number(this.$route.query.grade)
        this.form.parentId = this.$route.query.parentId || -1

        this.form.parentName = this.$route.query.parentName || ''
        if (this.$route.query.status === 'edit') {
            this.isEdit = true
            this.getDetail()
        } else {
            this.isEdit = false
        }
    },
    methods: {
        // 获取详情(编辑时调用)
        getDetail() {
            category
                .detail(this.$route.query.categoryId)
                .then((res) => {
                    this.form = Object.assign({}, this.form, res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取所有规格参数数组
        getAggList() {
            category
                .aggListAll()
                .then((res) => {
                    this.aggList = res.data
                    this.aggList.unshift({ id: '', name: '无' })
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

        // 添加
        add() {
            category
                .add(this.form)
                .then((res) => {
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    })
                    this.$router.push({
                        name: 'commodityCategory'
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 编辑
        edit() {
            console.log('test', this.form)
            category
                .edit(this.form)
                .then((res) => {
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({
                                name: 'commodityCategory'
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 选择图标
        selected(name) {
            this.form.icon = name
        },

        // 取消
        onCancel() {
            this.$router.push({ name: 'commodityCategory' })
        },

        // 检查图片不能为空
        checkPic(rule, picValue, callback) {
            if (picValue === '') {
                callback(new Error('请上传图片'))
            } else {
                callback()
            }
        },
    }
}
</script>

<style lang='scss'>
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>
<style lang="scss" scoped>
.el-input-number {
    ::v-deep .el-input__inner {
        text-align: left;
    }
}

.refundPeriod {
    display: flex;
    align-items: flex-start;
    ::v-deep .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        text-align: left;
    }
    .custom-day {   
        border: 1px solid #dcdfe6; 
        line-height: 32px; 
        height: 32px; 
        border-radius: 0 4px 4px 0;
        margin-left: -1px;
    }
}

</style>