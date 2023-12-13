<!-- /*
 * @Descripttion:系统日志
*/ -->
<template>
    <section>
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="标题">
                        <el-input v-model="searchFilters.title" placeholder="请输入日志关键词" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="dbnResetSearch">重置</el-button>
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
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="title" label="标题" min-width="100" />
                    <el-table-column prop="requestUser" label="请求用户" />
                    <el-table-column prop="requestUri" label="请求URL" />
                    <el-table-column prop="remoteIp" label="请求IP" />
                    <el-table-column prop="method" label="请求方法" width="80" />
                    <el-table-column show-overflow-tooltip prop="params" label="参数" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.params || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="调用时间" width="100">
                        <template slot-scope="scope">{{ scope.row.time || 0 }}ms</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="exception" label="错误信息">
                        <template slot-scope="scope">
                            {{ scope.row.exception || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="140" />
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
    name: 'Record',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/basic/admin/system/log/page'
            }
        }
    },
    mounted() {},
    methods: {}
}
</script>
