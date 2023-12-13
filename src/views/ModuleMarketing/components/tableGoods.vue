<!-- /*
 * @Descripttion:商品列表组件
*/ -->
<template>
    <el-card class="table" shadow>
        <el-table
            ref="multipleTable"
            :data="tableList"
            tooltip-effect="dark"
            class="w-100 border-left border-right rounded-5"
            size="mini"
            header-row-class-name="headerRow"
        >
            <template slot="empty">
                <empty empty-type="pro" text="暂无活动信息" />
            </template>
            <el-table-column label="商品" width="280">
                <template slot-scope="scope">
                    <div class="d-flex a-center line-h-md">
                        <ls-image style="flex: 0 0 50px" :src="scope.row.pic" :options="{ w: '50', h: '50', br: '4' }" />
                        <el-popover placement="top" width="450" trigger="hover" :title="scope.row.name">
                            <el-link
                                type="primary"
                                target="_blank"
                                :underline="false"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ $shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId }}
                            </el-link>
                            <el-link
                                slot="reference"
                                :underline="false"
                                class="line-clamp2 ml-10"
                                type="primary"
                                target="_blank"
                                :href="$shareRedirectUrl + '?detailsType=good&id=' + scope.row.productId"
                            >
                                {{ scope.row.name }}
                            </el-link>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="cnProperties" show-overflow-tooltip label="商品规格">
                <template slot-scope="scope">
                    {{ scope.row.cnProperties || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="price" show-overflow-tooltip label="销售价" width="115">
                <template slot-scope="scope">
                    {{ scope.row.price | priceFilter }}
                </template>
            </el-table-column>
            <el-table-column prop="groupPrice" show-overflow-tooltip label="团购价格" width="115">
                <template slot-scope="scope">
                    {{ scope.row.groupPrice | priceFilter }}
                </template>
            </el-table-column>
            <el-table-column prop="groupStocks" show-overflow-tooltip label="活动库存" />
            <el-table-column show-overflow-tooltip label="预估收益" width="115">
                <template slot-scope="scope">{{ countProfit(scope.row) | priceFilter }}</template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
import serviceConfig from '@/config'
export default {
    components: {},
    props: {
        from: {
            type: String,
            default: 'group'
        },
        tableList: {
            type: [Array, Object]
        }
    },
    data() {
        return {
            config: serviceConfig
        }
    },
    computed: {},
    watch: {},
    created() {},
    methods: {
        countProfit(row) {
            console.log(row, 'row')
            return (Number(row.groupPrice) || 0) - (Number(row.costPrice) || 0)
        }
    }
}
</script>
<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style>
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
