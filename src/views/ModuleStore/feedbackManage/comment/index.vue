<!--
    反馈意见
-->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="反馈内容">
                        <el-input v-model="searchFilters.content" placeholder="标题" />
                    </el-form-item>
                    <el-form-item label="反馈时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="反馈来源">
                        <el-select v-model="searchFilters.feedbackSource" placeholder="请选择" clearable>
                            <el-option label="PC端" value="pc" />
                            <el-option label="移动端" value="mobile" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="回复状态">
                        <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                            <el-option label="未回复" :value="0" />
                            <el-option label="已回复" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    row-key="id"
                    @selection-change="selectionChange"
					header-row-class-name="headerRow"
                >
					<el-table-column type="selection" reserve-selection width="42" :selectable="(row)=>{return !row.status}"/>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="content" label="反馈内容" min-width="320"/>
                    <el-table-column prop="respDate" label="反馈时间" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.createTime }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="newsCategoryName" label="联系方式/用户名" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.mobile + (scope.row.name ? '/' + scope.row.name : '') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="来源">
                        <template slot-scope="scope">
                            <span>{{ scope.row.feedbackSource == 'pc' ? 'PC端' : '移动端' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="respContent" label="回复内容" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.respContent || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="回复状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" class="status-pass">已回复</span>
                            <span v-else class="status-done">未回复</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link v-if="scope.row.status == 0" :underline="false" type="primary" @click.stop="showDialog(scope.row)">
                                    回复
                                </el-link>
                                <el-link v-else>-</el-link>
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
						<el-button size="small" @click="batchEdit">批量回复</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>
		
		<!-- 新增-编辑 -->
		<el-dialog title="回复" custom-class="dialog-form-small" :visible.sync="Visible">
		    <el-form ref="myForm" :model="form" :rules="formRule" label-width="98px" label-position="right" size="small">
		        <el-form-item v-show="!batch" label="反馈内容：" prop="content">
		            <span>{{ form.content }}</span>
		        </el-form-item>
		        <el-form-item label="回复内容：" prop="respContent">
		            <el-input
		                v-model="form.respContent"
		                type="textarea"
		                :autosize="{ minRows: 4, maxRows: 4 }"
		                placeholder="请输入内容"
		                maxlength="50"
		                show-word-limit
		            />
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer font-0">
		        <el-button size="small" @click.stop="Visible = false">取 消</el-button>
		        <ls-button size="small" type="primary" :asyncFunction="sumitEdit">确 定</ls-button>
		    </div>
		</el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { comment } from '@/api/ModuleStore'

export default {
    name: 'Comment',
    mixins: [common, cud],
    computed: {},
    watch: {},
    data() {
        return {
            searchFilters: {
                newsCategoryName: '',
                status: ''
            },
            date: '',
            url: {
                getData: '/shop/admin/user/feedback/page'
            },
            formRule: {
                respContent: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            },
            Visible: false,
            form: {
                content: '',
                respContent: ''
            },
            replayList: [],
            batch: false
        }
    },
    mounted() {},
    methods: {
        // 单个回复
        showDialog(row) {
            this.Visible = true
            this.batch = false
            this.form = Object.assign({}, this.form, row)
            this.replayList = [row.id]
        },

        // 批量回复
        batchEdit() {
			if (!this.mulSels?.length) {
			    this.$message.warning('请至少选择一条数据')
			    return
			}
            this.$set(this.form, 'respContent', '')
            this.Visible = true
            this.batch = true
            this.replayList = this.mulSels
        },

        // 回复
        sumitEdit() {
            return new Promise((resolve)=>{
                this.$refs.myForm.validate((valid)=> {
                    console.log('before')
                    if(valid) {
                        const params = {
                                ids: this.replayList,
                                respContent: this.form.respContent
                            }
                        comment.edit(params).then((res) => {
                            if (res.code) {
                                this.$message.success('回复成功')
                                if(this.batch) {    //清空选择数组
                                    this.mulSels = []
                                }
                                this.getData()
                                this.Visible = false
                            }
                        }).finally(()=>{
                            console.log('running')
                            return resolve()
                        })
                    }else{
                        resolve()
                    }
                    console.log('after')
            })
            })
            
        },

        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'beginTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'beginTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        }
    }
}
</script>

