<!-- /*
 * @Descripttion:优惠券列表
*/ -->
<template>
    <section>
        <!-- 优惠劵规格 -->
        <el-card shadow :body-style="{padding:`20px 20px 10px 20px`}">
            <!-- 查询 -->
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small" ref="formWrapBtn">
                    <el-form-item label="优惠劵名称"><el-input v-model="searchFilters.name" placeholder="请输入" /></el-form-item>
                    <el-form-item label="领取日期">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="适用店铺类型">
                        <el-select v-model="searchFilters.useType" placeholder="店铺类型" clearable>
                            <el-option label="全部店铺" :value="0" />
                            <el-option label="部分店铺" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领取方式">
                        <el-select v-model="searchFilters.receiveType" placeholder="请选择" clearable>
                            <el-option label="全部" :value="''" />
                            <el-option label="免费领取" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item><el-button size="small" @click.stop="dbnSearch">搜索</el-button></el-form-item>
                </el-form>
            </div>

            <!-- 内容区域 -->
            <div class="table">
                <!-- 搜索区域 -->
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="searchFilters.status" size="large" @change="changeStatus">
                            <el-radio-button v-for="(item, index) in couponStatus" :key="index" :label="item.value">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
						<el-button class="ml-15" type="primary" size="medium" @click="addCoupon">新增</el-button>
                    </el-col>
                </el-row>
				<el-row class="mb-20">
					<el-alert type="info" class="theme" :closable="false" show-icon>
						<p>说明：优惠是由商家发布的，红包是由平台发布的。优惠券分通用券和商品券，商品券优先于通用券</p>
					</el-alert>
				 </el-row>
                <!--列表-->
				<el-table ref="multipleTable" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow" row-key="id" @selection-change="selectionChange">
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无活动信息" />
                    </template>
					<el-table-column type="selection" reserve-selection width="42" :selectable="(row)=>{return !(row.status===0||row.status==1||row.status==2||row.status=='-2')}"/>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="title" show-overflow-tooltip label="优惠券名称" min-width="120" />
                    <el-table-column prop="rule" label="规则" min-width="160"/>
                    <el-table-column prop="receiveLimit" label="限领"/>
                    <el-table-column prop="receiveType" label="领取方式" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.receiveType == 0">免费领取</span>
                            <span v-else-if="scope.row.receiveType == 1">卡密领取</span>
                            <span v-else-if="scope.row.receiveType == 3">指定用户发放</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="useType" label="适用店铺类型" min-width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.useType == 0">全部店铺</span>
                            <span v-if="scope.row.useType == 1">部分店铺</span>
                            <span v-if="scope.row.useType == -1">部分店铺不参与</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" prop="receiveTime" label="领取时间">
                        <template slot-scope="scope">
                            <span v-html="formatDate(scope.row.receiveTime)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" prop="useTime" label="使用时间">
                        <template slot-scope="scope">
                            <span v-html="formatDate(scope.row.useTime)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.status == -2 ? 'status-veto' : scope.row.status == 1 ? 'status-wait' : 'status-done'">{{ scope.row.status | getLabelText(couponStatus) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="countCn" label="已用 | 已领 | 发放数量"  min-width="140"/>

                    <el-table-column label="操作" fixed="right" width="250">
                        <template slot-scope="scope">
                            <span class="table__action flex-center">
                                <el-link :underline="false" type="primary" @click.stop="goDetail(scope.row, 'lookInfo')">查看</el-link>
                                <el-link :underline="false" type="primary" @click.stop="goDetail(scope.row, 'copy')">复制</el-link>
                                <el-link :underline="false" type="primary" @click.stop="$router.push({ name: 'redData', query: { 'couponId' : scope.row.id,'couponName' : scope.row.title }})">数据</el-link>
                                <el-link
                                    v-if="scope.row.status == 1 || scope.row.status == 0"
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
                                    v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 2"
                                    :underline="false"
                                    type="primary"
                                    @click.stop="handleStatus([scope.row.id], 'end', 3)"
                                >
                                    终止
                                </el-link>
                                <el-link
                                    v-if="scope.row.status == 3 || scope.row.status == -1"
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
            </div>
			<LsSticky :data="tableList">
				<el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
					<el-col class="text-nowrap flex-start">
						<el-button size="mini" class="allCheck">
							<el-checkbox v-model="checkAll" label="全选" size="small" @change="selAll" :indeterminate="checkHalf" :disabled='!selectableList.length'/>
						</el-button>
						<el-button size="small" @click="mulDel">批量删除</el-button>
					</el-col>
					<pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
				</el-row>
			</LsSticky>
        </el-card>


         <!-- 由于el-dialog内不能自己添加slot 找不到可以复用的方法 所以要重新写 -->
        <el-dialog title="查看链接" custom-class="dialog-form" width="500px" :visible.sync="urlDialogVisible" @close="handleDialogClose">
            <div v-loading="mpQrLoading" style="min-height: 350px;">
                <template v-if="isLoadMpQr">
                    <el-row class="mb-20" v-for="li in showUrlList(['MB','PC'])" :key='li.url'>
                        <div class="flex-center">
                            <span class="font-14" style="min-width: 85px;">{{ li.title }}链接：</span>
                            <el-link class="mr-10" type="primary" target="_blank" :underline="false" :href="li.url">{{ li.url }}</el-link>
                            <el-button size="small" type="primary" style="height: 32px" @click="handleCopy(li.url, $event)">复制链接</el-button>
                        </div>
                    </el-row>
                    <el-row v-for="(li,index) in showUrlList(['MB','MINI'])" :key="index" type="flex" :justify="!li.showQrImg ? 'start' : 'center'" align="middle">
                        <div class="d-none" v-if="li.type != 'MINI'"><vueQr :text="li.url" :size="400" :callback="(img) => qrCallBack(img, li)"></vueQr></div>
                        <span v-show="!li.showQrImg && li.qrImg" class="font-14" style="width: 85px;">{{ li.title }}链接：</span>
                        <img v-show="!li.showQrImg && li.qrImg" class="cursor-zoom-in" style="width: 100px; height: 100px" :src="li.qrImg" alt="" @click="clickQr(li)" />
                        <img v-show="li.showQrImg && li.qrImg" class="cursor-zoom-out zoom-out0005" :src="li.qrImg" alt="" @click="clickQr(li)" />
                        <span v-show="!li.showQrImg" class="text-999 ml-10">可扫码查看，可点击鼠标右键另存为二维码图片</span>
                    </el-row>
                </template>
            </div>
            <span slot="footer" class="dialog-footer"><el-button size="small" @click="urlDialogVisible = false">取 消</el-button></span>
        </el-dialog>
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import { couponApi } from '@/api/ModuleMarketing.js'
import { miniWxApi } from '@/api/ModuleCommon.js'

import clipboard from '@/utils/clipboard'; // 复制功能
import vueQr from 'vue-qr';

export default {
    name: 'Red',
    components: { vueQr },
    mixins: [common, cud],
    data() {
        return {
            // 优惠劵使用规则
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
                status: '' ,// 商品状态
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
            urlDialogVisible: false,    //查看链接弹窗显示
            dialogUrlList: [        //查看链接数组
                {
                    title: '移动端',
                    type: 'MB',
                    url: this.$shareRedirectUrl + '?detailsType=coupon&', //移动端
                    showQrImg: false,
                    qrImg: '',
                },
                {
                    title: '小程序',
                    type: 'MINI',
                    url: '',
                    showQrImg: false,
                    qrImg: '',      //此时的qrImg与Url是一致的
                }
            ],
            mpQrLoading: false,      //小程序链接码
        }
    },
    computed: {
        formatDate() {
            return (dateTimeStr) => {
                if(dateTimeStr.includes('至')){
                    let [start,end] = dateTimeStr.split('至')
                    return `${start} &nbsp;至&nbsp; ${end}`
                }else {
                    return dateTimeStr
                }
            }
        },
        // 是否加载完全小程序链接码
        isLoadMpQr() {
            return !!this.dialogUrlList.find(item => item.type == 'MINI').url
        }
    },
    mounted() {
        // this.getShopParamItem()
        console.log('this--', this.$shareRedirectUrl, this.$config, this.dialogUrlList)
    },
    methods: {
        // 选择item
        selectItem(itemId) {
            for (const item of this.paramsList) {
                if (item.id == itemId) {
                    this.$set(item, 'value', JSON.stringify(!JSON.parse(item.value)))
                }
            }
        },

        // 添加优惠劵
        addCoupon(row) {
            this.$router.push({ name: 'redAdd' })
        },

        // 查看或者复制
        goDetail(row, couponType) {
            this.$router.push({ name: 'redAdd', query: { couponType, couponId: row.id } })
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.mulSels = []
            this.getData()
        },

        // 批量删除
        mulDel() {
            if (!this.mulSels?.length) {
                this.$message.warning('请选择至少一条数据')
                return
            }
            this.handleStatus(this.mulSels, 'del', -2, true)
        },

        // 改变状态
        handleStatus(ids, type, status, isBatch = false) {
            console.log(ids, type, status)
            this.$confirm(this.handleType[type], '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    couponApi.updateCouponStatu(status, ids).then((res) => {
                        if (res.code == 1) {
                            if(isBatch) {   //批量删
                                this.mulSels = []
                            }else {     //单删
                                let index = this.mulSels.indexOf(ids[0]);
                                if(index > -1) {
                                    this.mulSels.splice(index,1)
                                }
                            }
                            this.$message({ type: 'success', message: '操作成功!' })
                            this.getData()
                        }
                    })
                })
                .catch(() => {
                    this.$message({ type: 'info', message: '已取消操作' })
                })
        },

        //查看链接
        viewLinks(id) {
            let hasUrl = null;
            this.mpQrLoading = true;
            miniWxApi.getMiniQrCode({
                flag: true,
                page: 'ModuleCenter/coupon/couponDetail',
                scene: {
                    id,
                    type: 'center'
                }
            }).then(res => {
                if(res.code) {
                    hasUrl = res.data;
                    this.$options.data.call(this).dialogUrlList.forEach((item, index) => {
                        if(item.type == 'MINI') {
                            this.dialogUrlList[index].url = this.dialogUrlList[index].qrImg = res.data
                        }else {
                            this.dialogUrlList[index].url = item.url + `id=${id}`
                        }
                    })
                }else {
                    this.$message.error('小程序链接码加载失败，请稍后再试')
                }
            }).catch(err=> {
                console.error('小程序码加载失败--',err)
            }).finally(() => {
                if(hasUrl) {
                    this.mpQrLoading = false;
                }
            })
            this.urlDialogVisible = true;
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
        },

        qrCallBack(img, li) {
            li['qrImg'] = img
        },
        // 复制链接
		handleCopy(text, event) {
			clipboard(text, event);
		},
        // 大小二维码切换
        clickQr(li) {
            li['showQrImg'] = !li['showQrImg']
		},
        // 根据传入的params来决定展示端的不同
        // platforms: Array
        showUrlList(platforms) {
           return this.dialogUrlList.filter(item => platforms.includes(item.type))
        },
        // 弹窗关闭 解决上一次弹窗打开时的残影（数据）
        handleDialogClose() {
            this.dialogUrlList = this.$options.data.call(this).dialogUrlList;
        }
    }
}
</script>
<style scoped>
</style>
