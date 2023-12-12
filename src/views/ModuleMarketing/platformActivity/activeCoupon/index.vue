<!-- /*
 * @Descripttion:优惠券列表
*/ -->
<template>
    <section class="">
        <!-- 优惠券规格 -->
        <div>
            <el-card shadow>
                <!-- 查询 -->
                <div class="search">
                    <el-form :inline="true" :model="searchFilters" size="small">
                        <el-form-item label="优惠券名称：">
                            <el-input v-model="searchFilters.name" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="领取日期：">
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
                        <el-form-item label="使用日期：">
                            <el-date-picker
                                v-model="useDate"
                                style="width: 250px"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="changeUseDate"
                            />
                        </el-form-item>
                        <el-form-item label="领取方式：">
                            <el-select v-model="searchFilters.receiveType" placeholder="领取方式" clearable>
                                <el-option label="免费领取" :value="0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用店铺类型：">
                            <el-select v-model="searchFilters.useType" placeholder="店铺类型" clearable>
                                <el-option label="全部店铺" :value="0" />
                                <el-option label="部分店铺" :value="1" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 内容区域 -->
                <div class="table">
                    <!-- 搜索区域 -->
                    <el-row type="flex">
                        <el-col>
                            <el-radio-group v-model="searchFilters.status" size="medium" class="mb-20" @change="changeStatus">
                                <el-radio-button v-for="(item, index) in couponStatus" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row class="mb-20">
                        <el-button type="primary" size="small" @click="addCoupon">新增</el-button>
                    </el-row>
                    <!--列表-->
					<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
                        <template slot="empty"><empty empty-type="pro" text="暂无活动信息" /></template>
                        <el-table-column type="selection" width="55" reserve-selection />
                        <el-table-column label="序号" type="index" width="55" />
                        <el-table-column prop="title" show-overflow-tooltip label="优惠券名称" align="left" />
                        <el-table-column prop="receiveTime" label="领取时间" width="380" align="left" />
                        <el-table-column prop="useTime" label="使用时间" width="380" align="left" />
                        <el-table-column prop="rule" label="规则" align="left" />
                        <el-table-column prop="receiveLimit" label="限领" align="left" />
                        <el-table-column prop="receiveType" label="领取方式">
                            <template slot-scope="scope">
                                免费领取
                            </template>
                        </el-table-column>
                        <el-table-column prop="useType" label="适用店铺类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.useType == 0">全部店铺</span>
                                <span v-if="scope.row.useType == 1">部分店铺</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.status | getLabelText(couponStatus) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="countCn" label=" 已用 | 已领 | 发放数量" align="center" />

                        <el-table-column label="操作" align="center"  fixed="right" >
                            <template slot-scope="scope">
                                <span class="table__action flex-center">
                                    <el-link :underline="false" type="primary" @click.stop="goDetail(scope.row, 'lookInfo')">查看</el-link>
                                    <el-link :underline="false" type="primary" @click.stop="goDetail(scope.row, 'copy')">复制</el-link>
                                    <el-link
                                        v-if="scope.row.status == 1"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="handleStatus([scope.row.id], 'suspend', 2)"
                                    >
                                        暂停
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.status == 2"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="handleStatus([scope.row.id], 'recover', 1)"
                                    >
                                        恢复
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.status == 1"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="handleStatus([scope.row.id], 'end', 3)"
                                    >
                                        终止
                                    </el-link>
                                    <el-link
                                        v-if="scope.row.status == 3 || scope.row.status == 2"
                                        :underline="false"
                                        type="primary"
                                        @click.stop="handleStatus([scope.row.id], 'del', -2)"
                                    >
                                        删除
                                    </el-link>
                                    <el-link :underline="false" type="primary" @click.stop="viewLinks(scope.row.id)">查看链接</el-link>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row type="flex" justify="space-between" class="mt-20 mb-20">
                        <el-col>
                            <el-button size="mini" class="allCheck">
								<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
                            </el-button>
                            <el-button size="small" @click="mulDel">批量删除</el-button>
                        </el-col>
                        <pagination
                            :current-page="page.curPage"
                            :total="tableTotal"
                            @size-change="pageSizeChange"
                            @current-change="currentPageChange"
                        />
                    </el-row>
                    <el-alert type="warning" class="defalult mt-15" :closable="false">
                        <div style="line-height: 30px" class="text-999">
                            <p class="font-16 font-weight">说明</p>
                            <p>优惠是由商家发布的，红包是由平台发布的。优惠券分通用券和商品券，商品券优先于通用券</p>
                        </div>
                    </el-alert>
                </div>
            </el-card>
        </div>
        <dialogLink ref="dialogLink" />
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import dialogLink from '@/comCommon/dialogLink'
import cud from '@/mixins/pages/cud.js'
import { couponApi } from '@/api/ModuleMarketing.js'

