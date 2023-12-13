<template>
    <el-card v-loading="pageLoading" class="message" :body-style="{ padding: `20px 20px 10px 20px` }">
        <template v-if="list.length">
            <div v-for="(item, index) in list" :key="index" class="flex-between mb-15 p-20" style="border: 1px solid #eee">
                <div class="d-flex" style="max-width: 90%">
                    <div class="flex-center flex-shrink" style="width: 40px; height: 40px">
                        <img :src="imgSrc1" class="w-100 h-100" alt="" />
                    </div>
                    <div class="ml-20 d-flex flex-column j-sb w-100" style="">
                        <div class="d-flex">
                            <span v-if="item.status == 0" class="redDot"></span>
                            <div class="line-clamp1 font-14">{{ item.title }}</div>
                        </div>
                        <div class="line-clamp1 text-999 font-12">{{ item.recDate }}&emsp;{{ item.content }}</div>
                    </div>
                </div>
                <el-link type="primary" :underline="false" class="font-12" @click="checkDetail(item)">查看&nbsp;&gt;&gt;</el-link>
            </div>
        </template>
        <template v-else>
            <Empty empty-type="pro" text="暂无消息" />
        </template>
        <LsSticky :data="list">
            <el-row type="flex" justify="space-between" class="w-100 overflow-h py-10 mt-10 bg-white">
                <el-button size="small" type="primary" @click="cleanUnread">清除未读</el-button>
                <pagination
                    :current-page="page.curPage"
                    :page-size="page.pageSize"
                    :total="page.total"
                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                />
            </el-row>
        </LsSticky>
        <dialogMessage ref="dialogMessage" :msg-id="curCheckItem ? curCheckItem.id : ''" @closeMsg="closeMsg" />
    </el-card>
</template>

<script>
import { basic } from '@/api/ModuleSystem'
import dialogMessage from './components/dialogMessage'

export default {
    name: 'Message',
    components: { dialogMessage },
    data() {
        return {
            pageLoading: false,
            imgSrc1: require('@/assets/images/download-icon.png'), // 系统通知图标
            page: {
                curPage: 1,
                pageSize: 10,
                total: 0
            },
            list: [],
            curCheckItem: null //当前查看项
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.pageLoading = true
            basic
                .getUnreadList({
                    curPage: this.page.curPage,
                    pageSize: this.page.pageSize
                })
                .then((res) => {
                    if (res.code) {
                        this.list = res.data.resultList
                        this.page.total = res.data.total
                    }
                })
                .finally(() => {
                    this.pageLoading = false
                })
        },
        // 改变页容量
        pageSizeChange(e) {
            this.page.pageSize = e
            this.getData()
        },
        // 改变当前页
        currentPageChange(e) {
            this.page.curPage = e
            this.getData()
        },
        checkDetail(item) {
            this.curCheckItem = item
            this.$refs.dialogMessage.showDialog()
        },
        closeMsg() {
            if (this.curCheckItem.status == 0) {
                this.curCheckItem.status = 1
                this.$nextTick(() => {
                    //刷新未读消息数
                    this.$store.dispatch('user/getMsgInfo')
                })
            }
        },
        cleanUnread() {
            this.$confirm('是否清除所有未读消息?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                basic.cleanUnread().then((res) => {
                    if (res.code) {
                        this.$message({ type: 'success', message: '操作成功!' })
                        this.getData()
                        this.$nextTick(() => {
                            //刷新未读消息数
                            this.$store.dispatch('user/getMsgInfo')
                        })
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.message {
    // min-height: 500px;
    .redDot {
        display: block;
        width: 8px;
        height: 8px;
        flex-shrink: 0;
        margin-right: 10px;
        margin-top: 2px;
        background: #f56c6c;
        border-radius: 50%;
        box-shadow: 0 0 5px #f56c6c;
    }
}
</style>
