<template>
    <!-- /*
     * @Descripttion:分类展示
    */ -->
    <div v-loading="loading" class="font-12">
        <div class="flex-start w-100">
            <div class="span-2 text-right mr-20">展示类目：</div>
            <el-radio-group v-model="params.category" class="flex-1">
                <el-radio :label="1">一级分类</el-radio>
                <el-radio :label="2">二级分类</el-radio>
                <el-radio :label="3">三级分类</el-radio>
            </el-radio-group>
        </div>
        <div class="flex-start w-100" style="padding-top: 18px;">
            <div class="span-2 text-right mr-20">展示模式：</div>
            <el-radio-group v-model="params.schema" class="flex-1" @change="change2">
                <el-radio :label="1">有图模式</el-radio>
                <el-radio :label="0">无图模式</el-radio>
            </el-radio-group>
        </div>
		<div class="flex-start w-100" style="padding-top: 18px;" v-if="params.category == 1">
		    <div class="span-2 text-right mr-20">商品列表：</div>
		    <el-radio-group v-model="params.goods" class="flex-1" @change="change3">
		        <el-radio :label="1">展示</el-radio>
		        <el-radio :label="0" :disabled="params.schema==0">关闭</el-radio>
		    </el-radio-group>
		</div>
        <div class="flex-start w-100" style="padding-top: 18px;">
            <div class="span-2 text-right mr-20">分类广告：</div>
            <el-radio-group v-model="params.showCatAdvert" class="flex-1">
                <el-radio :label="1" :disabled="params.category == 1&&!params.goods">展示</el-radio>
                <el-radio :label="0">关闭</el-radio>
                <el-button size="small" @click="goCatAdvert">设置分类广告</el-button>
            </el-radio-group>
        </div>
        <div class="d-flex w-100" style="padding-top: 18px;">
            <div class="span-2 text-right mr-20">展示效果：</div>
            <div class="flex-1">
                <img
					v-if="
						!((!params.schema || params.showCatAdvert) && params.category == 1)  || 
						(params.schema && params.showCatAdvert && params.category && params.goods) ||
						(!params.schema && params.goods)
					"
                    :src="
                        require(`@/assets/images/category/${params.category}${params.schema === 1 ? '' : '-no'}-category${params.goods&&params.category == 1 ? '-good' : ''}${params.showCatAdvert ? '-adv' : ''}.png`)
                    "
                    alt=""
                />
            </div>
        </div>
        <LsSticky>
			<el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
				<el-button type="primary" size="small" @click="save">保&emsp;存</el-button>
			</el-row>
		</LsSticky>
    </div>
</template>

<script>
import { classifiedDisplay } from '@/api/ModuleStore'
export default {
    components: {},
    filters: {},
    props: {},
    data() {
        return {
            params: {
                category: 3, //展示类目：1：一级分类，2：二级分类，3：三级分类
                schema: 0, //分类图：1：有图模式，0：无图模式
                showCatAdvert: 0 ,//展示一级分类广告
				goods:0,//展示商品列表
            },
            loading: true //防止请求完接口后闪一下
        }
    },
    watch: {
	},
    mounted() {
        this.getSettingCategory()
    },
    destroyed() {},
    methods: {
        getSettingCategory() {
            // console.log('我运行了')
            this.loading = true
            classifiedDisplay
                .settingCategory()
                .then((res) => {
                    this.params = { ...this.params, ...res.data }
					if (this.params.category==1&&this.params.schema&&!this.params.goods) {
						this.params.showCatAdvert = 0
					}
                })
                .finally((res) => {
                    this.loading = false
                })
        },
		change2(e){
			if (e==0&&this.params.category==1) {
				this.params.goods = 1
			}
		},
		change3(e){
			if (e==0&&this.params.schema==1) {
				this.params.showCatAdvert = 0
			}
		},
        save() {
            classifiedDisplay
                .updateCategory(this.params)
                .then((res) => {
                    if (res.code) {
                        this.$message.success('保存成功')
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg)
                })
        },
        goCatAdvert() {
            this.$parent.$parent.changeCategory('CATEGORY_ADVERT')
        }
    }
}
</script>

<style></style>
