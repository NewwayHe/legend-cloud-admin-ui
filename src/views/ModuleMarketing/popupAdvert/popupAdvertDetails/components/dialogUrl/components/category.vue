<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-商品分类
*/ -->
    <div v-loading="loading" class="w-100 px-30 py-20 bg-fa" style="height: 585px" :data="data">
        <template v-if="data && data.length">
            <div class="font-weight font-14 mb-5">
                <el-button class="mr-10" @click="goCategory">管理分类</el-button>
                <span>你当前的选择是：</span>
                <span>{{ cascaderLable[0] }}</span>
                <template v-if="cascaderLable[1]">
                    <i class="el-icon-arrow-right" />
                    <span>{{ cascaderLable[1] }}</span>
                </template>
                <template v-if="cascaderLable[2]">
                    <i class="el-icon-arrow-right" />
                    <span>{{ cascaderLable[2] }}</span>
                </template>
            </div>
            <el-cascader-panel
                ref="cascaderAddr"
                :key="num"
                v-model="cascaderValue"
                :options="data"
                :props="props"
                class="w-100"
                @change="choice"
            ></el-cascader-panel>
        </template>

        <Empty v-if="noMsg" text="暂无商品分类信息" />
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
            num: 0, //给组件加key值，防止回选时不重新渲染组件
            data: '',
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            props: {
                checkStrictly: true,
                value: 'id',
                label: 'name'
            },
            cascaderValue: [],
            cascaderLable: [],
            noMsg: false,
            loading: false
        }
    },
    computed: {},
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue && newValue[this.field] && newValue[this.field].id && newValue[this.field].type == '商品分类') {
                    //如果是另一个链接进来
                    this.num++
                    this.cascaderValue = newValue[this.field].id
                    this.cascaderLable = newValue[this.field].name
                    this.$forceUpdate()
                } else {
                    this.cascaderValue = []
                    this.cascaderLable = []
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
        getData() {
            this.loading = true
            this.noMsg = false
            decorate
                .category()
                .then((res) => {
                    if (res.code) {
                        this.data = this.$utils.array.getTreeData(res.data)
                        if (!this.data.length) {
                            this.noMsg = true
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.noMsg = true
                })
                .finally(() => {
                    this.loading = false
                })
        },
        currentChange(val) {
            this.getData()
        },
        // 确定一个节点item
        choice() {
            this.cascaderLable = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
            let item = {
                name: this.cascaderLable,
                type: '商品分类',
                id: this.cascaderValue
            }
            this.$set(this.value, this.field, this.$utils.object.deepClone(item))
        },
        goCategory() {
            this.$router.push({
                name: 'commodityCategory'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
	::v-deep .el-cascader-menu__wrap{
        height: 520px;
	}
</style>
