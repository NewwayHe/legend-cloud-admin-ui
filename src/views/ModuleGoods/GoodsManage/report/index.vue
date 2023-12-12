<!-- /*
 * @Descripttion:商品举报
*/ -->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="商品名称">
                        <el-input v-model="searchFilters.productName" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="举报类型">
                        <el-select v-model="searchFilters.typeId" clearable placeholder="请选择">
                            <el-option v-for="item of allType" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺名称">
                        <el-select v-model="searchFilters.shopId" clearable filterable placeholder="请选择">
                            <el-option v-for="item of shopList" :key="item.id" :label="item.shopName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="举报日期">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" clearable placeholder="请选择">
                            <el-option label="已处理" :value="1" />
                            <el-option label="未处理" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理结果">
                        <el-select v-model="searchFilters.result" clearable placeholder="请选择">
                            <el-option label="无效举报" :value="-1" />
                            <el-option label="有效举报" :value="1" />
                            <el-option label="恶意举报" :value="-2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="transition-all05">
                        <el-button size="small" @click.stop="doSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
				<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
					<el-table-column type="selection" reserve-selection width="42" :selectable="(row)=>{return row.status!=1}"/>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="pic" label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center line-h-md font-0">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                                <el-popover placement="top-start" width="300" trigger="hover" :content="scope.row.productName">
                                    <template slot="reference">
                                        <el-link class="ml-10 goodPic" :underline="false" type="primary" @click="proPreview(scope.row.productId)">
                                            <span class="line-clamp2">{{ scope.row.productName }}</span>
                                        </el-link>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="举报人类型">
                        <template slot-scope="scope">
                            {{ scope.row.userType == 1 ? '用户' : '平台' }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="nickName" label="用户名" width="120"/>

                    <el-table-column prop="content" label="举报内容" width="120">
                        <template slot-scope="scope">
                            <span class="line-clamp2 v-middle">{{ scope.row.content }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeName" label="举报类型" />
                    <el-table-column prop="createTime" label="举报时间" width="140"/>
                    <el-table-column prop="shopName" label="店铺名称" width="140" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span class="status-pass" v-if="Number(scope.row.status)">已处理</span>
                            <span class="status-done" v-else>未处理</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="result" label="处理结果">
                        <template slot-scope="scope">
                            <span v-if="scope.row.result == -1">无效举报</span>
                            <span v-else-if="scope.row.result == 1">有效举报</span>
                            <span v-else-if="scope.row.result == -2">恶意举报</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link :underline="false" type="primary" @click="checkDetail(scope.row)">查看</el-link>
                                <el-link
                                    v-if="!scope.row.status"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="toEdit(scope.row, scope.column, scope.$index)"
                                >
                                    处理
                                </el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-col class="text-nowrap flex-start">
						<el-button size="mini" class="allCheck">
							<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						</el-button>
						<el-button size="small" @click="toBatchEdit">批量处理</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
		
		<!-- 新增-编辑 -->
		<el-dialog :title="dialogForm.title" custom-class="dialog-form-small" :visible.sync="dialogForm.isVisible">
		    <el-form
		        ref="myForm"
		        :model="dialogForm.formData"
		        :rules="dialogForm.formRule"
		        label-width="98px"
		        label-position="right"
		        size="small"
		    >
		        <el-form-item label="处理结果：" prop="result1">
		            <el-radio-group v-model="dialogForm.formData.result1">
		                <el-radio :label="1">有效举报</el-radio>
		                <el-radio :label="-1">无效举报</el-radio>
		                <el-radio :label="-2">恶意举报</el-radio>
		            </el-radio-group>
		        </el-form-item>
		        <el-form-item label="处理操作：" prop="illegalOff" v-show="dialogForm.formData.result1 == 1">
		            <el-radio-group v-model="dialogForm.formData.illegalOff">
		                <el-radio :label="0">不处理</el-radio>
		                <el-radio :label="1">商品下架</el-radio>
		                <el-radio :label="2">违规锁定</el-radio>
		            </el-radio-group>
		        </el-form-item>
		        <el-form-item label="备注：" prop="handleInfo">
		            <el-input v-model="dialogForm.formData.handleInfo" type="textarea" placeholder="备注" :autosize="{ minRows: 3, maxRows: 4 }" :maxlength="50"/>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
		        <ls-button type="primary" size="small" :asyncFunction="batchEdit">确 定</ls-button>
		    </div>
		</el-dialog>
		
		<dialog-check ref="detailDialog" :item-id="detailId" />
		<dialogPreview ref="dialogPreview"/>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { debounce } from '@/utils/utils.js'
import { report, GoodsManage } from '@/api/ModuleGoods'
import DialogCheck from './components/dialogCheck'
import dialogPreview from '@/components/iphonePreview/dialogPreview'
export default {
    name: 'Report',
    components: {
        DialogCheck,
        dialogPreview
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                productName: '',
                typeId: '',
                shopId: '',
                status: '',
                result: ''
            },
            date: '',
            dialogForm: {
                formData: {
                    result1: 1,
                    illegalOff: 0,
                    handleInfo: ''
                },
                formRule: {
                    result1: [
                        {
                            required: true,
                            message: '请选择处理结果',
                            trigger: 'blur'
                        }
                    ],
                    illegalOff: [
                        {
                            required: true,
                            message: '请选择处理操作',
                            trigger: 'blur'
                        }
                    ],
                }
            },
            url: {
                getData: '/product/admin/accusation/page'
            },
            allType: [], // 所有举报类型
            shopList: [], // 所有店铺
            batchList: [], // 批量审核id数组
            isBatch: false, //是否是批量审核
            detailId: '', // 查看详情的id
        }
    },
    mounted() {
        this.getTypeAll()
        this.getShop()
        console.log('ref--',this.$refs.multipleTable)
    },
    methods: {
        proPreview(id) {
            this.$refs.dialogPreview.showDialog({id:id})
        },

        // 查看详情
        checkDetail(row) {
            this.detailId = row.id
            this.$refs.detailDialog.dialogShow()
        },

        // 打开编辑
        toEdit(row) {
            this.dialogForm.isVisible = true
            this.dialogForm.formData = {
                result1: 1,
                illegalOff: 0,
                handleInfo: ''
            }
            this.isBatch = false;
            this.batchList = [row.id]
        },

        // 批量编辑
        toBatchEdit() {
            if (!this.mulSels?.length) {
                this.$message.warning('至少选择一条数据')
                return
            }
            this.dialogForm.isVisible = true
            this.dialogForm.formData = {
                result1: 1,
                illegalOff: 0,
                handleInfo: ''
            }
            this.isBatch = true;
            this.batchList = this.mulSels
        },

        // 批量处理
        batchEdit() {
            return new Promise((resolve,reject)=>{
                this.$refs.myForm.validate((valid) => {
                    if (valid) {
                        report.batchUpdateStatus({
                            result: this.dialogForm.formData.result1,
                            illegalOff: this.dialogForm.formData.result1 == 1 ? this.dialogForm.formData.illegalOff : 0,
                            handleInfo: this.dialogForm.formData.handleInfo,
                            accusationIds: this.batchList
                        }).then((res) => {
                            this.$message.success('操作成功')
                            this.$refs.myForm.resetFields()
                            if(this.isBatch) {
                                this.mulSels = []
                            }else {
                                let index = this.mulSels.indexOf(this.batchList[0]);
                                if(index > -1) {
                                    this.mulSels.splice(index,1)
                                }
                            }
                            this.batchList = []
                            this.dialogForm.isVisible = false
                            this.getData()
                        }).finally(()=>{
                            return resolve()
                        })
                    }else{
                         return resolve()
                    }
            })
            })
        },

        // 获取所有举报类型
        getTypeAll() {
            report
                .getAccusationTypeAll()
                .then((res) => {
                    this.allType = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取所有店铺
        getShop() {
            GoodsManage.getShopAllOnline()
                .then((res) => {
                    this.shopList = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 改变日期
        changeDate(date) {
            if (date) {
                this.$set(this.searchFilters, 'startDate', date[0])
                this.$set(this.searchFilters, 'endDate', date[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>