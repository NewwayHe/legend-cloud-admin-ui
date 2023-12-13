<template>
    <!-- /*
	 * @Descripttion:分类广告
	*/ -->
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                <el-form-item label="一级分类" prop="categoryId">
                    <el-select v-model="searchFilters.categoryId" filterable placeholder="请选择" clearable>
                        <el-option v-for="item in firstCat" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告名称"><el-input v-model="searchFilters.advImgName" placeholder="广告名称" /></el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                        <el-option label="上线" :value="1" />
                        <el-option label="下线" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    <el-button size="small" type="primary" @click.stop="handleCreate">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table mt-10">
            <!--列表-->
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="tableList"
                tooltip-effect="dark"
                class="w-100"
                header-row-class-name="headerRow"
                @selection-change="selectionChange"
            >
                <template slot="empty">
                    <empty empty-type="pro" text="暂无数据" />
                </template>
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column prop="categoryName" label="一级分类" align="center" />
                <el-table-column prop="advImgName" label="广告名称" align="center" />
                <el-table-column prop="advPath" label="广告图片" align="center" width="300">
                    <template slot-scope="scope">
                        <ls-image style="vertical-align: middle" :src="scope.row.advPath" :options="{ w: '255', h: '60', br: '6' }" />
                    </template>
                </el-table-column>
                <el-table-column prop="advUrl" label="广告链接" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.advUrl && scope.row.advUrl.id" class="line-clamp2">
                            {{ scope.row.advUrl.type }}:{{ scope.row.advUrl.name.toString() }}
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-link v-if="String(scope.row.status) == '1'" :underline="false" type="success">上线</el-link>
                        <el-link v-else :underline="false" type="warning">下线</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="180px">
                    <template slot-scope="scope">
                        <span class="table__action">
                            <el-link :underline="false" type="primary" @click="changeStatus(scope.row)">
                                {{ scope.row.status ? '下线' : '上线' }}
                            </el-link>
                            <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">修改</el-link>
                            <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <LsSticky :data="tableList">
                <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </LsSticky>
        </div>
        <!-- 新增-编辑 -->
        <el-dialog :title="dialogForm.title" custom-class="dialog-form" width="600px" :visible.sync="dialogForm.isVisible">
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="95px" label-position="right" size="small">
                <el-form-item label="一级分类" prop="categoryId">
                    <el-select v-model="dialogForm.formData.categoryId" filterable placeholder="请选择">
                        <el-option v-for="item in firstCatTemp" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告名称" prop="advImgName">
                    <el-input v-model="dialogForm.formData.advImgName" placeholder="广告名称" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item label="广告图片：" prop="advPath">
                    <div class="d-flex a-start">
                        <imgCenter v-model="dialogForm.formData.advPath" @input="$refs.myForm.validateField('advPath')"></imgCenter>
                        <span class="text-999 font ml-15" style="vertical-align: top">建议尺寸：510*160px</span>
                    </div>
                </el-form-item>
                <el-form-item label="广告链接" prop="advUrl">
                    <dialogUrl v-model="dialogForm.formData" field="advUrl" />
                </el-form-item>
                <el-form-item label="公告状态" prop="status">
                    <el-radio-group v-model="dialogForm.formData.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="debounceSubmit('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { request } from '@/utils/request'
import { category } from '@/api/ModuleGoods'
import dialogUrl from '../../../../ModuleTrim/components/dialogUrl/dialogUrl'

export default {
    name: '',
    components: { dialogUrl },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                categoryId: '',
                name: '',
                type: ''
            },
            dialogForm: {
                formRule: {
                    categoryId: [
                        {
                            required: true,
                            message: '请先选择分类',
                            trigger: 'blur'
                        }
                    ],
                    advImgName: [
                        {
                            required: true,
                            message: '请输入广告名称',
                            trigger: 'blur'
                        }
                    ],
                    advPath: [
                        {
                            required: true,
                            message: '请上传图片',
                            trigger: 'change'
                        }
                    ],
                    advUrl: [
                        {
                            required: true,
                            message: '请输入广告链接',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '请选择广告状态',
                            trigger: 'blur'
                        }
                    ]
                },
                formData: {
                    status: 1 //默认上线
                }
            },
            switchType: 'top',
            url: {
                getData: '/shop/admin/catAdvert', //加载列表
                delete: '/shop/admin/catAdvert', //删除
                update: '/shop/admin/catAdvert', //修改
                create: '/shop/admin/catAdvert' //新增
            },
            firstCat: [] //一级分类
        }
    },
    computed: {
        firstCatTemp() {
            // 将已经设置了分类广告的一级分类排队掉
            let newArr = this.firstCat.filter((item) => {
                // 将arr的所有id集合的数组赋值给临时数组,
                //map()会返回一个新数组,并且不会影响原数组
                let arrlist = this.tableList.map((item2) => item2.categoryId)
                // 返回所有临时数组中没有item.id的item
                return !arrlist.includes(item.id)
            })
            return newArr
        }
    },
    watch: {
        'dialogForm.formData.advPath'(newVal) {
            if (newVal) {
                this.$refs.myForm.validateField('advPath')
            }
        }
    },
    mounted() {
        console.log(this.dialogForm)
        this.getData()
        this.getCategory()
    },
    methods: {
        // 上/下线
        changeStatus(row) {
            this.$confirm(`${row.status ? '下线后，用户无法在商城中查看。确定下线？' : '上线后，用户可以在商城中查看。确定上线？'}`, '消息提示', {
                type: 'warning'
            })
                .then(() => {
                    request
                        .put(`/shop/admin/catAdvert/batch/status?status=${Number(!row.status)}`, [row.id])
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },
        // 获取全部一级分类
        getCategory() {
            category.page({ parentId: -1 }).then((res) => {
                this.firstCat = res.data
            })
        }
    }
}
</script>
