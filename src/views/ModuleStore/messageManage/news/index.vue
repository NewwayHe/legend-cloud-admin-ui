<!-- /*
 * @Descripttion:新闻(列表)
*/ -->
<template>
    <section class="">
        <!-- 查询 -->
        <div class="search">
            <el-card>
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="标题：">
                        <el-input v-model="searchFilters.title" placeholder="标题：" />
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="date"
                            style="width: 250px"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                            <el-option label="上线" :value="1" />
                            <el-option label="下线" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        <el-button size="small" @click.stop="dbnResetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="table">
            <el-card class="mb-20">
                <!--列表-->
                <el-row class="mb-20">
                    <el-button style="height: 32px" type="primary" size="small" @click="toAdd">新增</el-button>
                </el-row>
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    :data="tableList"
                    tooltip-effect="dark"
                    class="w-100"
                    @selection-change="selectionChange"
                >
                    <el-table-column label="序号" type="index" width="100" align="center" />
                    <el-table-column prop="title" label="标题" align="center" />
                    <el-table-column prop="pic" label="图片" align="center">
                        <template slot-scope="scope">
                            <ls-image style="vertical-align: middle" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '6' }" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status" :underline="false" type="success">上线</el-link>
                            <el-link v-else :underline="false" type="warning">下线</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="180px">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click="changeStatus(scope.row)">
                                    {{ scope.row.status ? '下线' : '上线' }}
                                </el-link>
                                <el-link :underline="false" type="primary" @click.stop="handleDel(scope.row, scope.column, scope.$index)">
                                    删除
                                </el-link>
                                <el-link :underline="false" type="primary" @click="toEdit(scope.row)">修改</el-link>
                                <el-link :underline="false" type="primary" @click="checkLink(scope.row)">查看链接</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-20">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </el-card>
        </div>
        <dialogLink ref="dialogLink" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { news } from '@/api/ModuleStore'
import dialogLink from '@/comCommon/dialogLink'

export default {
    name: 'News',
    components: { dialogLink },
    mixins: [common, cud],
    data() {
        return {
            searchFilters: { title: '', status: '' },
            date: '',
            url: {
                getData: '/admin/headline/news/page',
                delete: '/admin/headline/news'
            }
        }
    },
    mounted() {},
    methods: {
        // 新增
        toAdd() {
            this.$router.push({ path: '/ModuleStore/messageManage/newsOperate', query: { type: 'add' } })
        },

        // 编辑
        toEdit(row) {
            this.$router.push({ path: '/ModuleStore/messageManage/newsOperate', query: { type: 'edit', id: row.id } })
        },

        // 上/下线
        changeStatus(row) {
            this.$confirm(`${row.status ? '下线后，用户不可查看本条数据。确定下线？' : '上线后，用户可查看本条数据。确定上线？'}`, '消息提示', {
                type: 'warning'
            })
                .then(() => {
                    news.updateStatus({
                        id: row.id,
                        status: Number(!row.status)
                    })
                        .then((res) => {
                            this.$message.success('操作成功')
                            this.getData()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 查看链接
        checkLink(row) {
            this.$refs.dialogLink.showDialog(`?detailsType=news&id=${row.id}`)
        },

        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'beginTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'beginTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        }
    }
}
</script>
