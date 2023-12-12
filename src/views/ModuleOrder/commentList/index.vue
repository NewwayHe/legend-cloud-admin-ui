<!--
    订单管理->订单列表
-->
<template>
    <section class="">
        <el-row :gutter="15" class="text-center mb-15">
            <el-col :span="8">
                <el-card>
                    <div class="haoPingStyle flex-center" style="padding: 0">
                        <span class="icon iconfont icon-haoping" style="color: rgba(252, 158, 11, 1); font-size: 18px"></span>
                    </div>
                    <div class="font-28 my-10">{{ analysis.good }}</div>
                    <span class="font-12 text-999">总计好评数量</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div class="haoPingStyle flex-center" style="padding: 0">
                        <span class="icon iconfont icon-zhongping" style="color: rgba(245, 189, 48, 1); font-size: 18px"></span>
                    </div>
                    <div class="font-28 my-10">{{ analysis.medium }}</div>
                    <span class="font-12 text-999">总计中评数量</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div class="haoPingStyle flex-center" style="background: rgba(236, 236, 244, 1); padding: 0">
                        <span class="icon iconfont icon-chaping" style="color: rgba(156, 172, 188, 1); font-size: 18px"></span>
                    </div>
                    <div class="font-28 my-10">{{ analysis.poor }}</div>
                    <span class="font-12 text-999">总计差评数量</span>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
                <div class="search">
                    <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                        <el-form-item label="商品名称">
                            <el-input v-model="searchFilters.productName" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="订单号">
                            <el-input v-model="searchFilters.orderNumber" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="评分">
                            <el-select v-model="searchFilters.scoreRange" clearable placeholder="全部">
                                <el-option label="全部" value="" />
                                <el-option label="4-5分" value="5" />
                                <el-option label="3-4分" value="4" />
                                <el-option label="2-3分" value="3" />
                                <el-option label="1-2分" value="2" />
                                <el-option label="0-1分" value="1" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="初评时间">
                            <el-date-picker
                                v-model="date"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="changeFirsDate"
                            />
                        </el-form-item>
                        <el-form-item label="追评时间">
                            <el-date-picker
                                v-model="addDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="changeAddDate"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table">
                    <el-row type="flex" class="mb-20">
                        <el-col>
                            <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                                <el-radio-button>所有评论</el-radio-button>
                                <el-radio-button label="0">待审核</el-radio-button>
                                <el-radio-button label="1">已通过</el-radio-button>
                                <el-radio-button label="-1">已拒绝</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>

                    <!--列表-->
                    <el-table
                        ref="multipleTable"
                        v-loading="tableListLoading"
                        :data="tableList"
                        tooltip-effect="dark"
                        class="w-100 font-12 customTable__header"
                        row-key="id"
                        header-row-class-name="headerRow"
                    >
                        <template slot="empty">
                            <empty empty-type="pro" />
                        </template>
                        <!-- 自定义选择列 -->
                        <el-table-column width="42" align="center">
                            <template slot="header" slot-scope="scope">
                                <el-checkbox v-model="checkAllNumber" :disabled="disCheckAll" size="small" @change="handleAllSelect" :indeterminate="checkHalf"></el-checkbox>
                            </template>
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.customChecked" :disabled="!checkboxSelect(scope.row)" size="small" @change="(selected)=>handleSingleSelect(scope.row,selected)"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column label="序号" type="index" align="center" width="48" />

                        <el-table-column label="商品" width="280">
                            <template slot-scope="scope">
                                <div class="d-flex a-center line-h-md">
                                    <ls-image style="flex: 0 0 60px" :src="scope.row.prodPic" :options="{ w: '60', h: '60', br: '4' }"/>
                                    <div class="ml-10">
                                        <el-popover placement="top-start" width="500" trigger="hover" :title="scope.row.productName">
                                            <el-link :underline="false" type="primary" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+scope.row.productId">{{ $shareRedirectUrl+'?detailsType=good&id='+scope.row.productId }}</el-link>                                                      
                                            <el-link slot="reference" :underline="false" type="primary" target="_blank" :href="$shareRedirectUrl+'?detailsType=good&id='+scope.row.productId">{{ scope.row.productName }}</el-link>                                                        
                                        </el-popover>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shopName" label="店铺" show-overflow-tooltip width="140"/>
                        <el-table-column label="订单编号" min-width="180">
                            <template slot-scope="scope">
                                <el-link :underline="false" type="primary">{{ scope.row.orderNumber }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column sortable prop="averageScore" min-width="230" label="订单评分">
                            <template slot-scope="scope" class="text-999">
                                <span>综合评分：&nbsp;{{ scope.row.averageScore.toFixed(1) }}</span>
                                <br />
                                <span>
                                    商品评分：
                                    <el-rate disabled :value="scope.row.score" style="display: inherit" />
                                </span>
                                <br />
                                <span>
                                    店铺服务：
                                    <el-rate disabled :value="scope.row.shopScore" style="display: inherit" />
                                </span>
                                <br />
                                <span>
                                    物流服务：
                                    <el-rate disabled :value="scope.row.logisticsScore" style="display: inherit" />
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="初评时间" width="140">
                            <template slot-scope="scope">
                                <div>{{ scope.row.addTime || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="追评时间" width="140">
                            <template slot-scope="scope">
                                <div>{{ scope.row.addAddTime || '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="初评状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status == 0" class="status-wait">待审核</span>
                                <span v-if="scope.row.status == 1" class="status-pass">通过</span>
                                <span v-if="scope.row.status == -1" class="status-veto">拒绝</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="追评状态">
                            <template slot-scope="scope">
                                <div v-if="scope.row.addCommFlag">
                                    <div v-if="scope.row.addStatus == 0" class="status-wait">待审核</div>
                                    <div v-if="scope.row.addStatus == 1" class="status-pass">通过</div>
                                    <div v-if="scope.row.addStatus == -1" class="status-veto">拒绝</div>
                                </div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="150">
                            <template slot-scope="scope">
                                <span class="table__action flex-center text-nowrap">
                                    <el-link
                                        class="font-12"
                                        :underline="false"
                                        type="primary"
                                        @click="$router.push({ name: 'commentDetail', query: { id: scope.row.id, addId: scope.row.addId } })"
                                    >
                                        查看
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.status == 0"
                                        class="font-12"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="showDialog(scope.row, scope.row.status, 1)"
                                    >
                                        审核初评
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.status && scope.row.addStatus == 0"
                                        class="font-12"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="showDialog(scope.row, scope.row.addStatus, 2)"
                                    >
                                        审核追评
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
							    <el-checkbox v-model="checkAllNumber" :disabled="disCheckAll" label="全选" size="small" @change="handleAllSelect" :indeterminate="checkHalf"/>
							</el-button>
							<el-button v-if="searchFilters.status == 0 || searchFilters.status == null" size="small" @click="batchExamine">
							    批量审核
							</el-button>
						</el-col>
						<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
					</el-row>
				</LsSticky>
            </el-card>
        </el-row>

        <!-- 评论批量审核 -->
        <el-dialog ref="dialogCommentRef" title="审核" :visible.sync="isVisible" custom-class="dialog-form-small">
            <el-form ref="commentForm" :model="commentFormData" :rules="rule" label-width="98px" label-position="right" size="small">
                <el-form-item label="审核状态：" prop="status">
                    <el-radio-group v-model="commentFormData.status">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="-1">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer font-0">
                <el-button size="small" @click="isVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="batchSubmit('commentForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 评论审核 -->
        <dialogComment
            ref="dialogComment"
            :comment-id="commentId"
            :comment-add-id="commentAddId"
            :comment-status="commentStatus"
            :comment-type="commentType"
            @getData="getCommentData"
        />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { commentList } from '@/api/ModuleOrder.js'
import dialogComment from './components/dialogComment'

export default {
    name: 'CommentList',
    components: {
        dialogComment
    },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/product/admin/product/comment/page'
            },
            searchFilters: {
                curPage: 1,
                pageSize: 10
            },
            date: '', // 评论时间
            addDate: '', // 追加评论时间
            commentStatus: '', // 要传的状态
            commentId: '', // 要传的初评id
            commentAddId: '', // 要传的追评id
            commentType: '', // 类型
            // 统计
            analysis: {
                good: 0, // 好评数
                medium: 0, // 中评数
                poor: 0 // 差评数
            },
            customSelection: true,  //自定义表格选择列
            idsListSet: new Set(),  //选中的ID数组
            addIdsListSet: new Set(),   //选中的ID数组
            selectedList: [],       //已选中的行
            commentFormData: {
                status: 1
            },
            isVisible: false, // 弹框开关
            rule: {
                status: [
                    {
                        required: true,
                        message: '请选择状态',
                        trigger: 'change'
                    }
                ]
            },
        }
    },
    watch: {
        tableList: {
            handler(nList) {
                console.log('nList--',nList)
                let idsList = this.idsListSet, addIds = this.addIdsListSet;
                nList.forEach(li => {
                    // 保证切页的选中状态能够保持
                    if (li.status == 0) {
                        if(idsList.has(li.id)) {
                            li.customChecked = true
                        }else {
                            li.customChecked = false
                        }
                    } else if (li.status == 1 && li.addStatus == 0) {
                        if(addIds.has(li.addId)) {
                            li.customChecked = true
                        }else {
                            li.customChecked = false
                        }
                    }else {
                        li.customChecked = false
                    }
                })
            },
            // deep: true,
        }
    },
    computed: {
        // 可选中的行
        selectableList() {
            return (this.tableList.filter((item)=>{
                return (!(item.status == -1 || (item.status == 1 && item.addStatus != 0)))
            }).map(each => {
                if (each.status == 0) {
                    return each.id
                } else if (each.status == 1 && each.addStatus == 0) {
                    return each.addId
                }
            })) || []
        },
        // 半选按钮
        checkHalf() {
            if(this.checkAllNumber) {
                return false;
            }else if(this.selectableList.length && this.selectedList.length) {
                return true;
            }else {
                return false;
            }
        },
        // 全选按钮
        checkAllNumber: {
            get() {
                return this.selectableList.length && this.selectableList.every(item => this.selectedList.includes(item))
            },
            set(val) {
                return val
            }
        },
        // 全选禁用
        disCheckAll() {
            return this.tableList.every((item) => item.status != 0 || (item.status == 1 && item.addStatus != 0))
        }
    },
    created() {
        this.getAnalysis()
    },
    methods: {
        // 统计
        getAnalysis() {
            commentList.getAnalysis().then((res) => {
                if (res.code == 1) {
                    this.analysis = res.data
                }
            })
        },
        // 审核评论
        showDialog(params, status, type) {
            // type  0=初评，1=追评
            this.commentType = type
            this.commentId = params.id
            this.commentAddId = params.addId
            this.commentStatus = 1
            this.$refs.dialogComment.showDialog()
        },
        // 单行选择
        handleSingleSelect(row,selected) {
            // 这条语句必须要写 因为下面全选的本质也是调用每一行的单选
            row.customChecked = selected;
            // console.log('single--',row,selected)
            let id,attr; //找出添加/删除的ID 操作的数组
            if (row.status == 0) {
                id = row.id
                attr = 'idsListSet'
            } else if (row.status == 1 && row.addStatus == 0) {
                id = row.addId
                attr = 'addIdsListSet'
            }
            if(selected) {
                this[attr].add(id)
            }else {
                if(this[attr].has(id)) {
                    this[attr].delete(id)
                }
            }
            // 已选中的行(不能用computed 因为Vue监听不了Set数据类型)
            this.selectedList = [ ...this.idsListSet, ...this.addIdsListSet]
            console.log('可选中的行--',this.selectableList, this.selectedList)
        },
        // 全选按钮事件
        handleAllSelect(selected) {
            this.tableList.forEach((item)=> {
                if (item.status == 0) {
                    if(this.selectableList.includes(item.id)){
                        //更新选中状态
                        this.handleSingleSelect(item,selected)
                    }
                } else if (item.status == 1 && item.addStatus == 0) {
                    if(this.selectableList.includes(item.addId)) {
                        //更新选中状态
                        this.handleSingleSelect(item,selected)
                    }
                }
            })
        },
        // 某一行是否选中
        checkboxSelect(row, rowIndex) {
            if (row.status == -1 || (row.status == 1 && row.addStatus != 0)) {
                return false // 禁用
            } else {
                return true // 不禁用
            }
        },
        // 打开弹框
        batchExamine() {
            if (this.idsListSet.size == 0 && this.addIdsListSet.size == 0) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            this.isVisible = true
        },
        // 批量审核
        batchSubmit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    console.log('set--',[...this.idsListSet],[...this.addIdsListSet])
                    let ids = [...this.idsListSet]
                    let addIds = [...this.addIdsListSet]
                    commentList
                        .postBatchComment({
                            ids,
                            addIds,
                            status: this.commentFormData.status
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.$message.success('批量审核成功!')
                                this.idsListSet.clear()
                                this.addIdsListSet.clear()
                                this.selectedList = []
                                this.isVisible = false
                                this.getData()
                            }
                        })
                }
            })
        },
        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },
        // 评论时间改变
        changeFirsDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        },
        // 追加评论时间改变
        changeAddDate() {
            if (this.addDate) {
                this.$set(this.searchFilters, 'addStartTime', this.$utils.time.parseTime(this.addDate[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'addEndTime', this.$utils.time.parseTime(this.addDate[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'addStartTime', '')
                this.$set(this.searchFilters, 'addEndTime', '')
            }
        },
        getCommentData() {
            this.getData()
            this.getAnalysis()
        }
    }
}
</script>
<style lang="scss" scoped>
.haoPingStyle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(252, 236, 204, 1);
    margin: 0 auto;
    padding-top: 3px;
}

.cell {
    text-align: left;
}
</style>
