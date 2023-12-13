<!-- /*
 * @Descripttion:基础信息
*/ -->
<template>
    <section class="formWarp mb-50">
        <el-card>
            <el-form ref="form" :model="form" label-width="132px" size="small">
                <div class="form-title">基本信息</div>
                <el-form-item label="ICP信息：">
                    <el-input v-show="isEdit" v-model="form.icpInfo" class="w-450p" maxlength="50"/>
                    <p v-show="!isEdit">{{ form.icpInfo }}</p>
                </el-form-item>
                <el-form-item label="商城名称：">
                    <el-input v-show="isEdit" v-model="form.domainName" class="w-450p" maxlength="50" />
                    <span v-show="!isEdit">{{ form.domainName }}</span>
					<el-popover placement="top-start" title="用处:" width="500" trigger="hover" >
					    <i slot="reference" class="el-icon-question ml-5 text-999" style="font-size: 16px;"></i>
						<div>【移动APP端】：一、[分享]商品或文章时如果没有商品名称或文章名称时则用该值作为消息的标题，二、APP启动广告下方显示的商城名称。</br>【微信小程序端】：一、页面[发送给朋友]时显示的商城名称，二、小程序登录页面上显示的商城名称。</br>【移动端】：[订单详情]页面交易成功后页面顶部显示的商城名称。</div>
					</el-popover>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-show="isEdit" v-model="form.companyName" class="w-450p" maxlength="50" />
                    <span v-show="!isEdit">{{ form.companyName }}</span>
					<el-popover placement="top-start" title="用处:" width="500" trigger="hover" >
					    <i slot="reference" class="el-icon-question ml-5 text-999" style="font-size: 16px;"></i>
						<div>【移动端】：[个人中心]->[设置]页面底部的版权信息上显示</div>
					</el-popover>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-show="isEdit" v-model="form.telephone" class="w-450p" maxlength="11" :oninput="$inputInteger"/>
                    <p v-show="!isEdit">{{ form.telephone }}</p>
                </el-form-item>
                <el-divider />
				
                <div class="form-title">图片信息</div>
			
				<div class="flex-between">
					<el-form-item class="flex-1" label="系统logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.logo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px'}"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：200 x 200像素(PNG格式透明底反白图效果最佳)</p>
                                <div>
                                    <span>展示位置：1、平台端左上角侧边栏收起小图标；2、商家端左上角侧边栏收起小图标；3、移动端用户未登录时，商品详情页【海报分享】左上角用户默认头像</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/sysLogo.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
					<el-form-item class="flex-1" label="PC端logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.pcUserLogo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px' }"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：高 150 像素，宽 100 ~ 300 像素</p>
                                <div>
                                    <span>展示位置：1、除首页外，PC端所有页面顶部搜索栏logo展示；2、PC端登录/注册/绑定手机/忘记密码等页面logo展示</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/pcLogo.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
				</div>
				
				<div class="flex-between">
					<el-form-item class="flex-1" label="平台端登录页logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.adminBigLogo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px' }"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：200 x 60 像素</p>
                                <div>
                                    <span>展示位置：平台端登录页logo</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/adLogin.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
					<el-form-item class="flex-1" label="平台端侧边栏logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.adminSmallLogo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px'  }"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：150 x 50 像素(PNG格式透明底反白图效果最佳)</p>
                                <div>
                                    <span>展示位置：平台端左上角侧边栏默认展开图标</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/adAside.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
				</div>
				<div class="flex-between">
					<el-form-item class="flex-1" label="商家端登录页logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.shopBigLogo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px'  }"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：150 x 50 像素</p>
                                <div>
                                    <span>展示位置：商家端登录页logo</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/shopLogin.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
					<el-form-item class="flex-1" label="商家端侧边栏logo：">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter v-model="form.shopSmallLogo" :disabled="!isEdit" :upload-style="{ width: '80px',height:'80px', marginRight: '10px'  }"></imgCenter>
                            <div class="font-12 text-999" style="line-height:18px;">
                                <p>建议尺寸：150 x 50 像素(PNG格式透明底反白图效果最佳)</p>
                                <div>
                                    <span>展示位置：商家端左上角侧边栏默认展开图标</span>  
									<imgPreview class="ml-20" placement="top" :src="require('@/assets/images/exampleImgs/shopAside.png')" />
                                </div>
                            </div>
						</div>
					</el-form-item>
				</div>
                
                <el-divider />
				
                <div class="form-title">SEO信息</div>
                <el-form-item label="SEO标题：">
                    <el-input v-show="isEdit" v-model="form.seoTitle" class="w-450p" maxlength="50" show-word-limit />
                    <p v-show="!isEdit">{{ form.seoTitle }}</p>
                </el-form-item>
                <el-form-item label="SEO关键字：">
                    <el-input v-show="isEdit" v-model="form.seoKeywords" class="w-450p" maxlength="50" show-word-limit />
                    <p v-show="!isEdit">{{ form.seoKeywords }}</p>
                </el-form-item>
                <el-form-item label="SEO描述：">
                    <el-input v-show="isEdit" v-model="form.seoDescription" class="w-450p" maxlength="50" show-word-limit />
                    <p v-show="!isEdit">{{ form.seoDescription }}</p>
                </el-form-item>
            </el-form>
        </el-card>
		<Sticky>
		    <el-button v-if="isEdit" size="small" @click="isEdit = false">取消</el-button>
		    <ls-button type="primary" size="small" :async-function="onSubmit">
				{{ isEdit ? '保存' : '编辑' }}
			</ls-button>
		</Sticky>
    </section>
</template>

<script>
import { basic } from '@/api/ModuleSystem.js'
export default {
    components: {},
    data() {
        return {
            form: {},
            isEdit: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        // 获取基本信息
        init() {
            basic
                .get()
                .then((res) => {
                    this.form = Object.assign({}, this.form, res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 提交
        onSubmit() {
            return new Promise(resolve=>{
                if (this.isEdit) {
                // 提交编辑
                    basic
                        .edit(this.form)
                        .then((res) => {
                            console.log(res)
                            this.$message.success('编辑成功')
                            this.isEdit = false
                            this.$router.go(0)
                        })
                        .catch((err) => {
                            console.log(err)
                        }).finally(_=>{
                            resolve()
                        })
                } else {
                    resolve()
                    this.isEdit = true
                }
            })
        },

        // 取消
        onCancel() {
            this.isEdit = false
            this.$router.go(-1)
        }
    }
}
</script>

<style lang='scss'>
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>

<style scoped>
.line {
    text-align: center;
}
</style>
