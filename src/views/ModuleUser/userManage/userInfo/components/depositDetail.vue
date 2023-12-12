<!-- /*
 * @Descripttion: 余额明细
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="类型">
                        <el-select v-model="searchFilters.operationType" placeholder="请选择" clearable>
                            <el-option label="收入" value="ADDITION" />
                            <el-option label="支出" value="DEDUCTION" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker 
                            v-model="tempDate"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            value-format="yyyy-MM-dd HH:mm:ss" 
                            @change="changeDate" />
                    </el-form-item>
                    <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
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
					header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="createTime" label="日期" width="140"/>
                    <el-table-column prop="businessTypeName" label="类型"/>
                    <el-table-column prop="amount" label="金额" width="115">
                        <template slot-scope="scope">
                            {{scope.row.amount | priceFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注">
                        <template slot-scope="scope">
                            {{scope.row.remarks || '-'}}
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
import cud from '@/mixins/pages/cud.js'

export default {
    components: { },
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData:'/pay/admin/wallet/page'
            },
            isMounted: true,
            searchFilters: { userId: '' },
            tempDate:[]
        }
    },
    watch: {},
    created() {
        if (this.$route.query.userId) {
            this.fixFilters.userId = this.$route.query.userId
        }
    },
    mounted() {},
    methods: {
        changeDate(e) {
            if(this.$utils.test.isEmpty(e)){
                this.searchFilters.startDate = ''
                this.searchFilters.endDate = ''
            }else{
                this.searchFilters.startDate = e[0]
                this.searchFilters.endDate = e[1]
            }
        }
    }
}
</script>
