<template>
    <el-dialog title="查看" :visible.sync="dialogVisible" custom-class="dialog-form dialog-form-small">
        <div>
            <el-form :inline="false" label-position="right" label-width="120px" size="small">
                <el-form-item label="产品名称：">
                    <span class="font">{{ itemDetail.productName }}</span>
                </el-form-item>
                <el-form-item label="举报类型：">
                    <span class="font">{{ itemDetail.typeName }}</span>
                </el-form-item>
                <el-form-item label="举报人ID：">
                    <span class="font">{{ itemDetail.userId }}</span>
                </el-form-item>
                <el-form-item label="举报人用户名：">
                    <span class="font">{{ itemDetail.nickName }}</span>
                </el-form-item>
                <el-form-item label="创建日期：">
                    <span class="font">{{ itemDetail.createTime }}</span>
                </el-form-item>
                <el-form-item label="照片凭证：">
                    <div v-if="itemDetail.picList && itemDetail.picList.length" class="flex-start flex-wrap">
                        <ls-image
                            v-for="pic in itemDetail.picList"
                            :key="pic"
                            :src="pic"
                            :options="{ w: '100', h: '100', br: '6' }"
                            className="mr-5 mb-5"
                            style="vertical-align: middle"
                        />
                    </div>
                    <span v-else>-</span>
                </el-form-item>
                <el-form-item label="举报内容：">
                    <span class="font">{{ itemDetail.content }}</span>
                </el-form-item>
                <el-form-item label="处理状态：">
                    <span v-if="Number(itemDetail.status)" class="font status-pass">已处理</span>
                    <span v-else class="font status-done">未处理</span>
                </el-form-item>
                <template v-if="itemDetail.status != 0">
                    <el-form-item label="处理结果：">
                        <span v-if="itemDetail.result == -1">无效举报</span>
                        <span v-else-if="itemDetail.result == 1">有效举报</span>
                        <span v-else-if="itemDetail.result == -2">恶意举报</span>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="处理操作：">
                        <span v-if="itemDetail.illegalOff == 0">不处理</span>
                        <span v-else-if="itemDetail.illegalOff == 1" class="font">商品下架</span>
                        <span v-else-if="itemDetail.illegalOff == 2" class="font">违规锁定</span>
                        <span v-else>-</span>
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <span slot="footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { request } from '@/utils/request'

export default {
    components: { },
    props: {
        itemId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            dialogVisible: false,
            itemDetail: {}
        }
    },
    methods: {
        // 初始化方法
        dialogInit() {
            request
                .get(`/product/admin/accusation/${this.itemId}`)
                .then((res) => {
                    this.itemDetail = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 显示dialog
        dialogShow() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.dialogInit()
            })
        }
    }
}
</script>