<!-- /*
 * @Descripttion:弹窗广告
*/ -->
<template>
    <section>
        <el-card shadow class="mt-10" :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" label-width="120px" ref="formWrapBtn">
                    <el-form-item label="广告弹窗标题："><el-input v-model="searchFilters.title" placeholder="请输入" clearable :maxlength="25"/></el-form-item>
                    <el-form-item label="投放渠道">
                        <el-select v-model="searchFilters.source" collapse-tags placeholder="请选择" clearable>
                            <el-option
                            label="用户PC端"
                            value="PC">
                            </el-option>
                            <el-option
                            label="用户移动端"
                            value="APP">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告弹窗有效期：" prop="dateTime">
                        <el-date-picker
                            v-model="date"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']"
                            range-separator="至"
                            start-placeholder="使用开始时间"
                            end-placeholder="使用结束时间"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!-- 搜索区域 -->
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button :label="''">
                                全部
                            </el-radio-button>
                            <el-radio-button :label="0">
                                未开始({{getCount['wait']}})
                            </el-radio-button>
                            <el-radio-button :label="1">
                                进行中({{getCount['start']}})
                            </el-radio-button>
                            <el-radio-button :label="2">
                                已暂停({{getCount['stop']}})
                            </el-radio-button>
                            <el-radio-button :label="3">
                                已结束({{getCount['end']}})
                            </el-radio-button>
                        </el-radio-group>
						<el-button class="ml-15" type="primary" size="medium" @click="goDetail('add')">新增</el-button>
                    </el-col>
                </el-row>
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @sort-change="changeSort"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无活动信息" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column label="广告弹窗标题" prop="title" min-width="180"/>
                    <el-table-column label="投放渠道" width="140" >
                        <template slot-scope="scope">
                            <span v-for="(item,index) in scope.row.sourceList" :key="index">
                                {{item=="PC"?"用户PC端":"用户移动端"}}{{index != scope.row.sourceList.length-1 ? "," : ""}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seq"  width="80">
                        <template slot="header" slot-scope="scope">
                           <span>权重</span>
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" class="line-h-md" style="max-width: 300px">
                                    权重越低越靠前显示
                                </div>
                                <i class="el-icon-question font-16 v-text-bottom" style="color: rgba(0,0,0,.3)"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.seq || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="广告弹窗有效期" prop="availableIntegral" min-width="140" align="center">
                        <template slot-scope="scope">
                            <div  class="text-center" v-if="scope.row.startTime || scope.row.endTime">
                                <div>{{ scope.row.startTime || '-' }}</div>
                                <div>至</div>
                                <div>{{ scope.row.endTime || '-' }}</div>
                            </div>
                            <dev v-else>-</dev>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.status | statusFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click.stop="goDetail('lookInfo', scope.row)">查看</el-link>
                                <el-link :underline="false" type="primary" @click.stop="goDetail('copy', scope.row)">复制</el-link>
                                <el-link :underline="false" type="primary" @click.stop="goDetail('dataChart', scope.row)">数据</el-link>
                                <el-link 
                                    v-if="scope.row.status!=3" 
                                    :underline="false" 
                                    type="primary" 
                                    @click.stop="goDetail('edit', scope.row)"
                                >
                                    编辑
                                </el-link>
                                <el-link
                                    v-if="scope.row.status == 0 || scope.row.status == 1"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleStatus(scope.row, 'suspend', 2)"
                                >
                                    暂停
                                </el-link>
                                <el-link
                                    v-if="scope.row.status == 2"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleStatus(scope.row, 'recover', 1)"
                                >
                                    恢复
                                </el-link>
                                <el-link
                                    v-if="scope.row.status!=3"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleStatus(scope.row, 'end', 3)"
                                >
                                    终止
                                </el-link>
                                <el-link
                                    v-if="scope.row.status == 3"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleDel(scope.row)"
                                >
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
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'

import { popupAdvertApi } from '@/api/ModuleMarketing.js'
export default {
    name: 'PointsData',
    components: {
    },
    filters: {
        statusFilter(val){
            // 0未开始,10开始,20暂停,30结束
            let obj={
                0:'未开始',
                1:'进行中',
                2:'已暂停',
                3:' 已结束'
            }
            return obj[val]||'-'
        }
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
                status:''
            },
            url: {
                getData: '/shop/advertise/advertise/advertisePage',
                getExcel:'/shop/advertise/advertise/excel/advertiseDataReportExcel',
                delete:'/shop/advertise'
            },
            handleType: {
                del: '数据删除后，无法恢复，确定删除？',
                recover: '恢复后，用户可参与该活动。确定恢复？',
                suspend: '暂停后，用户不可参与该活动。确定暂停？',
                end: '终止后，活动将直接下架。确定终止？'
            },
            getCount:{},
            isMounted:true
            // 头部数据
        }
    },
    watch:{
        tableList:{
            handler(){
                popupAdvertApi.advertiseCount(this.searchFilters).then(res=>{
                    if(res.code){
                        // 0未开始wait ,1开始 start,2暂停 stop ,3结束end
                        let obj={

                        }
                        res.data.forEach(e => {
                            if(e.status==0){
                                obj.wait = e.count || 0
                            }
                            else if(e.status==1){
                                obj.start = e.count || 0
                            }
                            else if(e.status==2){
                                obj.stop = e.count || 0
                            }
                            else if(e.status==3){
                                obj.end = e.count || 0
                            }
                        });
                        this.getCount = obj
                    }
                })
            },
            deep:true
        }
    },
    methods: {
        // 跳转页面
        goDetail(type, row, column, index) {
            switch (type) {
                case 'lookInfo': // 查看积分明细
                    this.$router.push({ name: 'popupAdvertDetails', query: { id: row.id, type:"lookInfo" } })
                    break
                case 'edit': // 查看积分明细
                    this.$router.push({ name: 'popupAdvertDetails', query: { id: row.id, type:"edit" } })
                    break
                case 'copy': // 查看兑换商品记录
                    this.$router.push({ name: 'popupAdvertDetails', query: { id: row.id, type:"copy" } })
                    break
                case 'add': // 查看兑换商品记录
                    this.$router.push({ name: 'popupAdvertDetails', query: { type:"add" } })
                    break
                case 'dataChart': // 查看兑换优惠券记录
                    this.$router.push({ name: 'popupAdvertChart', query: { id: row.id } })
                    
                    break
                default:
                    break
            }
        },
        handleStatus(row, type, status) {
            this.$confirm(this.handleType[type], '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    popupAdvertApi.advertiseUpdateStatus({id:row.id,status:status}).then((res) => {
                        if (res.code == 1) {
                            this.$message({ type: 'success', message: '操作成功!' })
                            this.getData()
                        }
                    })
                })
                .catch(() => {
                    this.$message({ type: 'info', message: '已取消操作' })
                })
        },
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },
        changeDate(e){ 
            if (this.date) {
                this.$set(this.searchFilters, 'startTime', this.date[0])
                this.$set(this.searchFilters, 'endTime', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.hidden__radio {
    >>> .el-radio-button__inner {
        border-radius: 0 !important;
    }
}
</style>
