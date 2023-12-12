<template>
    <el-card>
        <el-row class="pb-20 font-18 font-weight">
            数据
            <el-tooltip placement="right">
                <i class="el-icon-question font-16 text-main main-hover v-middle"></i>
                <div class="line-h-lg" slot="content">
                    <div>默认显示七天数据，分别统计投放渠道中投放页面的投放次数、投放人数、点击次数、点击人数、转化率数据；</div>
                    <div>投放次数，统计当天投放页面中显示的弹窗的次数；</div>
                    <div>投放人数，统计当天投放页面中显示的弹窗的用户人数；</div>
                    <div>点击次数，统计当天投放页面中弹窗被点击的次数；</div>
                    <div>点击人数，统计当天投放页面中弹窗被点击的用户人数；</div>
                    <div>转化率，用于统计点击次数转化比率；</div>
                    <div>计算公式：</div>
                    <div>转化率 = 点击次数/投放次数；</div>
                </div>
            </el-tooltip>
        </el-row>
        <div class="search">
            <el-form :inline="true" :model="searchFilters" label-width="80px" size="small">
                <el-form-item label="日期：">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        align="center"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :clearable="true"
                        @change="changeDate"
                    ></el-date-picker>
                </el-form-item>
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
                <el-form-item>
                    <el-button @click="dbnSearch">搜索</el-button>
                    <el-button @click.stop="dbnExcel">导出数据</el-button>
                    <el-button @click.stop="dbnResetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div >
            <lineChart xAxis="time" :chartData="chartData" showLegend :filter="echartFilter"></lineChart>                    
        </div>
        <div class="table w-100" >
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
                <el-table-column prop="createTime" label="日期" width="140">
                    <template slot-scope="scope">
                        {{$utils.time.parseTime(scope.row.createTime,'{y}-{m}-{d}')}}
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="投放渠道" min-width="150">
                    <template slot-scope="scope">
                        {{ scope.row.source == 'APP' ? '用户移动端' : '用户PC端' }}
                    </template>
                </el-table-column>
                <el-table-column prop="putCount"  label="投放次数（次）" min-width="150"/>
                <el-table-column prop="putPeople"  label="投放人数（人）" min-width="150"/>
                <el-table-column prop="clickCount"  label="点击次数（次）" min-width="150"/>
                <el-table-column prop="clickPeople"  label="点击人数（人）" min-width="150"/>
                <el-table-column prop="inversionRate"  label="转化率（%）" min-width="150">
                    <template slot="header" slot-scope="scope">
                        <span>转化率（%）</span>
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content" class="line-h-md" style="max-width: 300px">
                                转化率，用于统计点击次数转化比率；
                                <br />
                                转化率 = 点击次数/投放次数；
                            </div>
                            <i class="el-icon-question font-16 v-text-bottom" style="color: rgba(0,0,0,.3)"></i>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.inversionRate | priceFilter(false)}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row type="flex" justify="end" class="mt-20">
            <pagination 
                :current-page="page.curPage" 
                :total="tableTotal" 
                @size-change="pageSizeChange"
                @current-change="currentPageChange" 
            />
        </el-row>
        <Sticky>
            <el-button @click="$router.back()" size="medium">返回</el-button>
        </Sticky>
    </el-card>
</template>
<script>
import commom from '@/mixins/pages/commom'
import { popupAdvertApi } from '@/api/ModuleMarketing';
import lineChart from './components/lineChart'
import moment from 'moment'
import { debounce } from '@/utils/utils';
export default {
	name: 'popupAdvertChart',
	components:{
        lineChart,
	},
    mixins:[commom],
    computed: {
        chartData() {       //线型图
            return this.resData.map(v => ({
                clickCount: v.clickCount,
                clickPeople: v.clickPeople, 
                putCount: v.putCount, 
                putPeople: v.putPeople, 
                inversionRate:v.inversionRate,
                time: this.$utils.time.parseTime(v.time,'{y}-{m}-{d}')
            })).sort((a,b) => new Date(a.recordDate) - new Date(b.recordDate))
        }
    },
	data() {
		return {
			resData: [],
			isLoading: true,
            searchFilters: {

                startTime: '',
                endTime: ''
            },
            fixFilters:{
                id:this.$route.query.id
            },
            date: [],
            tableList:[],
            pickerOptions: {
                disabledDate:(val)=>{
                    return new Date(val).getTime()+1>=new Date().setHours(0,0,0,0) ? true : false
                },
                shortcuts: [
                {
                    text: '当天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        start.setHours(0,0,0) //从起始日的00:00:00开始查询
                        end.setHours(-1,59,59) //至结束日的23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        start.setHours(0,0,0) //从起始日的00:00:00开始查询
                        end.setHours(-1,59,59) //至结束日的23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * (30+1));
                        start.setHours(0,0,0) //从起始日的00:00:00开始查询
                        end.setHours(-1,59,59) //至结束日的23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                }, 
                {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        start.setHours(0,0,0) //从起始日的00:00:00开始查询
                        end.setHours(-1,59,59) //至结束日的23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '累计至今',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(0);
                        end.setHours(-1,59,59) //至结束日的23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                }
                ]
            },
            url:{
                getData:'/shop/advertise/advertise/queryAdvertiseDataReport',
                getExcel:'/shop/advertise/advertise/excel/advertiseDataReportExcel',
            },
            isMounted: true,
		};
	},
	created() {
		this.dateInit()
	},
    mounted(){
        this.getChartData()
    },
	methods: {
        dbnSearch:debounce(function(){
            this.getData()
            this.getChartData()
        }),
		getChartData() {
			popupAdvertApi.advertiseDataReport({...this.fixFilters,...this.searchFilters}).then(res => {
                if(res.code){
                    this.isLoading = false;
				    this.resData = res.data;
                }
			});
		},
        changeDate(e){ 
            if (this.date) {
                console.log(this.date);
                this.$set(this.searchFilters, 'startTime', this.date[0])
                this.$set(this.searchFilters, 'endTime', this.date[1])
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        },
        echartFilter(val){
            let obj={
                clickCount: '点击次数',
                clickPeople: '点击人数', 
                putCount: '投放次数', 
                putPeople:'投放人数',
                inversionRate:'转换率'
            }
            return obj[val]||'-'
        },
        changeSort(val) {
            this.orderBy.prop = val.prop.replace(/([A-Z])/g,"_$1").toLowerCase();   //转为下划线
            if (val.order == 'ascending') {
                this.orderBy.order = 'asc'
            } else if (val.order == 'descending') {
                this.orderBy.order = 'desc'
            } else {
                this.orderBy.order = val.order
            }
            this.getData()
        },
        dateInit(){
            if(!this.date.length){ //默认查询最近7天数据,日期回显之时间选择框
                const start = new Date();
                const end = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start.setHours(0,0,0) //从起始日的00:00:00开始查询
                end.setHours(-1,59,59) //至结束日的23:59:59
                this.date = [start,end]
                this.searchFilters.startTime = moment(start).format('YYYY-MM-DD HH:mm:ss');
                this.searchFilters.endTime = moment(end).format('YYYY-MM-DD HH:mm:ss');
                
            }
        },
        dbnResetSearch: debounce(function () {
            this.date = '' // 这里做一处时间兼容，date字段并没有放在searchFilters对象中，而是放在外面
            this.dateInit()
            this.searchFilters = this.$utils.object.deepClone(this.rawSearchFilters)
            this.page.curPage = 1
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()       //清除表格选择勾选行
            this.getData()
            this.getChartData()
        }),
	},
};
</script>

<style></style>
