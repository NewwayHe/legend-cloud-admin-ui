<!--
    配送管理->地区管理
-->
<template>
    <section>
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="省">
                        <el-select v-model="provinceInfo" value-key="id" placeholder="请选择" @change="getDataHandle">
                            <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="市">
                        <el-select v-model="cityInfo" value-key="id" placeholder="请选择" @change="getDataHandle">
                            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区">
                        <el-select v-model="discrictInfo" value-key="id" placeholder="请选择" @change="getDataHandle">
                            <el-option v-for="item in discrictList" :key="item.code" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row class="mb-20">
                    <el-button type="primary" size="medium" @click="handleCreate">新增</el-button>
                </el-row>

                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="name" :label="getDataGrade.label"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    修改
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                </LsSticky>
            </div>

            <!-- 新增-编辑 -->
            <el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
                <el-form
                    ref="myForm"
                    :model="dialogForm.formData"
                    :rules="dialogForm.formRule"
                    label-width="98px"
                    size="small"
                    label-position="right"
                >
                    <p class="mb-15">
                        {{ getParentChain }}
                    </p>
                    <el-form-item :label="getDataGrade.label + '：'" prop="name">
                        <el-input v-model="dialogForm.formData.name" placeholder="区域名" />
                    </el-form-item>
                    <el-form-item label="地区编码：" prop="code">
                        <el-input v-model="dialogForm.formData.code" placeholder="地区编码" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                    <ls-button type="primary" size="small" :async-function="submitHandle">确 定</ls-button>
                </div>
            </el-dialog>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { areaManage } from '@/api/ModuleSystem.js'

export default {
    name: 'DeliveryMethod',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            dialogForm: {
                formRule: {
                    name: [
                        {
                            required: true,
                            message: '请输入区域名称',
                            trigger: 'blur'
                        }
                    ],
                    code: [
                        {
                            required: true,
                            message: '请输入地区编码',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            searchFilters: {
                grade: '', //行政区域等级: 1省级 2.市级 3.区级
                parentId: '0' //父级Id
            },
            url: {
                getData: `/basic/admin/location/loadPage`,
                update: '/basic/admin/location/updateLocation',
                delete: '/basic/admin/location/deleteLocation',
                create: '/basic/admin/location/insertLocation'
            },
            provinceList: [], //省级下拉框选项
            cityList: [], //市级下拉框选项
            discrictList: [],

            provinceInfo: {}, //已选择的省的信息
            cityInfo: {}, //已选择的市的信息
            discrictInfo: {}, //已选择的区的信息

            parentId: 0,
            isSubmiting: false,
            isMounted: true
        }
    },
    computed: {
        getDataGrade() {
            //判断当前展示的数据的行政等级
            if (!this.$utils.test.isEmpty(this.discrictInfo)) {
                return { grade: 4, label: '街道(镇)' }
            }
            if (!this.$utils.test.isEmpty(this.cityInfo)) {
                return { grade: 3, label: '区(县)' }
            }
            if (!this.$utils.test.isEmpty(this.provinceInfo)) {
                return { grade: 2, label: '市' }
            }
            return { grade: 1, label: '省' }
        },

        getParentChain() {
            let tempArr = []
            if (!this.$utils.test.isEmpty(this.provinceInfo)) {
                tempArr.push(this.provinceInfo.name)
            }
            if (!this.$utils.test.isEmpty(this.cityInfo)) {
                tempArr.push(this.cityInfo.name)
            }
            if (!this.$utils.test.isEmpty(this.discrictInfo)) {
                tempArr.push(this.discrictInfo.name)
            }
            return tempArr.join(' -- ')
        }
    },
    watch: {
        tableList: {
            handler(newVal) {
                //当TableList因新增或修改更新后获取最新的下拉框列表
                if (this.isSubmiting == true) {
                    this.getSelection(this.parentId, this.getDataGrade.grade - 1)
                    this.isSubmiting = false
                }
            }
        }
    },

    created() {
        this.getSelection(0, 0)
    },
    mounted() {},
    methods: {
        getDataHandle(params) {
            this.searchFilters.parentId = params.id
            this.searchFilters.grade = parseInt(params.grade) + 1
            this.doSearch()
            if (parseInt(params.grade) <= 3) {
                this.getSelection(parseInt(params.id), params.grade)
            }
        },

        getSelection(parentId, grade) {
            //选择某级行政区后重置其下级行政区的选择及选项
            this.parentId = parentId
            areaManage
                .getRegionChildren(parentId)
                .then((res) => {
                    if (parentId == 0) {
                        //更新省级选择器列表
                        this.provinceList.splice(0)
                        this.provinceInfo = {}
                        this.cityList.splice(0)
                        this.cityInfo = {}
                        this.discrictList.splice(0)
                        this.discrictInfo = {}
                        this.provinceList = res.data
                        return
                    }
                    if (grade == 1 || grade == '1') {
                        //更新市级
                        this.cityList.splice(0)
                        this.cityInfo = {}
                        this.discrictList.splice(0)
                        this.discrictInfo = {}
                        this.cityList = res.data
                        return
                    }
                    if (grade == 2 || grade == '2') {
                        //更新区级
                        this.discrictList.splice(0)
                        this.discrictInfo = {}
                        this.discrictList = res.data
                        return
                    }
                })
                .catch((err) => {
                    this.$message.error('请求异常，请稍后尝试')
                    console.log('Error', err)
                })
        },

        reset() {
            //重置
            this.provinceInfo = {}
            this.cityList.splice(0)
            this.cityInfo = {}
            this.discrictList.splice(0)
            this.discrictInfo = {}
            this.searchFilters.parentId = 0
            this.searchFilters.grade = 1
            this.parentId = 0
            this.doSearch()
        },

        submitHandle() {
            return new Promise(async (resolve) => {
                this.isSubmiting = true
                if (!this.dialogForm.isEdit) {
                    //新增的话需要parentId
                    this.dialogForm.formData.parentId = this.parentId
                    this.dialogForm.formData.grade = this.getDataGrade.grade
                    await this.debounceSubmit('myForm')
                } else {
                    await this.debounceSubmit('myForm')
                }
                resolve()
            })
        }
    }
}
</script>
