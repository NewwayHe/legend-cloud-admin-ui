<!-- /*
 * @Descripttion:用户信息
*/ -->
<template>
    <div>
        <el-tabs v-model="activeName" class="topTabs">
            <el-tab-pane label="店铺信息" name="first" :lazy="true">
                <store-detail />
            </el-tab-pane>
            <el-tab-pane label="审核历史" name="second" :lazy="true">
                <verify-history />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import storeDetail from './components/storeDetail'
import verifyHistory from './components/verifyHistory'
export default {
    components: {
        storeDetail,
        verifyHistory
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {}
}
</script>
