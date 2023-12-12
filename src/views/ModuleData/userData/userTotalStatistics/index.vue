<!--
    用户报表->用户数量统计
-->
<template>
    <div>
        <el-card>
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>用户数量统计</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            用户人数统计包括，累计用户人数、各渠道新增用户人数；
                            <br />
                            统计维度包括，统计筛选时间段内对应渠道的数据，
                            <br />
                            累计用户人数 = 显示筛选时间段内，商城系统中所有渠道已注册的用户数量（包括有效和无效状态的用户）；
                            <br />
                            新增用户人数 = 显示筛选时间段内，商城系统中对应渠道新增注册的用户数量（包括有效和无效状态的用户）；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
            </el-row>

            <div class="search">
                <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            align="center"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :clearable="false"
                            @change="changeDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExcel">导出数据</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <linechart height="690px" :all-list="allList" />

            <div class="table mt-20">
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
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="createTime" label="日期" width="140"/>
                    <el-table-column prop="peopleAmount" sortable="custom" label="累计用户人数" />
                    <el-table-column prop="peopleNew" sortable="custom" label="全渠道新增用户人数" />
                    <!-- <el-table-column prop="mpNew" sortable="custom" label="公众号新增用户人数" />
                    <el-table-column prop="appNew" sortable="custom" label="APP端新增用户人数" /> -->
                    <el-table-column prop="h5New" sortable="custom" label="H5端新增用户人数" />
                    <el-table-column prop="miniNew" sortable="custom" label="小程序新增用户人数" />
                    <!-- <el-table-column label="操作" align="center"  fixed="right" width="180px" >
                  <template slot-scope="scope">
                    <span class="table__action">
                      <el-link :underline="false" type="primary">查看</el-link>
                      <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">删除</el-link>
                      <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row, scope.column, scope.$index)">修改</el-link>
                    </span>
                  </template>
                </el-table-column> -->
                </el-table>
            </div>

            <el-row type="flex" justify="end" class="mt-30">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { utsApi } from '@/api/ModuleData'
import common from './mixins/commom'
import linechart from './components/lineChart.vue'
export default {
    name: 'UserTotalStatistics',
    components: {
        linechart
    },
    mixins: [common],
    data() {
        return {
            date: [],
            url: {
                getData: '/user/admin/count/amount/page',
                getLine: '/user/admin/count/amount/line',
                getExcel: '/user/admin/count/amount/page/excel'
            }
        }
    },
    created() {
        this.isMounted = true
        this.getDate()
    },
    methods: {
        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date.push(start, end)
        },
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startDate', this.date[0])
                this.$set(this.searchFilters, 'endDate', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startDate', '')
                this.$set(this.searchFilters, 'endDate', '')
            }
        }
    }
}
</script>

<style></style>
