<template>
    <section class="">
        <!-- 数据趋势 -->
        <data-trends />
        <!--数据趋势 -->
        <!--订单端口分布 -->
        <order-port />
        <!-- 订单端口分布 -->
        <!-- 订单地区分布 -->
        <order-area />
        <!-- 订单地区分布 -->
    </section>
</template>
<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud.js'
import setting from '@/settings'
import dataTrends from './components/dataTrends'
import orderPort from './components/orderPort'
import orderArea from './components/orderArea'
export default {
    components: {
        dataTrends,
        orderPort,
        orderArea
    },
    mixins: [common, cud],
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
</script>
