<!-- /*
 * @Descripttion:属性管理->规格参数分组
*/ -->
<template>
    <section class="mb-50">
        <el-card shadow>
            <!-- 查询 -->
            <div class="formWarp">
                <el-form :inline="false" label-position="right" label-width="150px" size="mini">
                    <el-form-item label="规格参数分组标题：">
                        <span class="font">{{ detailItem.name }}</span>
                    </el-form-item>
                    <el-form-item label="关联商品类目：">
                        <div class="font-0">
                            <el-tag v-for="(item, index) in detailItem.categoryList" :key="item.id" class="mr-10 mb-10" size="small" type="primary">
                                {{ item.name }}
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table px-20">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="status" size="large"  @change="changeStatus">
                            <el-radio-button label="1">关联规格</el-radio-button>
                            <el-radio-button label="2">关联参数</el-radio-button>
                            <el-radio-button label="3">关联参数组</el-radio-button>
                            <el-radio-button label="4">关联品牌</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <!--列表-->
                <el-table ref="multipleTable" :key="num" v-loading="tableListLoading" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无关联信息" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />

                    <template v-if="status == 1">
                        <el-table-column prop="propName" label="规格标题" />
                        <el-table-column prop="memo" label="规格副标题" show-overflow-tooltip />
                        <el-table-column prop="type" label="类型" width="50">
                            <template slot-scope="scope">
                                <span>{{ scope.row.type == 'TXT' ? '文本' : '图片' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="prodPropStr" label="规格值" show-overflow-tooltip min-width="200">
                            <template slot-scope="scope">
                                <span>{{ scope.row.prodPropStr || '-' }}</span>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-if="status == 2">
                        <el-table-column prop="propName" label="参数标题" />
                        <el-table-column prop="memo" label="参数副标题" />
                        <el-table-column prop="prodPropStr" label="规格值" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.prodPropStr || '-' }}</span>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-if="status == 3">
                        <el-table-column prop="name" label="参数组标题" />
                        <el-table-column prop="memo" label="参数组副标题" />
                        <el-table-column prop="propertyStr" label="关联参数" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.propertyStr || '-' }}</span>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-if="status == 4">
                        <el-table-column prop="brandPic" label="品牌LOGO">
                            <template slot-scope="scope">
                                <ls-image style="vertical-align: middle" :src="scope.row.brandPic" :options="{ w: '50', h: '50', br: '4' }"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="brandName" label="品牌名称" />
                        <el-table-column label="推荐品牌">
                            <template slot-scope="scope">
                                <span>{{ scope.row.commendFlag ? '是' : '否' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template slot-scope="scope">
                                <el-link v-if="scope.row.status == 0" :underline="false" type="danger">下线</el-link>
                                <el-link v-if="scope.row.status == 1" :underline="false" type="success">上线</el-link>
                                <el-link v-if="scope.row.status == -1" :underline="false" type="warning">待审核</el-link>
                                <el-link v-if="scope.row.status == -2" :underline="false" type="danger">未通过</el-link>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                <el-row type="flex" justify="end" class="mt-30">
                    <pagination :current-page="page.curPage" :total="tableTotal" @size-change="pageSizeChange" @current-change="currentPageChange" />
                </el-row>
            </div>
        </el-card>

        <Sticky>
            <el-button size="small" @click="goBack">返回</el-button>
        </Sticky>
    </section>
</template>
<script>
import { specificationParamsGroup } from '@/api/ModuleGoods'
import { request } from '@/utils/request'

export default {
    components: {
    },
    data() {
        return {
            tableListLoading: false,
            tableList: [],
            id: '',
            status: '1',
            tableTotal: 0,
            page: {
                pageSize: 10,
                curPage: 1
            },
            num: 0, // 让table能够重新渲染
            url: '/product/admin/productPropertyAgg/specification',
            detailItem: {}
        }
    },
    watch: {
        status(value) {
            if (value === '1') {
                this.url = '/product/admin/productPropertyAgg/specification'
            } else if (value === '2') {
                this.url = '/product/admin/productPropertyAgg/param'
            } else if (value === '3') {
                this.url = '/product/admin/productPropertyAgg/paramGroup'
            } else {
                this.url = '/product/admin/productPropertyAgg/brand'
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id
        console.warn(this.id)
        this.getDetail(this.$route.query.id)
    },
    methods: {
        // 获取规格参数分组详情
        getDetail(id) {
            specificationParamsGroup
                .productPropertyAgg(id)
                .then((res) => {
                    this.detailItem = res.data
                    this.getTableData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 表格数据
        getTableData() {
            this.tableListLoading = true
            request
                .get(this.url, {
                    pageSize: this.page.pageSize,
                    curPage: this.page.curPage,
                    id: this.id
                })
                .then((res) => {
                    this.tableListLoading = false
                    this.tableTotal = res?.data?.total || 0
                    this.tableList = res?.data?.resultList || []
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 切换状态
        changeStatus() {
            this.page.curPage = 1
            this.getTableData()
            this.num++
        },

        // 返回列表页
        goBack() {
            this.$router.push({
                path: '/ModuleGoods/attributeManage/specificationParamsGroup'
            })
        },

        /**
         *  页码改变
         */
        currentPageChange(p) {
            this.page.curPage = p
            this.getData()
        },

        /**
         *  页数改变
         */
        pageSizeChange(size) {
            this.page.pageSize = size
            this.getData()
        }
    }
}
</script>

<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style >
.el-tooltip__popper {
    max-width: 60vw;
}
</style>
