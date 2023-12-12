<!--
    商品报表->搜索概况
-->
<template>
    <div>
        <el-card>
            <el-row slot="header" class="font-weight font-26">
                <el-col class="d-flex a-center">
                    <span>搜索数据概况</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            搜索数据概况包括，搜索次数、搜索人数；
                            <br />
                            统计维度包括，统计筛选时间段内所有渠道的数据；
                            <br />
                            搜索次数 =
                            统计时间段内，对应渠道通过搜索框进行搜索的次数；一个用户/游客从商城中搜索关键词，点击一次搜索按钮统计一条数据，10秒内多次搜索需要去重；
                            <br />
                            搜索人数 =
                            统计时间段内，对应渠道通过搜索框进行搜索的人数；一个用户ID/游客IP从商城中搜索关键词，点击一次搜索按钮统计位一条数据，一天内多次搜索需要去重；
                        </div>
                        <i class="el-icon-question text-main font-16 ml-5"></i>
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row class="search">
                <el-form :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchFilters.word" placeholder="关键词"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            :clearable="false"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnExport">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row type="flex" justify="space-between" class="mb-20">
                <el-col :span="6">
                    <wordcloud :chart-list="wordcloudList" height="800px" />
                </el-col>
                <el-col :span="18">
                    <line-chart :all-list="allList" height="800px" />
                </el-col>
            </el-row>
            <div class="table">
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100 mt-50 mb-30"
                    @sort-change="changeSort"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" fixed="left" type="index" width="48" />
                    <el-table-column prop="word" fixed="left" label="关键词" min-width="100" />
                    <el-table-column prop="frequency" sortable="custom" width="180" label="全部渠道搜索次数" />
                    <el-table-column prop="people" sortable="custom" width="180" label="全部渠道搜索人数" />
                    <!-- <el-table-column prop="mpFrequency" sortable="custom" width="180" label="公众号端搜索次数" />
                    <el-table-column prop="mpPeople" sortable="custom" width="180" label="公众号端搜索人数" /> -->
                    <el-table-column prop="miniFrequency" sortable="custom" width="180" label="小程序端搜索次数" />
                    <el-table-column prop="miniPeople" sortable="custom" width="180" label="小程序端搜索人数" />
                    <!-- <el-table-column prop="appFrequency" sortable="custom" width="180" label="APP端搜索次数" />
                    <el-table-column prop="appPeople" sortable="custom" width="180" label="APP端搜索人数" /> -->
                    <el-table-column prop="h5Frequency" sortable="custom" width="180" label="H5端搜索次数" />
                    <el-table-column prop="h5People" sortable="custom" width="180" label="H5端搜索人数" />
                    <el-table-column prop="figureLastYear" width="180" label="总搜索次数同比" fixed="right">
						<template slot-scope="scope">{{scope.row.figureLastYear}}%</template>
					</el-table-column>
                    <el-table-column prop="figureLastMonth" width="180" label="总搜索次数环比" fixed="right">
					<template slot-scope="scope">{{scope.row.figureLastMonth}}%</template>
					</el-table-column>
                    <!-- <el-table-column label="操作" fixed="right" width="180px" align="center">
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
import common from './mixins/commom'
import lineChart from './charts/lineChart'
import wordcloud from './charts/wordcloud'
import { formatNumber } from '@/utils/utils.js';
import { ssyApi } from '@/api/ModuleData'
export default {
    name: 'SearchSurvey',
    components: {
        lineChart,
        wordcloud
    },
    mixins: [common],
    data() {
        return {
            date: [],
            input: '',
            url: {
                getData: '/product/admin/count/search/page',
                getLine: '/product/admin/count/search/line',
                getExcel: '/product/admin/count/search/page/excel'
            },
            allList: [],
            wordcloudList: []
        }
    },
    mounted() {
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
        changeDate(e) {
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
