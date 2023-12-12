<template>
    <div>
        <el-card>
            <el-row slot="header">营销活动-优惠券</el-row>
            <el-row class="mb-15">店铺名称-活动名称</el-row>
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
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row type="flex" gutter="20">
                <el-col>
                    <el-row class="mb-20">投入产出</el-row>
                    <el-row>
                        <div class="table">
                            <el-table ref="multipleTable" tooltip-effect="dark" class="w-100" :data="shopList">
                                <el-table-column label="ROI" type="index" width="100" align="center" />
                                <el-table-column prop="shopId" label="营销支付金额" align="center" />
                                <el-table-column prop="shopId" label="营销利润金额" align="center" />
                            </el-table>
                        </div>
                    </el-row>
                </el-col>
                <el-col>
                    <el-row class="mb-20">投入产出</el-row>
                    <el-row>
                        <div class="table">
                            <el-table ref="multipleTable" tooltip-effect="dark" class="w-100" :data="shopList">
                                <el-table-column label="ROI" type="index" width="100" align="center" />
                                <el-table-column prop="shopId" label="营销支付金额" align="center" />
                                <el-table-column prop="shopId" label="营销利润金额" align="center" />
                            </el-table>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
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