export default {
    name: 'ActiveCoupon',
    components: { dialogLink },
    mixins: [common, cud],
    data() {
        return {
            // 优惠券使用规则
            couponForm: {
                type: []
            },
            date: '',
            useDate: '',
            couponContent: ``,
            couponStatus: [
                { label: '所有活动', value: '' },
                { label: '未开始', value: 0 },
                { label: '进行中', value: 1 },
                { label: '已暂停', value: 2 },
                { label: '已结束', value: 3 },
                { label: '已失效', value: -1 },
                { label: '已删除', value: -2 }
            ],
            searchFilters: {
                status: '' // 商品状态
            },
            handleType: {
                del: '数据删除后，无法恢复，确定删除？',
                recover: '恢复后，用户可参与该活动。确定恢复？',
                suspend: '暂停后，用户不可参与该活动。确定暂停？',
                end: '终止后，活动将直接下架。确定终止？'
            },
            url: {
                getData: '/activity/admin/coupon/page'
            },
            paramsList: [], // 配置项数组
        }
    },
    mounted() {},
    methods: {
        // 保存配置项
        saveParams() {
            couponApi
                .shopParamItemValue(this.paramsList)
                .then((res) => {
                    this.$message.success('编辑成功')
                })
                .catch((err) => {
                    console.log('save params err', err)
                })
        },

        // 选择item
        selectItem(itemId) {
            for (const item of this.paramsList) {
                if (item.id == itemId) {
                    this.$set(item, 'value', JSON.stringify(!JSON.parse(item.value)))
                }
            }
        },

        // 添加优惠券
        addCoupon(row) {
            // this.$router.push('/ModuleMarketing/addCoupon')
            this.$router.push({ name: 'addCoupon' })
        },

        // 查看或者复制
        goDetail(row, couponType) {
            this.$router.push({ name: 'addCoupon', query: { couponType, couponId: row.id } })
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getData()
        },

        // 批量删除
        mulDel() {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.handleStatus(this.mulSels, 'del', -2)
        },

        // 改变状态
        handleStatus(ids, type, status) {
            console.log(ids, type, status)
            this.$confirm(this.handleType[type], '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    couponApi.updateCouponStatu(status, ids).then((res) => {
                        if (res.code == 1) {
                            this.$message({ type: 'success', message: '操作成功!' })
                            this.getData()
                        }
                    })
                })
                .catch(() => {
                    this.$message({ type: 'info', message: '已取消操作' })
                })
        },

        //复制链接
        viewLinks(id) {
            this.$refs.dialogLink.showDialog(`?detailsType=coupon&id=${id}`)
        },

        // 改变日期
        changeDate() {
            if (this.date) {
                this.$set(this.searchFilters, 'receiveTimeBeg', this.$utils.time.parseTime(this.date[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'receiveTimeEnd', this.$utils.time.parseTime(this.date[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'receiveTimeBeg', '')
                this.$set(this.searchFilters, 'receiveTimeEnd', '')
            }
        },

        // 使用日期
        changeUseDate() {
            if (this.useDate) {
                this.$set(this.searchFilters, 'useTimeBeg', this.$utils.time.parseTime(this.useDate[0], '{y}-{m}-{d}'))
                this.$set(this.searchFilters, 'useTimeEnd', this.$utils.time.parseTime(this.useDate[1], '{y}-{m}-{d}'))
            } else {
                this.$set(this.searchFilters, 'useTimeBeg', '')
                this.$set(this.searchFilters, 'useTimeEnd', '')
            }
        }
    }
}
</script>
<style scoped>
body {
    height: 100%;
}
</style>
