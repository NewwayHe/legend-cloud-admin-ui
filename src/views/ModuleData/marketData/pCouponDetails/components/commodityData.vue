<template>
    <div>
        <el-card class="mt-15">
            <el-row slot="header">商品数据</el-row>
            <el-row>
                <el-form :inline="true" :model="searchFilters" size="small" label-width="0">
                    <el-form-item>
                        <el-select v-model="value" placeholder="全部渠道">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            class="ml-15"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="changeDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml-10" @click.stop="dbnSearch">搜索</el-button>
                        <el-button class="ml-10">导出报表</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="font-12 text-800">单品转化率：筛选时间内，商品支付用户数/商品访问用户数</el-row>
            <el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
                    @sort-change="changeSort"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="100" align="center" />
                    <el-table-column prop="image" label="商品" min-width="150" align="center">
                        <template slot-scope="scope">
                            <div class="d-flex a-center">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.image" :options="{ w: '50', h: '50', br: '6' }" />
                                <el-popover placement="top-start" trigger="hover" :content="scope.row.name" class="d-flex flex-column a-start">
                                    <template slot="reference">
                                        <el-link class="ml-5" :underline="false" type="primary" style="height: 45px">
                                            <div class="line-clamp2">{{ scope.row.productName }}</div>
                                        </el-link>
                                        <el-row class="ml-5 font-12 text-bbb">
                                            <div class="line-clamp2">{{ scope.row.skuName }}</div>
                                        </el-row>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="访问次数" sortable="custom" align="center" />
                    <el-table-column label="访问用户数" prop="dealAmount" sortable="custom" align="center">
                        <template slot-scope="scope">{{ scope.row.dealAmount || '-' }}</template>
                    </el-table-column>
                    <el-table-column prop="dealGoodNum" label="加入收藏" sortable="custom" align="center" />
                    <el-table-column prop="viewNum" label="下单订单数" sortable="custom" align="center"></el-table-column>
                    <el-table-column prop="favoriteNum" label="下单总金额" sortable="custom" align="center" />
                    <el-table-column label="支付用户数" align="center"></el-table-column>
                    <el-table-column label="单品转化率" sortable="custom" align="center"></el-table-column>
                    <el-table-column label="退单次数" sortable="custom" align="center"></el-table-column>
                    <el-table-column label="退单金额" sortable="custom" align="center"></el-table-column>
                    <el-table-column label="退单用户数" sortable="custom" align="center"></el-table-column>
                </el-table>
            </el-row>
            <el-row type="flex" justify="end">
                <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
export default {
    mixins: [common, cud],
    data() {
        return {
            options: [
                {
                    value: '选项1',
                    label: '全部渠道'
                },
                {
                    value: '选项2',
                    label: 'PC端'
                },
                {
                    value: '选项3',
                    label: '小程序端'
                },
                {
                    value: '选项4',
                    label: 'APP端'
                },
                {
                    value: '选项5',
                    label: 'H5端'
                }
            ],
            value: '',
            date: '',
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            }
        }
    }
}
</script>

<style></style>
