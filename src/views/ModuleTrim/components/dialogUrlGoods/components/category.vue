<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-商品分类
*/ -->
    <div v-loading="loading" class="w-100 px-30 py-20 bg-fa" style="height: 585px" :data="data">
        <template v-if="data && data.length">
            <div class="flex-start mb-5">
                <el-button class="mr-10" @click="goCategory">管理分类</el-button>
                <!-- <span class="font-weight">你当前的选择是：</span> -->
                <div class="flex-1 flex-start flex-wrap">
                    <div v-for="(item, index) in tempList" :key="index" class="bg-f5 d-inline-block text-nowrap text-999 mb-5 mr-5 py-3 px-10">
                        <i class="el-icon-error font-16 text-ccc cursor-pointer v-middle" @click.stop="del(index)"></i>
                        <span>{{ item.name[0] }}</span>
                        <template v-if="item.name[1]">
                            <i class="el-icon-arrow-right" />
                            <span>{{ item.name[1] }}</span>
                        </template>
                        <template v-if="item.name[2]">
                            <i class="el-icon-arrow-right" />
                            <span>{{ item.name[2] }}</span>
                        </template>
                    </div>
                </div>
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
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor),
            props: {
                multiple: true,
                checkStrictly: true,
                value: 'id',
                label: 'name'
            },
            tempList: [], // 商品传入的临时数据。用于组件缓存数据
            cascaderValue: [],
            noMsg: false,
            loading: false
        }
    },
    computed: {},
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (this.field) {
                    //如果有传field值
                    if (newValue && newValue.categoryIdList && newValue.categoryIdList[this.field] && newValue.categoryIdList[this.field].length) {
                        this.num++ //如果不加这个，cascaderValue值更新后不会在页面上渲染
						this.cascaderValue =  this.$utils.object.deepClone(newValue.categoryIdList[this.field].map((item) => {return item.id}))  //回选
						this.tempList = this.$utils.object.deepClone(newValue.categoryIdList[this.field])
                        this.$forceUpdate()
                    } else {
                        this.cascaderValue = []
                        this.tempList = []
                    }
                } else {
                    //如果没有传field值
                    if (newValue && newValue.categoryIdList && newValue.categoryIdList.length) {
                        this.num++ //如果不加这个，cascaderValue值更新后不会在页面上渲染
						this.cascaderValue =  this.$utils.object.deepClone(newValue.categoryIdList.map((item) => {return item.id}))  //回选
						this.tempList = this.$utils.object.deepClone(newValue.categoryIdList) 
                        this.$forceUpdate()
                    } else {
                        this.cascaderValue = []
                        this.tempList = []
                    }
                }
            },
            deep: true,
            immediate: true
        },
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
            let item = []
            this.$refs['cascaderAddr'].getCheckedNodes().forEach((element, index) => {
                let obj = {
                    id: this.cascaderValue[index],
                    name: element.pathLabels
                }
                item.push(obj)
            })
            if (this.field) {
                this.tempList[this.field] = this.$utils.object.deepClone(item)
            } else {
                this.tempList = this.$utils.object.deepClone(item)
            }
        },
        goCategory() {
            this.$router.push({
                name: 'commodityCategory'
            })
        },
        del(index) {
            this.num++ //如果不加这个，删掉值后，不会更新
            this.cascaderValue.splice(index, 1)
            this.tempList.splice(index, 1)
            this.$forceUpdate()
        },
		confirm(){
			this.$emit('getTempList', 'categoryIdList', this.tempList)
		}
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .el-cascader-menu__wrap{
        height: 520px;
	}
</style>
