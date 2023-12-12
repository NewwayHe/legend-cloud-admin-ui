<template>
    <div>
        <el-card>
            <el-row slot="header">营销活动-优惠券</el-row>
            <el-row>
                <el-form :inline="true" size="small">
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
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="table">
                <el-table ref="multipleTable" tooltip-effect="dark" class="w-100" :data="shopList">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="shopId" label="店铺名称" />
                    <el-table-column prop="shopId" label="活动名称" />
                    <el-table-column prop="shopId" label="活动时间" />
                    <el-table-column prop="shopId" label="参与商品类型" />
                    <el-table-column prop="shopId" label="参与活动SKU数量" />
                    <el-table-column prop="shopId" label="累计成交金额" />
                    <el-table-column prop="shopId" label="累计成交数量" />
                    <el-table-column prop="shopId" label="累计成交订单数" />
                    <el-table-column prop="shopId" label="累计成交用户数" />
                    <el-table-column prop="shopId" label="累计访问次数" />
                    <el-table-column prop="shopId" label="累计访问用户数" />
                    <el-table-column prop="shopId" label="转化率" />
                    <el-table-column prop="shopId" label="操作" align="center" >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'pCoupon',
    data() {
        return {
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
