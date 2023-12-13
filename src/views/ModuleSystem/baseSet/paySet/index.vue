<!-- /*
 * @Descripttion:支付配置
*/ -->
<template>
    <section>
        <el-card shadow="never" :body-style="{ padding: `20px 20px 10px 20px` }">
            <div class="search">
                <el-form :inline="true" :model="searchFilters" size="small">
                    <el-form-item label="配置类型">
                        <el-select v-model="searchFilters.group" clearable>
                            <el-option v-for="(item, index) in groupNameList" :key="index" :label="item.desc" :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置名称">
                        <el-input v-model="searchFilters.des" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.stop="dbnSearch">搜索</el-button>
                        <el-button @click.stop="clearCache">清除缓存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                    <template slot="empty">
                        <empty empty-type="pro" text="暂无配置信息" />
                    </template>
                    <el-table-column label="序号" type="index" width="48" />
                    <el-table-column prop="des" label="配置名称" />
                    <el-table-column prop="remark" label="配置描述" />
                    <el-table-column v-if="false" prop="status" label="状态">
                        <template slot-scope="scope">
                            <span class="edit">
                                {{ scope.row.enabled ? '启用' : '禁用' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <span class="edit">
                                <el-link type="primary" @click="editPay(scope.row)">编辑</el-link>
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
            <dialogSet ref="dialogSet" :type="currentType" />
        </el-card>
    </section>
</template>
<script>
import dialogSet from '../components/dialogSet'
import { paySet } from '@/api/ModuleSystem.js'
import common from '@/mixins/pages/commom'

export default {
    name: 'PaySet',
    components: {
        dialogSet
    },
    mixins: [common],
    data() {
        return {
            url: {
                getData: '/basic/admin/sys/params/group/list'
            },
            currentType: '',
            groupNameList: [],
            isMounted: true
        }
    },
    mounted() {
        paySet.sysGroupName().then((res) => {
            if (res.code) {
                this.groupNameList = res.data
            }
        })
    },
    methods: {
        editPay(row) {
            this.currentType = row.groupBy
            this.$refs.dialogSet.showDialog(row.name)
        },
        clearCache() {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                paySet.sysClearCache().then((res) => {
                    console.log(res.data)
                })
            })
        }
    }
}
</script>
