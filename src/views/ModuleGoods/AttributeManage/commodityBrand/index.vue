<!-- /*
 * @Descripttion:商品品牌
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 指引 -->
            <step>
                <p>可以申请提交商品品牌，平台审核通过后才可以使用</p>
            </step>

            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="品牌名称">
                        <el-input v-model="searchFilters.brandName" placeholder="类目名称" />
                    </el-form-item>
                    <el-form-item label="推荐品牌">
                        <el-select v-model="searchFilters.commend" filterable placeholder="请选择" clearable>
                            <el-option v-for="item in categoryOption" :key="item.key" :label="item.value" :value="item.key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" clearable filterable placeholder="请选择">
                            <!-- <el-option key="1" label="全部" /> -->
                            <el-option value="1" label="上线" />
                            <el-option value="0" label="下线" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                        <el-button size="small" @click.stop="exportExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.opStatus" size="large" @change="getData">
                            <el-radio-button label>所有品牌</el-radio-button>
                            <el-radio-button label="0">待审核</el-radio-button>
                            <el-radio-button label="1">已审核</el-radio-button>
                            <el-radio-button label="-1">未通过</el-radio-button>
                        </el-radio-group>
						<el-button class="ml-20" type="primary" size="medium" @click="handleCreate">新增</el-button>
                    </el-col>
                </el-row>
                <!--列表-->
				<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="brandPic" label="品牌LOGO" width="100">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '4' }"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌名称"/>
                    <el-table-column prop="createTime" label="创建时间" width="140"/>
                    <el-table-column label="推荐品牌">
                        <template slot-scope="scope">
                            <span>{{ scope.row.commendFlag ? '是' : '否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.opStatus == 0" class="status-wait">待审核</span>
                            <span v-else-if="scope.row.opStatus == -1" class="status-veto">审核不通过</span>
                            <template v-else>
                                <span v-if="scope.row.status == 0" class="status-done">下线</span>
                                <span v-if="scope.row.status == 1" class="status-pass">上线</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="checkDetail(scope.row)">查看</el-link>
                                <template v-if="scope.row.opStatus == 1">
                                    <el-link v-if="!scope.row.status" :underline="false" type="primary" @click="updateState(scope.row)">上线</el-link>
                                    <el-link v-if="scope.row.status" :underline="false" type="primary" @click="updateState(scope.row)">下线</el-link>
                                </template>
                                <template v-else-if="scope.row.opStatus == 0">
                                    <el-link :underline="false" type="primary" @click="toAudit(scope.row)">审核</el-link>
                                </template>
                                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">
                                    编辑
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
					    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
				
               
                <!-- 审核 -->
                <dialog-audit
                    :id="auditId"
                    ref="auditDialog"
                    :user-params="{ ids: 'commonId', status: 'opStatus', content: 'auditOpinion' }"
                    url="/product/admin/brand/audit"
                    @finish="getData"
                />

                <!-- 新增-编辑 -->
				<el-dialog :title="dialogForm.title" :visible.sync="dialogForm.isVisible" custom-class="dialog-form-small" width="500px" destroy-on-close :close-on-click-modal="false"  @closed="closeDialog" @open="openDialog">
					<el-form
						ref="myForm"
						:inline="false"
						:model="dialogForm.formData"
						:rules="dialogForm.formRule"
						label-position="right"
						label-width="98px"
						size="small"
					>
						<el-form-item label="品牌名称：" prop="brandName">
							<el-input
								v-model="dialogForm.formData.brandName"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
						<el-form-item label="品牌LOGO：" prop="brandPic">
							<imgCenter v-model="dialogForm.formData.brandPic" @input="$refs.myForm.validateField('brandPic')" :key="'1'"></imgCenter>
							<span class="text-999 font ml-15 v-top">建议尺寸：200*200</span>
						</el-form-item>
						<el-form-item label="品牌大图：" prop="bigImage">
							<imgCenter v-model="dialogForm.formData.bigImage" @input="$refs.myForm.validateField('bigImage')" :key="'2'"></imgCenter>
							<span class="text-999 font ml-15 v-top">建议尺寸：590*350</span>
						</el-form-item>
						<el-form-item label="排序：" prop="seq">
							<lsInput v-model="dialogForm.formData.seq" placeholder="请输入" textAlign="left" :precision="2" :min="0" :max="999999999"/>
						</el-form-item>
						<!--  :autosize="{minRows: 3, maxRows: 9}"-->
						<el-form-item label="品牌介绍：" prop="brief">
							<el-input
								v-model="dialogForm.formData.brief"
								type="textarea"
								maxlength="300"
								autosize
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
						<el-form-item label="是否推荐：" prop="commendFlag">
							<el-radio-group v-model="dialogForm.formData.commendFlag">
								<el-radio :label="true">推荐</el-radio>
								<el-radio :label="false">不推荐</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="状态：" prop="status">
							<el-radio-group v-model="dialogForm.formData.status">
								<el-radio :label="1">上线</el-radio>
								<el-radio :label="0">下线</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="商标注册证号：" prop="trademarkingNumber">
							<el-input v-model="dialogForm.formData.trademarkingNumber" :maxlength="30" show-word-limit placeholder="请输入" />
						</el-form-item>
						<el-form-item label="注册人：" prop="registrationPeople">
							<el-input v-model="dialogForm.formData.registrationPeople" :maxlength="20" show-word-limit placeholder="请输入" />
						</el-form-item>
						<el-form-item label="注册地址：" prop="registrationAddess">
							<el-input v-model="dialogForm.formData.registrationAddess" :maxlength="50" show-word-limit placeholder="请输入" />
						</el-form-item>
						<el-form-item label="商标有效期：" prop="time">
							<el-date-picker style="width: 100%;" v-model="dialogForm.formData.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
								range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"
								@input="timeChange"></el-date-picker>
						</el-form-item>
						
						<el-form-item label="商标注册证：" prop="registrationPic">
							<imgCenter v-model="dialogForm.formData.registrationPic" :key="'3'"></imgCenter>
							<span class="text-999 font ml-15 v-top">建议尺寸：590*350</span>
						</el-form-item>
					</el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogForm.isVisible = false">取 消</el-button>
                        <el-button v-ls-loading size="small" type="primary" @click.stop="debounceSubmit('myForm')">保 存</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import dialogAudit from '@/comCommon/dialogAudit'
import { commodityBrand } from '@/api/ModuleGoods'
import Step from '../components/Step'

export default {
    name: 'CommodityBrand',
    components: {
        Step,
        dialogAudit
    },
    mixins: [common, cud],
    data() {
        return {
            categoryOption: [
                {
                    key: '1',
                    value: '是'
                },
                {
                    key: '0',
                    value: '否'
                }
            ],
            statusOption: [
                {
                    key: '1',
                    value: '上线'
                },
                {
                    key: '0',
                    value: '下线'
                }
            ],
            searchFilters: {
                brandName: '',
                status: '',
                opStatus: '',
                commend: '' // 推荐
            },
            dialogForm: {
                formData: {
                    commendFlag: true,
                    status: 1,
                    seq: undefined,
                    brandName: '',
                    brief: '',
                    brandPic: undefined,
                    bigImage: undefined,
                },
                formRule: {
                    brandName: [
                        {
                            required: true,
                            message: '请输入品牌名称',
                            trigger: 'blur'
                        }
                    ],
                    brandPic: [
                        {
                            required: true,
                            message: '请上传品牌LOGO',
                            trigger: 'change'
                        }
                    ],
                    bigImage: [
                        {
                            required: true,
                            message: '请上传品牌大图',
                            trigger: 'change'
                        }
                    ],
                    commendFlag: [
                        {
                            required: true,
                            message: '请选择是否推荐品牌',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '请选择品牌状态',
                            trigger: 'blur'
                        }
                    ],
                    seq: [
                        {
                            required: true,
                            message: '请输入排序',
                            trigger: 'blur'
                        }
                    ],
                    brief: [
                        {
                            required: true,
                            message: '请输入品牌介绍',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            url: {
                getData: '/product/admin/brand/page',
                create: '/product/admin/brand', // 新增
                update: '/product/admin/brand', // 编辑
                delete: '/product/admin/brand' // 删除
            },
            auditId: '' ,// 审核的id
			pickerOptions: {
				disabledDate: (time) => {
					let currentTime = new Date().getTime() - 24 * 3600 * 1000
					return currentTime > time.getTime()
				}
			},
        }
    },
    watch: {},
    mounted() {},
    methods: {
        closeDialog(){
            this.$refs.myForm.resetFields()
        },
        // 查看详情
        checkDetail(row) {
            this.$router.push({
                name: 'commodityBrandDetail',
                query: {
                    id: row.id
                }
            })
        },
        // 导出
        exportExcel() {
            commodityBrand.brandExport(
                {
                    brandName: this.searchFilters.brandName,
                    status: this.searchFilters.status,
                    commend: this.searchFilters.commend,
                    idList: this.mulSels.join()
                },
                this
            )
        },

        // 审核
        toAudit(row) {
            this.auditId = row.id
            this.$refs.auditDialog.showDialog()
        },

        // 上下线
        updateState(row) {
            this.$confirm(
                `${row.status === 1 ? '类目下线后，用户无法浏览关联的商品。确定下线？' : '类目上线后，用户可以浏览关联的商品。确定上线？'}`,
                {
                    type: 'warning',
                    title: `${row.status === 1 ? '下线' : '上线'}`
                }
            )
                .then(() => {
                    commodityBrand
                        .updateStatus({
                            id: row.id,
                            status: Number(!row.status)
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.getData()
                                this.$message.success('操作成功')
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        },
		// 开始/结束时间
		timeChange(value) {
			if (!value) {
				value = []
			}
			this.dialogForm.formData.startTime = value[0] || ''
			this.dialogForm.formData.endTime = value[1] || ''
		},
		
		openDialog(){
			this.$nextTick(()=>{
				if (this.dialogForm.formData.startTime) {
					this.dialogForm.formData.time = [this.dialogForm.formData.startTime, this.dialogForm.formData.endTime]
				}
			})
		}
    }
}
</script>

<style scoped lang='scss'>
::v-deep .dialog-form-small {
    .el-form {
        .el-form-item {
            ::v-deep .el-input-number .el-input__inner{
                text-align: left;
            }
            ::v-deep .el-textarea .el-input__count{
                line-height: 1;
            }
        }
    }
}
</style>
