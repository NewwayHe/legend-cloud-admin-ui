<template>
    <!-- /*
 * @Descripttion:选择链接的那个e图标及取完值后的显示(只支持单选，要多选请参考dialogUrlMultiple)
 * 用法：
 * 	数组里的item，备注，如果下面写成v-model="item"会编译不成功
 * 	<dialogUrl ref="dialog" v-model="value.data.menu[index]" :parmas="parmas" :key="index"/>
 * 	普通对象：
 * 	<dialogUrl ref="dialog" v-model="value.firstData" :parmas="parmas"/>
 * 	import dialogUrl from '../../../components/dialogUrl/dialogUrl';
 * 		
*/ -->
    <!-- 选择链接 -->
    <div class="w-100 flex-start overflow-h text-nowrap cursor-pointer" :class="className">
        <!-- <i class="iconfont icon-lianjie text-main font-24 main-hover"/> -->
        <el-button type="primary" size="small" @click="showDialog()">设置</el-button>
        <div v-if="value[field] && value[field].id" class="flex-1 flex-start overflow-h">
            <span v-if="value[field].type" class="ml-10" :style="{ color: parmas.themeColor || '#409EFF' }">{{ value[field].type }}</span>
            <div class="ml-10 flex-1 flex-start overflow-h">
                <img v-if="value[field].pic" style="width: 24px; height: 24px" :src="$photoServer + value[field].pic" alt="" />
                <span v-if="value[field].name" class="line-clamp1 ml-5">{{ value[field].name.toString() }}</span>
            </div>
        </div>
		<div class="flex-start ml-5 text-999" v-else>
		    <span>{{placeholder}}</span>
		</div>
        <!-- 链接弹框组件 -->
        <dialog-url ref="dialog" v-model="valueTemp" :parmas="parmas" :tab="tab" :field="field" @input="input"/>
    </div>
</template>
<script>
import dialogUrl from './index.vue'
export default {
    components: { dialogUrl },
    props: {
        className: String, // 类名
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
        tab: {
            //可以选择只要哪几个tab页面，如只要'商品':tab="[{name:'商品',type:'prod'}]"
            type: Array,
            default: () => {
                return []
            }
        },
        field: {
            //如果是对象，显示的键名，选中的对象是存放到value[this.field]里的
            type: String,
            default: 'url'
        },
        placeholder: {
            //占位文本
            type: String,
            default: '请选择'
        }
    },
    data() {
        return {
			valueTemp:{}
		}
    },
    computed: {},
    watch: {},
    created() {
	},
    methods: {
        showDialog() {
			this.valueTemp = this.value
            this.$refs.dialog.showDialog()
        },
		input(val){
            console.log(val)
			this.$emit('input',val)
		}
    }
}
</script>

<style lang="scss" scoped></style>
