<template>
    <el-dialog title="关联商品" :visible.sync="group.visible" custom-class="dialog-form-small" @closed="closed">
        <div>
            <el-form :model="groupForm" size="small" label-width="98px" @submit.native.prevent @keyup.enter.native="groupSearch">
                <el-form-item label="商品名称：">
                    <el-input v-model="groupForm.title" placeholder="请输入">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="groupSearch" />
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                ref="groupTable"
                v-loading="tableListLoading"
                class="w-100 dialog-form-table mt-15"
                tooltip-effect="dark"
                size="small"
                :data="groupList"
                header-row-class-name="headerRow"
            >
                <el-table-column prop="prodName" label="商品名称" show-overflow-tooltip width="250">
                    <template slot-scope="scope">
                        <div class="d-flex">
                            <ls-image
                                style="flex: 0 0 40px"
                                :src="scope.row.pic"
                                :options="{ w: '40', h: '40', br: '6' }"
                            />
                            <div class="line-clamp2 ml-10" style="line-height:1.6">{{ scope.row.name }}</div>
                            <!-- <el-link class="line-clamp2 ml-10" :underline="false">{{ scope.row.name }}</el-link>    -->
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span :class="associatedList.includes(scope.row.id) ? 'status-pass' : 'status-done'">{{ associatedList.includes(scope.row.id) ? '已选择' : '未选择' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="relationFlag" label="操作">
                    <template slot-scope="scope">
                        <el-link v-if="!associatedList.includes(scope.row.id)" :underline="false" type="primary" @click="relateParams(scope.row.id)" class="font-12">
                            关联
                        </el-link>
                        <el-link v-else :underline="false" type="primary" @click="cancelRelateParams(scope.row.id)" class="font-12">取消关联</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row type="flex" justify="end" align="middle" class="mt-10">
            <el-pagination
                small
                layout="prev, pager, next"
                :total="group.total"
                :page-size="group.pageSize"
                :current-page="group.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>

        <span slot="footer">
            <el-button size="small" @click="group.visible = false">取 消</el-button>
            <el-button v-ls-loading size="small" type="primary" @click="submitGroup">{{ showTip ? '保 存' : '确 定' }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'
import { goodsGroup } from '@/api/ModuleGoods'
export default {
    name: 'DialogGroup',
    props: {
        itemId: {
            type: [String, Number],
            default: ''
        },
        showTip: {
            type: Boolean,
            default: true
        },
        // 关联的
        relatedRow: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            isFirst: false,
            group: {
                visible: false,
                pageNo: 1,
                pageSize: 5,
                total: 5
            },
            // 搜索条件
            groupForm: {
                title: ''
            },
            groupList: [], // 表格数据
            tableListLoading: false,

            associatedList: [] //后台返回的关联商品的ID列表
        }
    },
    methods: {
        // 初始化
        groupInit() {
            console.log('..............%s', this.itemId)
            this.tableListLoading = true
            goodsGroup
                .getGoodsList({
                    curPage: this.group.pageNo,
                    pageSize: this.group.pageSize,
                    name: this.groupForm.title,
                    opStatus: 1,
                    status: 1
                })
                .then((res) => {
                    if (!res.code) {
                        return
                    }
                    this.tableListLoading = false
                    this.group.total = res?.data?.total || 0
                    this.groupList = res?.data?.resultList || []

                    //已经关联的上商品
                    !this.isFirst && this.group.visible && this.getGroupList(this.itemId)
                })
        },
        // 获取已关联的商品id列表
        getGroupList(itemId) {
            goodsGroup
                .getProductIdsList({
                    id: itemId
                })
                .then((res) => {
                    if (!res.code) {
                        return
                    }
                    this.isFirst = true
                    this.associatedList = res.data
                })
        },
        // 确定关联组
        submitGroup() {
            if (this.associatedList.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            this.$emit('relateGroup', this.associatedList)
        },

        // 搜索
        groupSearch() {
            console.log('search')
            this.group.pageNo = 1
            this.groupInit()
        },
        // 显示dialog
        dialogShow() {
            this.group.visible = true
            // 需要等待数据更新完才能初始化
            this.$nextTick(() => {
                this.groupInit()
            })
        },

        // 关闭dialog
        dialogClose() {
            this.group.visible = false
            this.isFirst = false
        },

        // 下一页
        dialogcurrentPageChange(value) {
            this.group.pageNo = value
            this.groupInit()
        },

        //关联
        relateParams(id) {
            this.associatedList.push(id)
        },
        //未关联
        cancelRelateParams(id) {
            this.associatedList = this.associatedList.filter((item) => item != id)
        },

        closed() {
            this.groupForm.title = ''
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

<style>
.tip {
    font-size: 10px;
    color: #9c9ca5;
    margin-right: 8px;
}
</style>
