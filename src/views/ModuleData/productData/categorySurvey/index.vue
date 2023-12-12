<!--
    商品报表->类目概况
-->
<template>
    <el-card :body-style="{padding:`20px 20px 10px 20px`}">
        <el-row slot="header" class="font-weight font-26">
            <el-col class="d-flex a-center">
                <span>商品类目概况</span>
                <el-tooltip class="item" placement="right">
                    <div slot="content">
                        商品类目概况包括，SKU数量、访问人数、访问次数、商品成交金额、商品成交量、访问购买率；
                        <br />
                        统计维度，统计筛选时间段内每个类目关联的商品的数据；
                        <br />
                        SKU数量 =
                        以商品类目为维度，累计到进入页面当前时间，类目关联的所有商品SKU数量；统计商家发布后的所有商品，只需要剔除被商家永久删除的商品数量；
                        <br />
                        访问人数 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有SPU商品被浏览的用户人数累加之和；一个用户ID/游客IP从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览需要去重；
                        <br />
                        访问次数 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有SPU商品被浏览的次数累加之和；一个用户ID/游客IP从任意入口访问商品详情页停留3秒或以上，统计为一条数据，当天多次浏览不需要去重；
                        <br />
                        商品成交金额 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有商品被提交并完成支付的订单变为已完成状态的成交金额；若订单项完成了售后，则需要扣除数据；订单金额不需要统计促销、营销、优惠券的金额，并且不包括运费；
                        <br />
                        成交商品数量 =
                        以商品类目为维度，统计筛选时间段内，第一天00:00:00至最后一天23:59:59，类目关联所有商品被提交并完成支付的订单变为已完成状态的商品数量；成交商品数量是统计订单项中的所有商品数量；若订单项完成了售后，则需要扣除数据；
                        <br />
                        访问购买率 = 以商品类目为维度，访问购买率 = 类目关联的所有商品累计成交量 / 类目关联的所有商品全渠道访问次数 * 100%；
                    </div>
                    <i class="el-icon-question text-main font-16 ml-5"></i>
                </el-tooltip>
            </el-col>
        </el-row>

        <div class="search">
            <el-form :inline="true" :model="searchFilters" label-width="0" size="small">
                <el-form-item><el-input v-model="searchFilters.categoryName" placeholder="类目名称"></el-input></el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        @change="changeDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click.stop="search">搜索</el-button>
                    <el-button @click.stop="dbnExcel">导出报表</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <el-row type="flex" justify="space-around" align="top">
            <el-col :span="8">
                <div>
                    <chart id="tree1" :tree="tree1" @change="(val) => changeChart(val, 'tree1')" />
                    <div v-if="tree1 && tree1.length" class="text-center">{{ treeName1 }}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <chart id="tree2" :tree="tree2" @change="(val) => changeChart(val, 'tree2')" />
                    <div v-if="tree2 && tree2.length" class="text-center">{{ treeName2 }}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <chart id="tree3" :tree="tree3" @change="(val) => changeChart(val, 'tree3')" />
                    <div v-if="tree3 && tree3.length" class="text-center">{{ treeName3 }}</div>
                </div>
            </el-col>
        </el-row>
        
        <div class="table">
            <el-table
                ref="multipleTable"
                v-loading="tableListLoading"
                :data="tableList"
                tooltip-effect="dark"
                class="w-100 mt-50"
                @sort-change="changeSort"
                header-row-class-name="headerRow"
            >
                <template slot="empty">
                    <empty empty-type="pro" />
                </template>
                <el-table-column label="序号" type="index" width="48" />
                <el-table-column prop="firstName" label="一级类目" />
                <el-table-column prop="secondName" label="二级类目">
                    <template slot-scope="scope">
                        {{ scope.row.secondName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="thirdName" label="三级类目">
                    <template slot-scope="scope">
                        {{ scope.row.thirdName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="skuAmount" sortable="custom" label="SKU数量" />
                <el-table-column prop="viewPeople" sortable="custom" label="访问人数" />
                <el-table-column prop="views" label="访问次数" />
                <el-table-column prop="turnover" label="商品成交金额" width="115">
                    <template slot-scope="scope">
                        {{ scope.row.turnover | priceFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="成交商品数量" />
                <el-table-column prop="buyRate" label="访问购买率">
                    <template slot-scope="scope">{{ (Math.floor(scope.row.buyRate * 100) / 100).toFixed(2) }}%</template>
                </el-table-column>
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
		<LsSticky :data="tableList">
			<el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
				<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
			</el-row>
		</LsSticky>
    </el-card>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import chart from './components/chart.vue'
import { csyApi } from '@/api/ModuleData'
export default {
    name: 'CategorySurvey',
    components: {
        chart,
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {},
            date: [],
            url: {
                getData: '/product/admin/count/category/page',
                getExcel: '/product/admin/count/category/page/excel'
            },
            tree1: [],
            tree2: [],
            tree3: [],
            treeName1: '',
            treeName2: '',
            treeName3: '',
            treeIndex1: 0,
            treeIndex2: 0,
            treeIndex3: 0
        }
    },
    created() {
        this.getDate()
        this.getTree()
    },
    methods: {
        changeChart(params, type) {
            this.datafilter(this.tree1, type, params.dataIndex)
        },
        search() {
            this.page.curPage = 1
            this.getData()
            this.getTree()
        },

        getDate() {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            this.date.push(
                start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate() + ' 00:00:00',
                end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' 00:00:00'
            )
        },
        datafilter(data, type, index = 0) {
            this.tree1 = []
            this.tree2 = []
            this.tree3 = []
            switch (type) {
                case 'tree1':
                    this.treeIndex1 = index
                    this.treeIndex2 = 0
                    this.treeIndex3 = 0
                    break
                case 'tree2':
                    this.treeIndex2 = index
                    this.treeIndex3 = 0
                    break
                case 'tree3':
                    this.treeIndex3 = index
                    break
                default:
                    break
            }
            this.tree1 = data
            this.treeName1 = data[this.treeIndex1].categoryName
            if (data[this.treeIndex1] && data[this.treeIndex1].categoryDTOList && data[this.treeIndex1].categoryDTOList.length) {
                let twoData = data[this.treeIndex1].categoryDTOList
                this.tree2 = twoData
                this.treeName2 = twoData[this.treeIndex2].categoryName
                if (twoData[this.treeIndex2] && twoData[this.treeIndex2].categoryDTOList && twoData[this.treeIndex2].categoryDTOList.length) {
                    let threeData = twoData[this.treeIndex2].categoryDTOList
                    this.tree3 = threeData
                    this.treeName3 = threeData[this.treeIndex3].categoryName
                }
            }
        },
        getTree() {
            csyApi
                .getTree({
                    startDate: this.date[0],
                    endDate: this.date[1]
                })
                .then((res) => {
                    // 默认高亮第一个
                    if (res.data && res.data.length) {
                        this.datafilter(res.data)
                    }
                })
        },
        // 时间改变
        changeDate() {
            if (this.date) {
                // console.log(this.date);
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
