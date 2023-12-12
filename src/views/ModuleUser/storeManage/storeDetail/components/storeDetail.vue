<!-- /*
 * @Descripttion: 店铺管理->查看->对应的店铺详情
*/ -->
<template>
    <div v-loading="loading">
        <el-card class="pl-30 pt-10 pb-10 border-none">
            <!-- 顶部信息 -->
            <el-row type="flex" justify="space-between" align="bottom">
                <el-row type="flex" align="middle">
                    <ls-image :src="userInfo.shopAvatar" class="mr-20" :options="{ w: '100', h: '100', br:'50' }"/>
                    <div class="font-main">
                        <div class="mt-20">
                            <span>联系人姓名：</span>
                            <span v-show="!isEdit">{{ userInfo.contactName }}</span>
                            <el-input v-show="isEdit" v-model="userInfo.contactName" class="w-450p" size="small" />
                        </div>
                        <div class="mt-20">
                            <span>联系人手机：</span>
                            <span v-show="!isEdit">{{ userInfo.contactPhone }}</span>
                            <el-input v-show="isEdit" v-model="userInfo.contactPhone" class="w-450p" size="small" />
                        </div>
                    </div>
                </el-row>
                <div>
                    <el-button size="mini" @click="goPage('orderList', 'shopId', userInfo.id)">查看订单列表</el-button>
                    <el-button size="mini" @click="goPage('goodsManageList', 'shopId', userInfo.id)">查看商品列表</el-button>
                    <el-button size="mini" @click="goPage('shopUserInfo', 'shopUserId', userInfo.shopUserId)">查看用户信息</el-button>
                </div>
            </el-row>
        </el-card>
        <!-- 内容部分 -->
        <el-row :gutter="20" type="flex" class="mt-20">
            <!-- 左侧信息 -->
            <el-col :span="12">
                <el-card style="height: 100%">
                    <div slot="header" class="font-14">
                        <span>店铺信息</span>
                    </div>
                    <section class="formWarp">
                        <el-form ref="form" :model="userInfo" label-width="132px" size="small">
                            <el-form-item label="入驻类型：">
                                <p>{{ userInfo.applyForType == 1 ? '企业入驻' : '个人入驻' || '-' }}</p>
                            </el-form-item>
                            <el-form-item label="店铺名称：">
                                <p v-show="!isEdit">{{ userInfo.shopName || '-' }}</p>
                                <el-input v-show="isEdit" v-model="userInfo.shopName" class="w-450p" />
                            </el-form-item>
                            <el-form-item label="店铺地址：">
                                <p v-if="!isEdit">
                                    {{
                                        (userInfo.province||'') +
                                        (userInfo.city === userInfo.province ? '' : userInfo.city) +
                                        (userInfo.area||'') +
                                        (userInfo.street||'') +
                                        (userInfo.shopAddress||'')
                                    }}
                                </p>
                                <InputCascader v-if="isEdit" v-model="userInfo.region" class="w-450p" />
                            </el-form-item>
                            <el-form-item v-show="isEdit" prop="shopAddress">
                                <el-input v-model="userInfo.shopAddress" class="w-450p" />
                            </el-form-item>
                            <el-form-item label="店铺类型：">
                                <p>{{ userInfo.shopType == 0 ? '专营店' : userInfo.shopType == 1 ? '旗舰店' : '自营店' }}</p>
                            </el-form-item>
                            <el-form-item label="修改时间：">
                                <p>{{ userInfo.updateTime || '-' }}</p>
                            </el-form-item>

                            <el-form-item label="申请时间：">
                                <p>{{ userInfo.createTime || '-' }}</p>
                            </el-form-item>
                            <el-form-item label="店铺图片：">
                                <ls-image
                                    v-show="!isEdit"
                                    :src="userInfo.shopAvatar"
                                    :options="{ w: '100', h: '100' }"
                                    class="rounded-5"
                                />
                                <imgCenter
                                    v-show="isEdit"
                                    v-model="userInfo.shopAvatar"
                                    :uploadStyle="{ width: '100px', height: '100px' }"
                                    :isPreview="false"
                                />
                                <span v-show="isEdit" style="margin-left: 15px; color: rgb(153, 153, 153)">建议尺寸：100*100px</span>
                            </el-form-item>

                            <el-form-item>
                                <el-button v-if="isEdit" @click="isEdit = false">取消</el-button>
                                <el-button type="primary" @click="onSubmit('form')">
									{{ isEdit ? '保存' : '编辑' }}
								</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                </el-card>
            </el-col>
            <!-- 右侧信息 -->
            <el-col :span="12">
                <el-card>
                    <el-row slot="header" justify="space-between" class="font-14">
                        <span>验证信息</span>
                    </el-row>
                    <section class="formWarp">
                        <el-form ref="form" :model="userInfo" label-width="132px" size="small">
                            <el-form-item v-if="userInfo.applyForType == 1" label="公司名字：">
                                <p>{{ userInfo.companyName || '-' }}</p>
                            </el-form-item>
                            <el-form-item v-if="userInfo.applyForType == 1" label="法人姓名：">
                                <p>{{ userInfo.corporateName || '-' }}</p>
                            </el-form-item>
                            <el-form-item v-if="userInfo.applyForType == 1" label="统一社会信用代码：">
                                <p>{{ userInfo.unifiedSocialCreditCode || '-' }}</p>
                            </el-form-item>
                            <el-form-item label="营业执照：" v-if="userInfo.applyForType == 1">
                                <ls-image :src="userInfo.businessLicense" :options="{ w: '100', h: '100' }" class="rounded-5" />
                            </el-form-item>
                            <el-form-item :label="userInfo.applyForType == 1 ? '法人身份证正面：' : '身份证正面：'">
                                <ls-image :src="userInfo.idCardPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
                            </el-form-item>
                            <el-form-item :label="userInfo.applyForType == 1 ? '法人身份证反面：' : '身份证反面：'">
                                <ls-image :src="userInfo.idCardBackPic" :options="{ w: '100', h: '100' }" class="rounded-5" />
                            </el-form-item>
                        </el-form>
                    </section>
                </el-card>
                <el-card class="mt-20">
                    <el-row slot="header" type="flex" justify="space-between" class="font-14">
                        <span>审核信息</span>
                    </el-row>
                    <section class="formWarp">
                        <el-form ref="form" :model="userInfo" label-width="132px" size="small">
                            <el-form-item label="审核状态：">
                                <p :class="userInfo.auditStatus == 0 ? 'status-wait' : userInfo.auditStatus == 1 ? 'status-pass' : 'status-veto'">{{ userInfo.auditStatus == 0 ? '待审核' : userInfo.auditStatus == 1 ? '通过 ' : '拒绝' }}</p>
                            </el-form-item>
                            <el-form-item label="审核意见：">
                                <p>{{ userInfo.auditOpinion || '-' }}</p>
                            </el-form-item>
                            <el-form-item label="审核时间：">
                                <p>{{ userInfo.auditTime || '-' }}</p>
                            </el-form-item>
                        </el-form>
                    </section>
                </el-card>
            </el-col>
        </el-row>
        <!-- 内容部分 -->
    </div>
