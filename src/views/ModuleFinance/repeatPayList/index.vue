<!-- /*
 * @Descripttion:重复支付列表
*/ -->
<template>
    <section>
        <el-card :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="更新日期">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item class="transition-all05">
                        <el-button size="small" @click.stop="doSearch">搜索</el-button>
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
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <!-- 自定义选择列 -->
                    <el-table-column prop="payTypeId" label="支付方式编号">
                        <template slot-scope="scope">
                            {{ scope.row.payTypeId || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="paySettlementSn" label="商户系统支付单据号">
                        <template slot-scope="scope">
                            {{ scope.row.paySettlementSn || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="支付单金额">
                        <template slot-scope="scope">
                            {{ scope.row.amount | priceFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="transactionSn" label="业务编码">
                        <template slot-scope="scope">
                            {{ scope.row.transactionSn || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间">
                        <template slot-scope="scope">
                            {{ scope.row.updateTime || '-' }}
                        </template>
                    </el-table-column>
                    
                    <!-- <el-table-column prop="updateTime" width="150" label="更新时间"/> -->
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
import cud from '@/mixins/pages/cud.js'
import { debounce } from '@/utils/utils.js'
import { report, GoodsManage } from '@/api/ModuleGoods'
export default {
    name: 'Report',
    components: {
    },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: {
            },
            date: '',
            url: {
                getData: '/pay/settlement/querySettlementExceptionList'
            },
            isMounted:true,

        }
    },
    mounted() {

    },
    methods: {


        // 改变日期
        changeDate(date) {
            if (date) {
                this.$set(this.searchFilters, 'startTime', date[0])
                this.$set(this.searchFilters, 'endTime', date[1])
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        }
    }
}
</script>