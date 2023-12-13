<!-- /*
 * @Descripttion:重建索引
*/ -->
<template>
    <section class="bg-white" style="min-height: calc(100vh - 114px - 20px)">
        <el-card>
            <div style="margin-top: 20px">
                <span class="mr-15">选择重建索引的类目：</span>
                <el-radio-group v-model="val" class="" size="medium">
                    <el-radio-button label="0" border>全部</el-radio-button>
                    <el-radio-button label="1" border>商品</el-radio-button>
                    <el-radio-button label="2" border>店铺</el-radio-button>
                    <el-radio-button label="4" border>优惠券</el-radio-button>
                </el-radio-group>
                <el-button class="ml-20" type="primary" size="medium" @click="reIndex">确定</el-button>
            </div>
            <el-row slot="header" type="flex" justify="space-between" align="middle">
                <el-col class="d-flex a-center">
                    <span>索引概况</span>
                </el-col>
            </el-row>
            <el-row v-loading="isLoading" type="flex" justify="space-around" class="mb-50 mt-50">
                <el-col type="flex" align="middle">
                    <el-row class="font-weight font-22 mt-30 mb-30">数据库索引信息</el-row>
                    <div class="flex-center">
                        <el-form style="width: auto" label-position="right" label-width="120px">
                            <el-form-item label="优惠券索引数量：">
                                {{ reIndexData.indexDocumentDTO && reIndexData.indexDocumentDTO.couponDocumentCount }}
                            </el-form-item>

                            <el-form-item label="商品索引数量：">
                                {{ reIndexData.indexDocumentDTO && reIndexData.indexDocumentDTO.productDocumentCount }}
                            </el-form-item>
                            <el-form-item label="店铺索引数量：">
                                {{ reIndexData.indexDocumentDTO && reIndexData.indexDocumentDTO.shopDocumentCount }}
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col type="flex" align="middle">
                    <el-row class="font-weight font-22 mt-30 mb-30">es索引信息</el-row>
                    <div class="flex-center">
                        <el-form style="width: auto" label-position="right" label-width="120px">
                            <el-form-item label="优惠券索引数量：">
                                {{ reIndexData.esIndexDocumentDTO && reIndexData.esIndexDocumentDTO.couponDocumentCount }}
                            </el-form-item>

                            <el-form-item label="商品索引数量：">
                                {{ reIndexData.esIndexDocumentDTO && reIndexData.esIndexDocumentDTO.productDocumentCount }}
                            </el-form-item>
                            <el-form-item label="店铺索引数量：">
                                {{ reIndexData.esIndexDocumentDTO && reIndexData.esIndexDocumentDTO.shopDocumentCount }}
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </section>
</template>
<script>
import { GoodsManage } from '@/api/ModuleGoods'
export default {
    name: 'ReIndex',
    components: {},
    mixins: [],
    data() {
        return {
            val: '0',
            reIndexData: {},
            isLoading: true
        }
    },
    mounted() {
        GoodsManage.reIndexCount()
            .then((res) => {
                if (res.code) {
                    console.log(res.data)
                    this.reIndexData = res.data
                }
            })
            .finally(() => {
                this.isLoading = false
            })
    },
    methods: {
        reIndex() {
            GoodsManage.reIndex(this.val).then((res) => {
                if (res.code == 1) {
                    this.$message.success(res.data)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form .el-form-item {
    margin-bottom: 10px;
}
</style>
