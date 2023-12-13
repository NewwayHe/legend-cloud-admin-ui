<template>
    <div>
        <el-dialog :visible.sync="isVisible" width="418px" custom-class="dialog-form">
            <div slot="title" class="font-weight font-18">查看</div>
            <div class="text-999 px-5">
                <!-- 商品信息： -->
                <div class="mb-30">
                    <div class="text-333 font-14">商品信息</div>
                    <div class="mt-15 d-flex">
                        <ls-image style="flex: 0 0 50px" :src="data.pic" :options="{ w: '50', h: '50', br: '6' }" />
                        <el-popover placement="top-start" width="500" trigger="hover" :content="data.productName">
                            <div slot="reference" class="ml-10 line-clamp2 v-top">{{ data.productName }}</div>
                        </el-popover>
                    </div>
                </div>
                <!-- 咨询信息： -->
                <div class="mb-30">
                    <div class="text-333 font-14">咨询信息</div>
                    <div class="mt-15 d-flex">
                        <span class="text-nowrap">咨询内容：</span>
                        <div>{{ data.content || '-' }}</div>
                    </div>
                    <div class="mt-15">
                        咨询用户：
                        <span>{{ data.askUserName || '-' }}</span>
                        <span class="ml-5">{{ data.askUserIphone || '-' }}</span>
                    </div>
                    <div class="mt-15">咨询时间：{{ data.recDate || '-' }}</div>
                </div>
                <!-- 回复信息： -->
                <div class="mb-30">
                    <div class="text-333 font-14">回复信息</div>
                    <div class="mt-15">回复状态：{{ data.replySts == 1 ? '已回复' : '未回复' }}</div>
                    <div class="mt-15 d-flex">
                        <span class="text-nowrap">回复内容：</span>
                        <div>{{ data.replySts == 1 ? data.answer : '-' }}</div>
                    </div>
                    <div class="mt-15">回复时间：{{ data.replySts == 1 ? data.answerTime : '-' }}</div>
                    <div class="mt-15">回复账号：{{ data.replySts == 1 ? data.replyName : '-' }}</div>
                </div>
                <!-- 其他信息： -->
                <div>
                    <div class="text-333 font-14">其他信息</div>
                    <div class="mt-15">状态：{{ data.delSts == 1 ? '上线' : '下线' }}</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer"><el-button size="small" @click.stop="isVisible = false">取消</el-button></div>
        </el-dialog>
    </div>
</template>

<script>
import { commentList } from '@/api/ModuleOrder.js'
export default {
    props: {
        // 数据
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isVisible: false
        }
    },
    watch: {},
    methods: {
        showDialog() {
            this.isVisible = true
        }
    }
}
</script>

<style></style>
