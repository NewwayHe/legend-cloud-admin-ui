<template>
    <!-- /*
     * @Descripttion:(楼层组件：商品列表)：prodList
     * 备注：该组件还有如下bug未解决：
     *      一、 [商品来源]选择了[关联分类]或[关联分组]时，[关联分类]或[关联分组]其中之一没有选中id，更改【商品数量】时会有问题
    */ -->
    <div class="px-10 pt-10" :style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor }">
        <el-row
            :type="isWrap ? 'flex' : ''"
            :gutter="10"
            :style="{ flexWrap: isWrap ? 'wrap' : '', whiteSpace: !isWrap ? 'nowrap' : '', display: !isWrap ? '-webkit-box' : '' }"
        >
            <!-- 以下这个是原版的逻辑(只有[商品来源]选择了[手动选择]时才显示商品详情，[关联分类]或[关联分组]时用默认图片和默认名称代替 -->
            <!-- v-for="(item, index) in floors.sourceType == 'goods' ? (floors.data.goodsList.length ? floors.data.goodsList : 4) : floors.maxNum" 代替：v-for="(item, index) in list"-->
            <el-col
                v-for="(item, index) in list"
                :key="index"
                :style="{
                    width:
                        floors.listType == 1
                            ? '100%'
                            : floors.listType == 2 && isWrap
                            ? '50%'
                            : floors.listType == 3 && isWrap
                            ? '33.3%'
                            : floors.listType == 4 && isWrap
                            ? '25%'
                            : ''
                }"
                :span="floors.listType == 2 && !isWrap ? 12 : floors.listType == 3 && !isWrap ? 8 : floors.listType == 4 && !isWrap ? 6 : 24"
            >
                <div
                    class="overflow-h transition-all05 mb-10"
                    :class="[floors.cardType ? 'rounded-10' : '', floors.listType == 1 ? 'flex-start' : 'flex-col-start']"
                >
                    <div
                        class="position-relative bg-white"
                        :class="[floors.listType == 1 && (floors.showSpuName || floors.showPrice) ? 'w-100p h-100p' : 'w-100 h-0 pb-100pre']"
                    >
                        <img
                            v-if="item.pic || item.productPic"
                            class="position-absolute left-0 w-100 h-100"
                            :src="$photoServer + (item.pic || item.productPic)"
                            alt=""
                        />
                        <div
                            v-else
                            class="position-absolute left-0 w-100 h-100 flex-center"
                            :style="{ backgroundColor: `rgba(${themeRGB.r},${themeRGB.g},${themeRGB.b},0.2)` }"
                        >
                            <i class="el-icon-picture font-36" :style="{ color: `rgba(${themeRGB.r},${themeRGB.g},${themeRGB.b},0.2)` }"></i>
                        </div>

                        <i
                            v-if="floors.showIcon == 'hot'"
                            class="iconfont icon-remai position-absolute left-0"
                            :style="{ color: parmas.themeColor, top: '-1px', fontSize: `32px`, lineHeight: 1 }"
                        />

                        <i
                            v-if="floors.showIcon == 'new'"
                            class="iconfont icon-xinpin position-absolute left-0"
                            :style="{ color: parmas.themeColor, top: `-1px`, fontSize: `32px`, lineHeight: 1 }"
                        />
                        <img
                            v-if="floors.iconImg && floors.showIcon == 'diy'"
                            class="position-absolute left-0 top-0"
                            style="height: 30px; width: 30px"
                            :src="$photoServer + floors.iconImg"
                            alt=""
                        />
                    </div>

                    <div
                        v-if="floors.showSpuName || floors.showPrice"
                        class="p-10 position-relative bg-white overflow-h"
                        :class="[floors.listType == 1 ? 'flex-1 h-100p flex-col-between' : 'w-100']"
                    >
                        <div v-if="floors.showSpuName" :class="[isWrap ? 'line-clamp2' : 'line-clamp1']" :style="{ height: `${isWrap ? 35 : 16}px` }">
                            {{ item.name || item.prodName || item.productName ? item.name || item.prodName || item.productName : '商品示例名名称' }}
                        </div>
                        <div
                            v-if="floors.showPrice"
                            class="font-12 font-arial flex-between overflow-h w-100"
                            :class="[floors.showSpuName ? 'pt-10' : '']"
                            :style="{ color: parmas.themeColor }"
                        >
                            <div class="flex-1 overflow-h text-nowrap">
                                ￥
                                <span :class="[floors.listType == 4 ? 'font-12' : 'font-16']">{{ price(item.price)[0] }}</span>
                                <span v-if="price(item.price)[1]">.{{ price(item.price)[1] }}</span>
                            </div>
							<!-- (由于点击是不会进入购物车的，应客户要求屏蔽掉) -->
                            <!-- <i v-if="floors.showShopCart" class="iconfont icon-gouwuche bg-white font-20" :style="{ color: parmas.themeColor }" /> -->
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { search } from '@/api/ModuleCommon'
import { goodsGroup } from '@/api/ModuleGoods'
export default {
    components: {},
    filters: {},
    props: {
        floors: {
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
        }
    },
    data() {
        return {
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor),
            apiGroupParams: {
                //查询分组接口时需要传入的参数
                groupId: '', //商品分组ID
                curPage: 1,
                pageSize: ''
            },
            apiCategoryParams: {
                //查询分类接口时需要传入的参数
                categoryId: '', //分类Id
                curPage: 1,
                pageSize: ''
            },
            list: this.floors.maxNum
        }
    },
    computed: {
        isWrap() {
            return this.floors.wrap || this.floors.listType == 1 ? true : false //true：换行，false：不换行
        },
        price() {
            //统一管理商品价格
            return function (price) {
                let arr = []
                if (price && price.toString().indexOf('~') != -1) {
                    //判断money是否为1.00~2.00的模式
                    arr = [price ? price : 999, '']
                } else {
                    arr = this.$utils.string.formatNumber(price ? price : 999)
                }
                return arr
            }
        }
    },
    watch: {
        floors: {
            handler(newValue, oldValue) {
                if (this.floors.sourceType == 'goods') {
                    this.list = this.floors.data && this.floors.data.goodsList && this.floors.data.goodsList.length ? this.floors.data.goodsList : 4
                }
                if (this.floors.sourceType == 'category') {
                    this.getCategoryList()
                }
                if (this.floors.sourceType == 'prodGroup') {
                    this.getGroupList()
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    destroyed() {},
    methods: {
        getCategoryList() {
            this.apiCategoryParams.pageSize = this.floors.maxNum
            if (this.floors.data && this.floors.data.categoryData && this.floors.data.categoryData.id && this.floors.data.categoryData.id.length) {
                this.apiCategoryParams.categoryId = this.floors.data.categoryData.id[this.floors.data.categoryData.id.length - 1]
            }
            if (this.apiCategoryParams.categoryId) {
                search
                    .searchProduct(this.apiCategoryParams)
                    .then((res) => {
                        if (res.data) {
                            this.list = res?.data?.resultList || []
                        }
                    })
                    .finally(() => {
                        if (!this.list.length) {
                            this.list = this.floors.maxNum
                        }
                    })
            } else {
                this.list = this.floors.maxNum
            }
        },
        getGroupList() {
            this.apiGroupParams.pageSize = this.floors.maxNum
            this.apiGroupParams.groupId = this.floors.data.prodGroupData.id
            if (this.apiGroupParams.groupId) {
                goodsGroup
                    .groupProduct(this.apiGroupParams)
                    .then((res) => {
                        if (res.code) {
                            this.list = res?.data?.resultList || []
                        }
                    })
                    .finally(() => {
                        if (!this.list.length) {
                            this.list = this.floors.maxNum
                        }
                    })
            } else {
                this.list = this.floors.maxNum
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
