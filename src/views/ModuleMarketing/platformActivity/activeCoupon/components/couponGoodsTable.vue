<template>
    <div class="">
        <el-table ref="multipleTable" size="small" border :data="tableList" tooltip-effect="dark" class="w-100">
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column prop="shopName" label="店铺名称" align="center">
                <template slot-scope="scope">
                    <div class="d-flex">
                        <ls-image style="flex: 0 0 50px" :src="scope.row.shopAvatar" :options="{ w: '50', h: '50', br: '6' }" />
                        <el-link class="ml-5" :underline="false" type="primary" style="height: 45px">
                            <div class="line-clamp2">{{ scope.row.shopName }}</div>
                        </el-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center"  >
                <template slot-scope="scope">
                    <span class="table__action">
                        <el-link :underline="false" type="primary" @click="couponProductDel(scope.row)">删除</el-link>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { couponApi } from '@/api/ModuleMarketing'

export default {
    components: { },
    props: {
        tableList: {
            type: [Array, Object],
            required: true
        },
        couponForm: {
            type: [Array, Object],
            default() {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        couponProductDel(row) {
            console.log(this.couponForm)
            console.log(this.couponForm.id)
            couponApi.couponProductDel(row.shopId, this.couponForm.id).then((res) => {
                if (res.code) {
                    this.$emit('delCouponShop', row.shopId)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped></style>
