<!-- /*
 * @Descripttion:营销广场
*/ -->
<template>
    <div class="bg-fff d-flex flex-wrap p-20">
        <template v-for="(item, index) in dataList">
            <Card :key="index" :data="item" class="mr-20 mb-20" />
        </template>
    </div>
</template>

<script>
import Card from './components/card'

export default {
    name: 'Marketing',
    components: { Card },
    data() {
        return {
            dataList: [
                {
                    label: '裂变神器',
                    title: '广告弹窗',
                    img: require('@/assets/icons/marketing/popupAdvert.png'),
                    url: 'popupAdvertData',
                    describeList: ['1、多方位推广，实现全平台推广', '2、提供快捷入口，快速提升销量']
                },
                {
                    label: '老客留存',
                    title: '满减优惠券',
                    img: require('@/assets/icons/marketing/coupon.png'),
                    url: 'coupon',
                    describeList: ['1、激发用户消费欲望', '2、新用户引流神器', '3、老客户唤醒法宝']
                }
            ]
        }
    },
    created() {},
    methods: {}
}
</script>
<style scoped lang="scss">
h3 {
    padding: 4px 0;
    font-size: 14px;
    font-weight: bold;
}
.grid {
    display: inline-block;
    margin: 15px;
    width: 420px;
    height: 130px;
    overflow: hidden;
}
</style>
