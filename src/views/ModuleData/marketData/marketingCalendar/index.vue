<template>
    <el-card>
        <el-row slot="header">营销日历</el-row>
        <el-row type="flex">
            <el-col>
                <el-calendar>
                    <template slot="dateCell" slot-scope="{ date, data }">
                        <p :class="data.isSelected ? 'is-selected' : ''">
                            {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
                        </p>
                        <p></p>
                    </template>
                </el-calendar>
            </el-col>
            <el-col>
                <el-row class="d-flex flex-wrap w-630p">
                    <el-row v-for="(item, index) in activityList" :key="index" type="flex" align="middle" class="w-25 mb-15">
                        <div class="mr-15" :style="{ width: '30px', height: '30px', background: item.color }"></div>
                        <div class="w-100p">{{ item.name }}</div>
                    </el-row>
                    <el-row class="w-100 h-50p bg-eee d-flex a-center p-5 mt-30">2020-10-20</el-row>
                    <div class="table w-100">
                        <el-table
                            ref="multipleTable"
                            v-loading="tableListLoading"
                            :data="tableList"
                            tooltip-effect="dark"
                            class="w-100 mt-15"
                            @selection-change="selectionChange"
                            @sort-change="changeSort"
                        >
                            <template slot="empty">
                                <empty empty-type="pro" />
                            </template>
                            <el-table-column label="活动类型" align="center">sfahfgajgfuj</el-table-column>
                            <el-table-column prop="shopName" label="活动使用次数" align="center" />
                            <el-table-column prop="goodId" label="累计成交金额" align="center" />
                        </el-table>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
    name: 'MarketingCalendar',
    data() {
        return {
            tableList: {},
            activityList: [
                {
                    name: '满减',
                    color: '#37A2DA'
                },
                {
                    name: '满折',
                    color: '#32C5E9'
                },
                {
                    name: '限时折扣',
                    color: '#37A2DA'
                },
                {
                    name: '拼团',
                    color: '#37A2DA'
                },
                {
                    name: '团购',
                    color: '#37A2DA'
                },
                {
                    name: '秒杀',
                    color: '#37A2DA'
                }
            ]
        }
    }
}
</script>

<style></style>