</template>
<script>
import { storeManage } from '@/api/ModuleUser.js'
import InputCascader from '@/components/InputCascader'
export default {
    name: 'Userinfo',
    components: {
        InputCascader
    },
    data() {
        return {
            userInfo: {
                region: []
            },
            activeName: 'second',
            isEdit: false ,// 是否编辑
			loading:false,
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        // 获取详情
        getUserInfo() {
            if (this.$route.query.id === undefined) {
                this.$route.query.id = '1'
            }
			this.loading = true
            storeManage.storeDetail(this.$route.query.id).then((res) => {
                if (res.code == 1) {
                    this.userInfo = res.data
                    this.$set(this.userInfo, 'region', [
                        Number(res.data.provinceId),
                        Number(res.data.cityId),
                        Number(res.data.areaId),
                        Number(res.data.streetId)
                    ])
                }
            }).finally(()=>{
				this.loading = false
			})
        },
        // 跳转页面
        goPage(val, key, id) {
            this.$router.push({ name: val, query: { [key]: id } })
        },
        // 点击tab
        handleClick(tab, event) {
            // console.log(tab, event)
        },
        //保存编辑
        onSubmit(form) {
            if (this.isEdit) {
                this.$refs[form].validate((valid) => {
                    // console.log(valid)
                    if (valid) {
                        console.log(this.userInfo)
                        this.userInfo.provinceId = this.userInfo.region[0]
                        this.userInfo.cityId = this.userInfo.region[1]
                        this.userInfo.areaId = this.userInfo.region[2]
                        this.userInfo.streetId = this.userInfo.region[3]
                        storeManage
                            .editStoreDetail(this.userInfo)
                            .then((res) => {
                                this.$message.success('编辑成功')
                                this.isEdit = false
                                this.getUserInfo()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
            } else {
                this.isEdit = true
            }
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .self__table {
    &.el-table thead {
        color: #000;
    }
}
</style>
