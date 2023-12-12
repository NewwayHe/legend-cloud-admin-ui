<!-- /*
 * @Descripttion:商品列表组件
*/ -->
<template>
    <el-card class="table" shadow>
        <el-table
            ref="multipleTable"
            v-loading="tableListLoading"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100 border-left border-right rounded-5"
            size="mini"
            row-key="id"
            header-row-class-name="headerRow"
        >
            <template slot="empty">
                <empty empty-type="pro" text="暂无活动信息" />
            </template>
            <el-table-column prop="pic" label="商品">
                <template slot-scope="scope">
                    <div class="d-flex a-center line-h-md">
                        <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                        <el-popover placement="top" width="450" trigger="hover" :title="scope.row.name || scope.row.productName">
                            <el-link type="primary" target="_blank" :underline="false" :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId">{{$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId}}</el-link>
                            <el-link
                                slot="reference"
                                :underline="false"
                                class="line-clamp2 ml-10"
                                type="primary"
                                target="_blank"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ scope.row.name || scope.row.productName }}
                            </el-link>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="cnProperties" show-overflow-tooltip label="商品规格">
                <template slot-scope="scope">{{ scope.row.cnProperties || '-'}}</template>
            </el-table-column>
            <el-table-column prop="price" show-overflow-tooltip label="商品价格">
                <template slot-scope="scope">{{ scope.row.price | priceFilter}}</template>
            </el-table-column>
            <el-table-column prop="stocks" show-overflow-tooltip label="库存" />
        </el-table>
        <el-row type="flex" justify="end" class="mt-30" :span="9">
            <pagination
                :current-page="searchFilters.curPage"
                :total="tableTotal"
                :auto-scroll="false"
                @size-change="pageSizeChange"
                @current-change="currentPageChange"
            />
        </el-row>
    </el-card>
</template>
<script>
import serviceConfig from '@/config'
import common from '@/mixins/pages/commom'
export default {
    name: 'TableGoods',
    components: { },
    mixins: [common],
    props: ['useType', 'couponId'],
    data() {
        return {
            tableList: [],
            searchFilters: {
                couponId: '',
                useType: ''
            },
            url: {
                getData: '/activity/admin/shop/coupon/product'
            },
            config: serviceConfig
        }
    },
    computed: {},
    watch: {},
    created() {
        this.isMounted = true
        this.searchFilters.couponId = this.couponId
        this.searchFilters.useType = this.useType
    },
    methods: {}
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
<style lang="scss" scoped>
.table {
    ::v-deep .el-card__body {
        padding: 0px;
    }
}
</style>
