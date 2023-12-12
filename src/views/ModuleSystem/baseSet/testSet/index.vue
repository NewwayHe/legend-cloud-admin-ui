<template>
    <section class="">
        <div class="table">
            <el-card class="mb-15">
                <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100">
                    <template slot="empty">
                        <empty empty-type="pro" />
                    </template>
                    <el-table-column label="序号" type="index" width="100" />
                    <el-table-column prop="des" label="描述" />
                    <el-table-column prop="remark" label="支付方式描述" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span class="edit">状态字段</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"  fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="edit">
                                <el-link type="primary">编辑为对接</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" justify="end" class="mt-20">
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
            </el-card>
        </div>
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
                getData: '/basic/admin/sys/params/page?group=SYS'
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
