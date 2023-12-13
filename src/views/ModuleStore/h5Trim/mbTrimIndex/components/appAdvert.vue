<template>
    <!-- /*
	 * @Descripttion:APP启动广告
	*/ -->
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                <el-form-item label="广告名称"><el-input v-model="searchFilters.name" placeholder="广告名称" /></el-form-item>
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
        <el-alert
            title="APP启动广告在APP端会随机选择一张图片展示，APP端展示广告后，24小时内进入APP将不会再展示启动广告。备注：为了增加体验，安装完APP后第一次进入APP时，是不会显示APP广告的，第二次进入APP才会显示启动广告"
            type="warning"
            class="theme mb-20"
            :closable="false"
            show-icon
        ></el-alert>
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
                <el-table-column label="序号" type="index" width="100" />
                <el-table-column prop="name" label="广告名称" align="center" />
                <el-table-column prop="imgUrl" label="广告图" align="center">
                    <template slot-scope="scope">
                        <ls-image style="vertical-align: middle" :src="scope.row.imgUrl" :options="{ w: '50', h: '50', br: '6' }" />
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="广告链接" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.url && scope.row.url.id" class="line-clamp2">
                            {{ scope.row.url.type }}:{{ scope.row.url.name.toString() }}
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
                <el-form-item label="广告名称" prop="name">
                    <el-input v-model="dialogForm.formData.name" class="w-200p" placeholder="广告名称" maxlength="10" />
                </el-form-item>
                <el-form-item label="广告图" prop="imgUrl">
                    <div class="d-flex a-start">
                        <imgCenter v-model="dialogForm.formData.imgUrl" @input="$refs.myForm.validateField('imgUrl')"></imgCenter>
                        <span class="text-999 ml-15 flex-1 overflow-h line-h-md">
                            建议尺寸：宽度750px，高度>=1500px，图片会保留宽度不变(屏幕宽度的100%)，然后根据宽度来定义图片的高度，所以图片的高度尽量的要大于市面上最长的手机的屏幕高度
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="广告链接" prop="url">
                    <dialogUrl v-model="dialogForm.formData" field="url" />
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
import { startAdvert } from '@/api/ModuleStore'
import dialogUrl from '../../../../ModuleTrim/components/dialogUrl/dialogUrl'

export default {
    name: '',
    components: { dialogUrl },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                type: ''
            },
            dialogForm: {
                formRule: {
                    name: [
                        {
                            required: true,
                            message: '请输入广告名称',
                            trigger: 'blur'
                        }
                    ],
                    imgUrl: [
                        {
                            required: true,
                            message: '请上传图片',
                            trigger: 'change'
                        }
                    ],
                    url: [
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
                getData: '/shop/admin/app/start/adv/page',
                delete: '/shop/admin/app/start/adv',
                update: '/shop/admin/app/start/adv',
                create: '/shop/admin/app/start/adv'
            }
        }
    },
    mounted() {
        console.log(this.dialogForm)
        this.getData()
    },
    methods: {
        // 上/下线
        changeStatus(row) {
            this.$confirm(`${row.status ? '下线后，用户无法在商城中查看。确定下线？' : '上线后，用户可以在商城中查看。确定上线？'}`, '消息提示', {
                type: 'warning'
            })
                .then(() => {
                    startAdvert
                        .updateStatus({
                            id: row.id,
                            status: Number(!row.status)
                        })
                        .then((res) => {
                            this.$message.success('操作成功')
                            this.getData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        }
    }
}
</script>
