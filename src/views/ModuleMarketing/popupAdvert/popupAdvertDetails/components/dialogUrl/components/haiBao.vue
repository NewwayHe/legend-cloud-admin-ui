<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-海报页
*/ -->
    <div v-loading="loading" class="w-100 text-center px-30 py-20" :data="data.resultList">
        <el-input v-model="apiParmas.pageName" placeholder="请输入海报页名称" style="width: 100%" :maxlength="500" clearable>
            <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
        <template v-if="data && data.resultList && data.resultList.length">
            <div class="w-100 text-nowrap bg-fa h-44p mt-20 flex-start">
                <div class="flex-1 text-left ml-60">ID</div>
                <div class="flex-2 text-left">海报页名称</div>
            </div>
            <div class="mb-20">
                <div
                    v-for="(item, index) in data.resultList"
                    :key="item.id"
                    class="w-100 flex-start border-bottom border-f1 py-25 hover-current position-relative overflow-h"
                    :style="{ border: selectedId == item.id ? `2px solid ${parmas.themeColor || '#409EFF'}!important` : '' }"
                    @click="choice(item)"
                >
                    <i
                        v-if="selectedId == item.id"
                        class="iconfont icon-xuanze position-absolute line-h font-24"
                        :style="{ color: parmas.themeColor || '#409EFF', bottom: '-1px', right: '-1px' }"
                    />
                    <div class="flex-1 text-left ml-60">{{ item.id }}</div>
                    <div class="flex-2 text-left">{{ item.name }}</div>
                </div>
            </div>
            <el-pagination
                :current-page.sync="data.curPageNO"
                :page-size="data.pageSize"
                layout="prev, pager, next, jumper"
                :total="data.total"
                @current-change="currentChange"
            />
        </template>
        <Empty v-if="noMsg" text="暂无海报信息" />
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
                pageName: '',
                pageSize: 5
            },
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            selectedId: '', //记录选中了哪个id
            noMsg: false,
            loading: false
        }
    },
    computed: {},
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue && newValue[this.field] && newValue[this.field].id && newValue[this.field].type == '海报页') {
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
			let api = (this.$route.name=='pcTrim'||this.$route.name=='PcTrim')?'pcPosterPage':'mbPosterPage'//如果是PC端装修，则加载PC海报，否则就是手机端海报
			decorate[api](this.apiParmas)
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
        choice(e) {
			let item = {
				type: '海报页',
			    name: e.name,
			    id: e.id,
			}
			this.$set(this.value, this.field, this.$utils.object.deepClone(item))
        }
    }
}
</script>

<style lang="scss" scoped></style>
