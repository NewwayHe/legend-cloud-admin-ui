<!-- /*
 * @Descripttion:用户信息
*/ -->
<template>
    <div>
        <el-tabs v-model="activeName" class="topTabs" @tab-click="handleClick">
            <el-tab-pane label="基本资料" name="first" :lazy="true">
                <user-detail />
            </el-tab-pane>
            <el-tab-pane label="会员订单" name="second" :lazy="true">
                <vip-order />
            </el-tab-pane>
            <el-tab-pane label="会员账单" name="third" :lazy="true">
                <consumeRecord />
            </el-tab-pane>
            <el-tab-pane label="浏览记录" name="fourth" :lazy="true">
                <browseRecord />
            </el-tab-pane>
            <el-tab-pane label="商品评论" name="fityth" :lazy="true">
                <goodsComment />
            </el-tab-pane>
            <el-tab-pane label="余额明细" name="sixth" :lazy="true">
				<depositDetail />
			</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import userDetail from './components/userDetail'
import vipOrder from './components/vipOrder'
import consumeRecord from './components/consumeRecord'
import browseRecord from './components/browseRecord'
import goodsComment from './components/goodsComment'
import depositDetail from './components/depositDetail'

export default {
    components: {
        userDetail,
        vipOrder,
        consumeRecord,
        browseRecord,
        goodsComment,
        depositDetail
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<!--
    表格内容过长显示tooltip时的最大宽度设置 不能使用scoped
-->
<style >
.el-tooltip__popper {
    max-width: 60vw;
}
</style>

<style lang="scss" scoped>
.el-tab-pane {
    margin-bottom: 20px;
}
</style>