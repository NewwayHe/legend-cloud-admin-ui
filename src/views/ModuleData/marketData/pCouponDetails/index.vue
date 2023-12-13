<template>
    <div>
        <hearder />
        <mainr />
        <data-trends />
        <commodity-data />
    </div>
</template>

<script>
import hearder from './components/header.vue'
import mainr from './components/main.vue'
import dataTrends from './components/dataTrends.vue'
import commodityData from './components/commodityData.vue'
export default {
    name: 'PCouponDetails',
    components: {
        hearder,
        mainr,
        dataTrends,
        commodityData
    },
    data() {
        return {}
    }
}
</script>

<style>
.aaa {
    width: 200px;
    height: 100px;
    background: red;
}
</style>
