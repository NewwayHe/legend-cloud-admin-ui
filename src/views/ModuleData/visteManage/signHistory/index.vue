<!-- /*
 * @Descripttion:访问管理->用户登录历史
*/ -->
<template>
    <section class="">
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="用户ID">
                        <el-input v-model="searchFilters.userId" :oninput="$inputInteger" placeholder="客户名" maxlength="10" />
                    </el-form-item>
                    <el-form-item label="登录时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
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
                    header-row-class-name="headerRow"
                    @selection-change="selectionChange"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="userId" label="用户id" />
                    <el-table-column prop="nickName" label="用户名" />
                    <el-table-column prop="ip" label="IP" />
                    <el-table-column prop="country" label="国家" />
                    <el-table-column prop="time" label="登录时间" width="140" />
                    <el-table-column prop="loginSource" label="类型" />
                </el-table>
                <LsSticky :data="tableList">
                    <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
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
    name: 'SignHistory',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            date: '',
            url: {
                getData: '/user/admin/count/login/page'
            }
        }
    },
    mounted() {},
    methods: {
        changeDate(e) {
            if (this.date) {
                console.log(this.date)
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
