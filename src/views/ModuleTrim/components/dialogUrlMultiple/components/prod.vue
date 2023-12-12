<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-商品(多选)
*/ -->
    <div v-loading="loading" class="w-100 text-center px-30 py-20 bg-fa" :data="data.resultList">
        <el-input v-model="apiParmas.productName" placeholder="请输入商品名称" style="width: 100%" :maxlength="500" clearable>
            <el-button slot="append" icon="el-icon-search" @click="doSearch" />
        </el-input>
        <template v-if="data && data.resultList && data.resultList.length">
            <el-row class="my-20" :gutter="15" type="flex" style="flex-wrap: wrap">
                <el-col v-for="(item, index) in data.resultList" :key="item.id" class="mb-15" :span="8">
                    <div
                        class="w-100 rounded-5 hover-current flex-start bg-white p-5 font-12 position-relative overflow-h"
                        :style="{ border: item.isSelect ? `2px solid ${parmas.themeColor || '#409EFF'}` : '2px solid #ffffff' }"
                        @click="choice(item)"
                    >
                        <i
                            v-if="item.isSelect"
                            class="iconfont icon-xuanze position-absolute line-h font-24"
                            :style="{ color: parmas.themeColor || '#409EFF', bottom: '-1px', right: '-1px' }"
                        />
                        <img v-if="item.pic" :src="$photoServer + item.pic" style="width: 80px; height: 80px" alt="" />
                        <div v-else class="bg-ccc flex-center" style="width: 80px; height: 80px"><i class="el-icon-picture text-999 font-36" /></div>
                        <div class="flex-1 pl-10 text-left overflow-h">
                            <div class="line-clamp2 text-666">{{ item.name }}</div>
                            <div class="line-clamp1 text-999">价格：{{ item.price }}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-pagination
                :current-page.sync="data.curPageNO"
                :page-size="data.pageSize"
                layout="prev, pager, next, jumper"
                :total="data.total"
                @current-change="currentChange"
            />
        </template>
        <Empty v-if="noMsg" text="暂无商品信息" />
    </div>
</template>
<script>
import { decorate } from '@/api/ModuleTrim'
export default {
    components: {},
    props: {
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            data: '',
            apiParmas: {
                productName: '',
                status: '',
                curPage: 1,
                pageSize: 12
            },
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            tempList: [], // 商品传入的临时数据。用于组件缓存数据
            noMsg: false,
            loading: false
        }
    },
    computed: {
        tempItem() {
            let idList = []
            if (this.value && this.value.length) {
                idList = this.value.map((item) => item.id)
            }
            return idList
        }
    },
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.tempList = newValue
                } else {
                    this.tempList = []
                }
                this.$nextTick(() => {
                    this.toggleSelection() //这个很重要，不能删
                })
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.getData()
    },
    methods: {
        doSearch() {
            this.apiParmas.curPage = 1
            this.getData()
        },
        getData() {
            this.loading = true
            this.noMsg = false
            decorate
                .prodList(this.apiParmas)
                .then((res) => {
                    if (res.code) {
                        this.data = res.data
                        if (!this.data.resultList.length) {
                            this.noMsg = true
                        }
                        this.$nextTick(() => {
                            this.toggleSelection()
                        })
                    }
                })
                .catch((err) => {
                    this.noMsg = true
                    console.log(err)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        toggleSelection() {
            if (this.data.resultList) {
                this.data.resultList.forEach((item) => {
                    item.isSelect = false
                    if (this.tempItem.includes(item.id)) {
                        item.isSelect = true
                    }
                })
                this.$forceUpdate() //要强制刷新后才显示已选
            }
        },
        currentChange(val) {
            this.apiParmas.curPage = val
            this.getData()
        },
        choice(item) {
            if (this.tempItem.includes(item.id)) {
                //如果是取消
                let index = this.tempList.findIndex((item1) => {
                    return item1.id === item.id
                }) //找出是要删除那一个元素的index
                this.tempList.splice(index, 1)
            } else {
                //如果是添加
                let itemData = this.$utils.object.deepClone(item)
                itemData.type = '商品'
                this.tempList.push(itemData)
            }
            this.$emit('input', this.tempList)
        }
    }
}
</script>

<style lang="scss" scoped></style>
