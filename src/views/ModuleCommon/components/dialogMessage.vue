<template>
    <el-dialog title="通知" width="420px" style="border-radius: 6px" :visible.sync="isVisible" @close="msgClose">
        <el-row style="padding: 20px 46px">
            <el-col class="position-relative">
                <i class="el-icon-warning"></i>
                <div class="font-12 text-333">{{ list.title }}</div>
            </el-col>
            <el-col>
                <div class="font-12 text-999 mt-15">{{ list.recDate }}</div>
            </el-col>
            <el-col>
                <div class="font-12 text-666 mt-20 line-clamp2">{{ list.content }}</div>
            </el-col>
            <el-col class="mt-10">
                <!-- 1:商品[审核] 2：订单 3:售后 0：其他 -->
                <el-link v-if="list.type == 1" style="color: #006dc7" :underline="false" class="font-12" @click="goPage(list.detailId, list.type)">
                    去查看&nbsp;&gt;&gt;
                </el-link>
            </el-col>
        </el-row>
        <span slot="footer">
            <el-button size="small" @click="isVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { basic } from '@/api/ModuleSystem'
export default {
    name: 'DialogMessage',
    props: {
        msgId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            list: {}
        }
    },
    methods: {
        // 弹框开关
        showDialog() {
            this.isVisible = true
            this.$nextTick(() => {
                this.getData()
            })
        },
        // 关闭弹框时的回调
        msgClose() {
            this.$emit('closeMsg')
        },
        // 跳转页面
        goPage(id, MsgType) {
            //1:商品 2：订单 3:售后 0：其他
            if (MsgType == 1) {
                this.isVisible = false
                this.$router.push({ name: 'aduitList' })
            }
        },
        // 获取数据
        getData() {
            basic.getUnreadDetail({ msgId: this.msgId }).then((res) => {
                if (res.code == 1) {
                    this.list = res.data
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
    border-radius: 6px;
    .el-dialog__body {
        padding: 0;
    }
}
.el-icon-warning {
    position: absolute;
    color: orange;
    top: -5px;
    left: -25px;
    font-size: 20px;
}
</style>
