<template>
    <el-dialog title="选择店铺" :visible.sync="group.visible" custom-class="dialog-form-small">
        <div>
            <el-form :model="groupForm" size="small" label-width="98px">
                <el-form-item label="店铺名称：">
                    <el-input v-model="groupForm.shopName" placeholder="请输入">
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
                row-key="id"
                :data="groupList"
                header-row-class-name="headerRow"
            >
                <!-- 自定义选择列 -->
                <el-table-column width="42" align="center">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox v-model="checkAll" :disabled="!groupList.length" size="small" @change="cusHandleAllSelect" :indeterminate="customCheckHalf"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.customChecked" size="small" @change="(selected)=>cusHandleSingleSelect(scope.row,selected)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="shopName" label="店铺名称" align="left">
                    <template slot-scope="scope">
                        <div class="d-flex a-center">
                            <ls-image style="flex: 0 0 50px" :src="scope.row.shopAvatar" :options="{ w: '50', h: '50', br: '4' }" />
                            <el-link class="ml-10" :underline="false" type="primary">
                                <span class="line-clamp2">{{ scope.row.shopName }}</span>
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="mt-10 dialog-paging">
            <el-checkbox class="pl-10 font-12" v-model="checkAll" @change="cusHandleAllSelect" :indeterminate="customCheckHalf" :disabled="!groupList.length">全选</el-checkbox>
            <el-pagination
                small
                layout="prev, pager, next"
                :total="group.total"
                :page-size="group.pageSize"
                :current-page="group.pageNo"
                @current-change="dialogcurrentPageChange"
            />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="group.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitGroup">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { request } from '@/utils/request'
import { couponApi } from '@/api/ModuleMarketing'
import { object } from '@/utils/utils'
export default {
    props: {
        // 店铺列表
        shopListIds: {
            type: Array,
            default() {
                return []
            }
        },
        couponId: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            group: {
                visible: false,
                pageNo: 1,
                pageSize: 5,
                total: 5,
                selectedRow: [] // 选中的行
            },
            // 搜索条件
            groupForm: {
                shopName: ''
            },
            tempShopIds: [], // 商品传入的临时数据。用于组件缓存数据
            selShopIds: [],    //深拷贝的临时数据。用于勾选状态判断
            groupList: [], // 表格数据
            tableListLoading: false
        }
    },
    computed: {
        // 半选
        customCheckHalf() {
            if(this.checkAll) {
                return false
            }else if(this.groupList.length && this.selShopIds.length) {
                return true
            }else {
                return false
            }
        },
        checkAll: {
            get() {
                const tableIds = this.groupList.map((item) => item.id)
                return tableIds && tableIds.length && tableIds.every((item) => this.selShopIds.includes(item))
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        shopListIds: {
            handler(newVal) {
                this.tempShopIds = newVal
                this.selShopIds = object.deepClone(newVal) //隔离数据互扰
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 初始化
        groupInit() {
            this.tableListLoading = true
            request
                .get('/shop/admin/shop/detail/page', {
                    curPage: this.group.pageNo,
                    pageSize: this.group.pageSize,
                    shopName: this.groupForm.shopName,
                    opStatus: 1
                })
                .then((res) => {
                    this.tableListLoading = false
                    if(res.code) {
                        this.group.total = res.data.total
						if(res.data&&res.data.resultList){
							this.groupList = res.data.resultList.map((item)=>{
							    if(this.selShopIds.includes(item.id)) {
							        item.customChecked = true
							    }else {
							        item.customChecked = false
							    }
							    return item;
							})
						}
                    }
                })
                .catch((err) => {
                    this.tableListLoading = false
                    console.log(err)
                })
        },

        // 保存关联组
        submitGroup() {
            if (this.selShopIds.length === 0) {
                this.$message.warning('至少选择一项')
                return
            }
            couponApi
                .couponShopPut({
                    selectShopId: this.selShopIds,
                    id: this.couponId
                })
                .then((res) => {
                    if (res.code) {
                        this.$emit('update:couponId', res.data)
                        this.$emit('sumbitTable', this.selShopIds)
                        this.group.visible = false
                    }
                })
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

        // 下一页
        dialogcurrentPageChange(value) {
            this.group.pageNo = value
            this.groupInit()
        },

        // 单行选择
        cusHandleSingleSelect(row,selected) {
            console.log('单行--',row,selected)
            row.customChecked = selected;
            if(selected) {
                if(!this.selShopIds.includes(row.id)) {
                    this.selShopIds.push(row.id)
                }
            }else {
                let index = this.selShopIds.indexOf(row.id)
                if(index > -1) {
                    this.selShopIds.splice(index,1)
                }
            }
        },
        // 全选
        cusHandleAllSelect(selected) {
            this.groupList.forEach((item)=>{
                this.cusHandleSingleSelect(item,selected)
            })
        }
    }
}
</script>

<style>
</style>
