<template>
    <el-dialog v-loading="tableListLoading" title="选择模板" :visible.sync="dialogVisible" width="820px" custom-class="dialog-form">
        <!-- 查询 -->
        <div class="search">
            <el-form :inline="true" :model="searchFilters" size="small" @submit.native.prevent>
                <el-form-item label="页面名称">
                    <el-input v-model="searchFilters.name" placeholder="请输入" @keyup.enter.native="dbnSearch" />
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="searchFilters.type" clearable placeholder="全部" size="small">
                        <el-option label="全部" :value="null" />
                        <el-option label="官方" :value="1" />
                        <el-option label="原创" :value="2" />
                    </el-select>
                </el-form-item>

                <el-form-item class="mb-20">
                    <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--如果有数据-->
        <el-row v-if="tableList && tableList.length" class="d-flex flex-wrap mt-10 flex-1 px-20" :gutter="20" style="flex-warp: warp">
            <el-col v-for="item in tableList" :key="item.id" :span="6" class="pb-20">
                <template v-if="item.id">
                    <div
                        class="w-100 h-0 position-relative rounded-10 overflow-h bg-eee hover-current"
                        style="padding-bottom: 125%"
                        @click="editInfo(item.id)"
                    >
                        <ls-image class="position-absolute" :src="item.coverPicture" :options="{ w: '100%' }" :is-preview="false" />
                    </div>
                    <div class="line-clamp1">
                        <div
                            class="mt-10 d-inline-block text-white px-5 font-12 rounded-3 line-h-md mr-5"
                            :style="{ background: item.type == 1 ? '#45be89' : '#ff9b00' }"
                        >
                            <span>{{ item.type == 1 ? '官方' : '原创' }}</span>
                        </div>
                        <span>{{ item.name }}</span>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="w-100 h-0 position-relative rounded-10 overflow-h bg-eee hover-current"
                        style="padding-bottom: 125%"
                        @click="editInfo('')"
                    >
                        <div class="flex-center w-100 h-100 position-absolute">
                            <span class="el-icon-plus text-main" style="font-size: 100px"></span>
                        </div>
                    </div>
                    <div class="w-100 flex-center h-28p">
                        <span class="mt-10">空白自建</span>
                    </div>
                </template>
            </el-col>
        </el-row>
        <!-- 如果没有数据 -->
        <el-row v-else class="d-flex flex-wrap mt-10 flex-1 px-20" :gutter="20" style="flex-warp: warp">
            <el-col :span="6" class="pb-20">
                <div
                    class="w-100 h-0 position-relative rounded-10 overflow-h bg-eee hover-current"
                    style="padding-bottom: 125%"
                    @click="editInfo('')"
                >
                    <div class="flex-center w-100 h-100 position-absolute">
                        <span class="el-icon-plus text-main" style="font-size: 100px"></span>
                    </div>
                </div>
                <div class="w-100 flex-center h-28p">
                    <span class="mt-10">空白自建</span>
                </div>
            </el-col>
        </el-row>

        <el-row type="flex" justify="end" class="mt-20">
            <el-pagination
                :page-sizes="[page.pageSize, 30, 50, 100, 500, 1000]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="page.curPage"
                :total="tableTotal"
                @size-change="pageSizeChange"
                @current-change="currentPageChange"
            />
        </el-row>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'
import common from '@/mixins/pages/commom'
export default {
    name: 'DialogCategory',
    mixins: [common],
    props: {},
    data() {
        return {
            dialogVisible: false,
            url: {
                getData: '/shop/admin/decoratePage/list'
            },
            page: {
                pageSize: 8
            },
            searchFilters: {
                name: '',
                status: '',
                category: 'INDEX-T',
                source: 'mobile',
                isSetFirstEmpty: true
            }
        }
    },
    computed: {},
    watch: {},
    methods: {
        change(type) {
            this.dialogVisible = !this.dialogVisible
            if (type == 'POSTER') {
                this.searchFilters.category = 'POSTER-T'
            } else {
                this.searchFilters.category = 'INDEX-T'
            }
            this.getData()
        },

        // 编辑装修
        editInfo(id) {
            this.$router.push({
                path: '/h5Trim',
                query: {
                    id: id || '',
                    category: this.searchFilters.category == 'POSTER-T' ? 'POSTER' : 'INDEX',
                    isUser: true
                }
            })
        }
    }
}
</script>

<style>
.dialog-form {
    max-height: 90vh !important;
}
</style>
