<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-商品
*/ -->
    <div v-loading="loading" class="w-100 text-center px-30 py-20 bg-fa" :data="data.resultList">
        <el-input v-model="apiParmas.productName" placeholder="请输入商品名称" style="width: 100%" :maxlength="500" clearable>
            <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
        <template v-if="data && data.resultList && data.resultList.length">
            <el-row class="my-20" :gutter="15" type="flex" style="flex-wrap: wrap">
                <el-col v-for="(item, index) in data.resultList" :key="item.id" class="mb-15" :span="8">
                    <div
                        class="w-100 rounded-5 hover-current flex-start bg-white p-5 font-12 position-relative overflow-h"
                        :style="{ border: selectedId == item.id ? `2px solid ${parmas.themeColor || '#409EFF'}` : '2px solid #ffffff' }"
                        @click="choice(item)"
                    >
                        <i
                            v-if="selectedId == item.id"
                            class="iconfont icon-xuanze position-absolute line-h font-24"
                            :style="{ color: parmas.themeColor || '#409EFF', bottom: '-1px', right: '-1px' }"
                        />
                        <img v-if="item.pic" style="width: 80px; height: 80px" :src="$photoServer + item.pic" alt="" />
                        <div v-else class="bg-ccc flex-center" style="width: 80px; height: 80px">
                            <i class="el-icon-picture text-999 font-36"></i>
                        </div>
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
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        field: {
            //如果是对象，显示的键名，选中的对象是存放到value[this.field]里的
            type: String,
            default: ''
        }
    },
    data() {
        return {
            data: '',
            apiParmas: {
                curPage: 1,
                productName: '',
                pageSize: 12
            },
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            selectedId: '', //记录选中了哪个index
            noMsg: false,
            loading: false
        }
    },
    computed: {},
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue && newValue[this.field] && newValue[this.field].id && newValue[this.field].type == '商品') {
                    //如果是另一个链接进来
                    this.selectedId = newValue[this.field].id
                } else {
                    this.selectedId = ''
                }
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
        currentChange(val) {
            this.apiParmas.curPage = val
            this.getData()
        },
        choice(item) {
            this.$set(this.value, this.field, this.$utils.object.deepClone(item))
            this.$set(this.value[this.field], 'type', '商品')
        }
    }
}
</script>

<style lang="scss" scoped></style>
