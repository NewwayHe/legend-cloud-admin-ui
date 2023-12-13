<!-- /*
 * @Descripttion:推送管理->短信发送历史
*/ -->
<template>
    <section class="">
        <el-card shadow>
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <!-- <el-form-item label="用户ID">
                        <el-input v-model="searchFilters.custName" placeholder="客户名" />
                    </el-form-item> -->
                    <el-form-item label="用户ID"><el-input v-model="searchFilters.userId" placeholder="用户ID" clearable /></el-form-item>
                    <el-form-item label="手机号码"><el-input v-model="searchFilters.mobile" placeholder="手机号码" clearable /></el-form-item>
                    <el-form-item label="发送状态">
                        <el-select v-model="searchFilters.status" placeholder="请选择" clearable>
                            <el-option label="全部" :value="0" />
                            <el-option label="发送成功" :value="1" />
                            <el-option label="发送失败" :value="-1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            range-separator="至"
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
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column label="用户ID">
                        <template slot-scope="scope">
                            {{ scope.row.userId || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="昵称">
                        <template slot-scope="scope">
                            {{ scope.row.nickName || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码">
                        <template slot-scope="scope">
                            {{ scope.row.mobile || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="短信内容" min-width="150">
                        <template slot-scope="scope">
                            {{ scope.row.content || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发送时间" width="140" />
                    <el-table-column prop="type" label="短信类型" />
                    <el-table-column prop="response" label="响应码" />
                    <el-table-column prop="status" label="发送状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.status == '成功' ? 'status-pass' : 'status-veto'">{{ scope.row.status }}</span>
                        </template>
                    </el-table-column>
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
                <el-alert type="warning" class="defalult mt-20" :closable="false">
                    <div style="line-height: 30px" class="text-999">
                        <p class="font-16 font-weight">说明</p>
                        <a
                            class="font-12"
                            target="_blank"
                            href="https://help.aliyun.com/knowledge_detail/57717.html?spm=a2c4g.11186623.6.700.4e93e838Zauv5j"
                        >
                            点此处查看阿里云短信接口调用错误码详情
                        </a>
                    </div>
                </el-alert>
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    name: 'MessageHistory',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            date: '',
            url: {
                getData: '/user/admin/count/sms/count'
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
