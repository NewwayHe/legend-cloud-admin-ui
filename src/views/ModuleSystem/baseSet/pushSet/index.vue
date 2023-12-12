<!--
    * Desc    : 推送配置
-->
<template>
    <section class="">
        <el-card class="mb-15">
            <div class="table">
                <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="des" label="描述" />
                    <el-table-column prop="remark" label="支付方式描述" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span class="edit">状态字段</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <span class="edit">
                                <el-link type="primary">编辑为对接</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-30">
                    <el-pagination
                        :page-sizes="[10, 30, 50, 100, 500, 1000]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page.curPage"
                        :total="tableTotal"
                        @size-change="pageSizeChange"
                        @current-change="currentPageChange"
                    />
                </el-row>
            </div>
        </el-card>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'

export default {
    name: '',
    components: { },
    mixins: [cud, common],
    data() {
        return {
            url: {
                getData: '/basic/admin/sys/params/page?group=PUSH'
            }
        }
    },
    computed: {},
    watch: {},
    created() {},
    destroyed() {},
    mounted() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
