<!-- /*
 * @Descripttion:充值明细
*/ -->
<template>
    <section class="">
        <el-card>
            <!-- 切换面板烂 -->
            <div class="table">
                <el-tabs v-model="activeName" class="topTabs" @tab-click="handleClick">
                    <el-tab-pane lazy label="余额明细" name="first">
                        <balanceDetail />
                    </el-tab-pane>
                    <el-tab-pane lazy label="充值管理" name="second">
                        <rechargeManage />
                    </el-tab-pane>
                    <el-tab-pane lazy label="提现管理" name="third">
                        <withdrawsManage />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </section>
</template>
<script>
// 余额明细
import balanceDetail from './components/balanceDetail'
// 充值管理
import rechargeManage from './components/rechargeManage'
// 提现管理
import withdrawsManage from './components/withdrawsManage'
export default {
    components: {
        balanceDetail,
        rechargeManage,
        withdrawsManage
    },
    data() {
        return {
            // 标签页切换
            activeName: 'first',
            // 完成时删除
            dialogForm: {
                formRule: {
                    productNo: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    productName: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ],
                    createUserCode: [
                        {
                            required: true,
                            message: '请输入活动名称',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            // 完成时删除
            checkAll: true,
            // 完成时删除
            switchType: 'top',
        }
    },
    mounted() {
        console.log(this.dialogForm)
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>
