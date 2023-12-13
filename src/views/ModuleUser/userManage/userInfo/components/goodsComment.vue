<!-- /*
 * @Descripttion:商品评论
*/ -->
<template>
    <section>
        <el-card shadow :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 查询 -->
            <div class="search">
                <el-form ref="formWrapBtn" :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="商品名称"><el-input v-model="searchFilters.productName" placeholder="请输入" /></el-form-item>
                    <el-form-item label="订单编号"><el-input v-model="searchFilters.orderNumber" placeholder="请输入" /></el-form-item>
                    <el-form-item label="评分">
                        <el-select v-model="searchFilters.scoreRange" clearable placeholder="全部">
                            <el-option label="全部" value="" />
                            <el-option label="4-5分" value="5" />
                            <el-option label="3-4分" value="4" />
                            <el-option label="2-3分" value="3" />
                            <el-option label="1-2分" value="2" />
                            <el-option label="0-1分" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="初评时间">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeFirsDate"
                        />
                    </el-form-item>
                    <el-form-item label="追评时间">
                        <el-date-picker
                            v-model="addDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeAddDate"
                        />
                    </el-form-item>
                    <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table
                    ref="multipleTable"
                    v-loading="tableListLoading"
                    class="w-100"
                    :data="tableList"
                    tooltip-effect="dark"
                    header-row-class-name="headerRow"
                >
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />

                    <el-table-column label="商品信息" width="280">
                        <template slot-scope="scope">
                            <div class="d-flex a-center line-h-md">
                                <ls-image style="flex: 0 0 50px" :src="scope.row.prodPic" :options="{ w: '50', h: '50', br: '4' }" />
                                <div class="ml-10">
                                    <el-link :underline="false" type="primary">
                                        <el-popover placement="top-start" width="500" trigger="hover" :content="scope.row.productName">
                                            <div slot="reference" class="text-two">{{ scope.row.productName }}</div>
                                        </el-popover>
                                    </el-link>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="订单编号" min-width="180" />
                    <el-table-column label="订单评分" min-width="230">
                        <template slot-scope="scope">
                            <span>综合评分：&nbsp;{{ scope.row.averageScore.toFixed(1) }}</span>
                            <br />
                            <span>
                                商品评分：
                                <el-rate disabled :value="scope.row.score" style="display: inherit" />
                            </span>
                            <br />
                            <span>
                                店铺服务：
                                <el-rate disabled :value="scope.row.shopScore" style="display: inherit" />
                            </span>
                            <br />
                            <span>
                                物流服务：
                                <el-rate disabled :value="scope.row.logisticsScore" style="display: inherit" />
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="初评时间" width="140">
                        <template slot-scope="scope">
                            <div>{{ scope.row.addTime || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="追评时间" width="140">
                        <template slot-scope="scope">
                            <div>{{ scope.row.addAddTime || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 0" class="font-12 status-wait">待审核</span>
                            <span v-if="scope.row.status == 1" class="font-12 status-pass">通过</span>
                            <span v-if="scope.row.status == -1" class="font-12 status-veto">拒绝</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
                            <span class="table__action">
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    @click="$router.push({ name: 'commentDetail', query: { id: scope.row.id } })"
                                >
                                    查看
                                </el-link>
                            </span>
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
            </div>
        </el-card>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
export default {
    components: {},
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/product/admin/product/comment/page'
            },
            searchFilters: {
                userId: this.$route.query.userId,
                curPage: 1,
                pageSize: 10
            },
            isMounted: true,
            date: '', // 评论时间
            addDate: '' // 追加评论时间
        }
    },

    methods: {
        // 评论时间改变
        changeFirsDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'startTime', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'endTime', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'startTime', '')
                this.$set(this.searchFilters, 'endTime', '')
            }
        },
        // 追加评论时间改变
        changeAddDate() {
            if (this.addDate) {
                this.$set(this.searchFilters, 'addStartTime', this.$utils.time.parseTime(this.addDate[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'addEndTime', this.$utils.time.parseTime(this.addDate[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'addStartTime', '')
                this.$set(this.searchFilters, 'addEndTime', '')
            }
        }
    }
}
</script>
