<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件-常用功能
*/ -->
    <div class="h-100 overflow-y-scroll">
        <div class="w-100 text-center px-30 py-20">
            <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
                <el-col v-for="(item, index) in pageData" :key="item.id" class="mb-15" :span="6">
                    <div
                        class="w-100 rounded-5 hover-current flex-col-center bg-fa p-10 font-12 position-relative overflow-h"
                        :style="{
                            border: selectedId == item.id ? `2px solid ${parmas.themeColor || '#409EFF'}` : '2px solid #ffffff',
                            color: selectedId == item.id ? parmas.themeColor || '#409EFF' : '#999999'
                        }"
                        @click="choice(item)"
                    >
                        <i
                            v-if="selectedId == item.id"
                            class="iconfont icon-xuanze position-absolute line-h font-24"
                            style="bottom: -1px; right: -1px"
                        />

                        <i class="iconfont" :class="item.icon" style="font-size: 36px" />
                        <div>{{ item.name }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { basic } from '@/api/ModuleSystem';
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
            pageData: [
                { name: '首页', id: 'index',icon:'icon-index' },
                { name: '商品类目', id: 'category',icon:'icon-fenlei' },
                { name: '商品品牌', id: 'brand',icon:'icon-pinpai' },
                { name: '购物车', id: 'cart',icon:'icon-gouwuche1' },
                { name: '个人中心', id: 'my',icon:'icon-usergr' },
                { name: '我的收藏', id: 'collection',icon:'icon-aixin' },
                { name: '我的消息', id: 'message',icon:'icon-xiaoxi' },
                { name: '我的足迹', id: 'history',icon:'icon-zuji1' },
                { name: '预存款', id: 'preDeposit',icon:'icon-yucunkuan' },
                // { name: '红包', id: 'red',icon:'icon-youhuiquan' },//红包已变成【平台优惠券】
                { name: '优惠券', id: 'coupon',icon:'icon-coupons' },
                { name: '我的评论', id: 'comments',icon:'icon-evaluation' },
                { name: '常见问题', id: 'question',icon:'icon-wenhao5' },
                { name: '意见反馈', id: 'feedback',icon:'icon-fankui' },
                { name: '我的问答', id: 'consultMy',icon:'icon-wenhao' },
                { name: '我的发票', id: 'invoice', icon: 'icon-dingdanguanli' },
                { name: '我的账单', id: 'bill', icon: 'icon-dingdan' }
            ],
            themeRGB: this.$utils.color.colorRgb(this.parmas.themeColor || '#409EFF'),
            selectedId: '' //记录选中了哪个index
        }
    },
    computed: {
		//如果是PC端装修，则有些没有的功能要屏蔽
		isPcTrim(){
			return this.$route.name=='pcTrim'||this.$route.name=='PcTrim'
		}
	},
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue && newValue[this.field] && newValue[this.field].id && newValue[this.field].type == '常用功能') {
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
		if (this.isPcTrim) {
			this.pageData = [
			    { name: '首页', id: 'index',icon:'icon-index' },
			    { name: '商品类目', id: 'category',icon:'icon-fenlei' },
			    { name: '商品品牌', id: 'brand',icon:'icon-pinpai' },
			    { name: '购物车', id: 'cart',icon:'icon-gouwuche1' },
			    { name: '个人中心', id: 'my',icon:'icon-usergr' },
			    { name: '我的收藏', id: 'collection',icon:'icon-aixin' },
			    { name: '我的消息', id: 'message',icon:'icon-xiaoxi' },
			    { name: '我的足迹', id: 'history',icon:'icon-zuji1' },
			    // { name: '预存款', id: 'preDeposit',icon:'icon-yucunkuan' },
			    // { name: '红包', id: 'red',icon:'icon-youhuiquan' },//红包已变成【平台优惠券】
			    { name: '优惠券', id: 'coupon',icon:'icon-coupons' },
			    { name: '我的评论', id: 'comments',icon:'icon-evaluation' },
			    { name: '常见问题', id: 'question',icon:'icon-wenhao5' },
			    { name: '意见反馈', id: 'feedback',icon:'icon-fankui' },
			    { name: '我的问答', id: 'consultMy',icon:'icon-wenhao' },
			]
		}
		basic
			.contactInformationGet()
			.then(res => {
				if (res.code && res.data && res.data.openFlag) {
					this.pageData.push({ name: '联系客服', id: 'contact',icon:'icon-kefu2' })
				}
			})
	},
    methods: {
        choice(item) {
            this.$set(this.value, this.field, this.$utils.object.deepClone(item))
            this.$set(this.value[this.field], 'type', '常用功能')
        }
    }
}
</script>

<style lang="scss" scoped></style>
