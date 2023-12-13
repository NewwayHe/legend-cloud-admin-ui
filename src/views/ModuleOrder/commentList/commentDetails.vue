<template>
    <section>
        <el-card shadow>
            <!-- 表格 -->
            <detailsTable :table-list="formData" />
        </el-card>
        <el-card>
            <el-form ref="form" :model="formData" label-width="132px" size="small" class="formWarp">
                <div class="form-title">用户初评</div>
                <el-form-item label="评分：">
                    <span>综合评分：{{ formData.averageScore }}</span>
                    <br />
                    <span>
                        商品评分：
                        <el-rate disabled :value="formData.score" style="display: inherit" />
                    </span>
                    <br />
                    <span>
                        店铺服务：
                        <el-rate disabled :value="formData.shopScore" style="display: inherit" />
                    </span>
                    <br />
                    <span>
                        物流服务：
                        <el-rate disabled :value="formData.logisticsScore" style="display: inherit" />
                    </span>
                </el-form-item>
                <el-form-item label="评论内容：">
                    <p class="text-wrap">{{ formData.content }}</p>
                </el-form-item>
                <el-form-item label="评论图片：">
                    <ls-image v-for="(item, index) in formData.photos" :key="index" class="mr-20" :src="item" :options="{ w: '100', h: '100' }" />
                </el-form-item>
                <el-form-item label="评论时间：">
                    <p>{{ formData.addTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复状态：">
                    <p v-if="formData.status == 1 && formData.replyFlag">已回复</p>
                    <p v-if="!formData.status == 1">-</p>
                    <p v-if="formData.status == 1 && !formData.replyFlag" class="status-wait">待回复</p>
                </el-form-item>
                <el-form-item label="商家回复内容：">
                    <p class="text-wrap">{{ formData.shopReplyContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复时间：">
                    <p>{{ formData.shopReplyTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="平台评论状态：">
                    <span v-if="formData.status == 0" class="status-wait">待审核</span>
                    <span v-if="formData.status == 1" class="status-pass">通过</span>
                    <span v-if="formData.status == -1" class="status-veto">拒绝</span>
                </el-form-item>
                <el-form-item label="平台审核时间：">
                    <p>{{ formData.auditTime || '-' }}</p>
                </el-form-item>

                <div class="form-title mt-60">用户追评</div>
                <el-form-item label="评论内容：">
                    <p class="text-wrap">{{ formData.addContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="评论图片：">
                    <div v-if="formData.addPhotos && formData.addPhotos.length > 0">
                        <ls-image
                            v-for="(item, index) in formData.addPhotos"
                            :key="index"
                            class="mr-20"
                            :src="item"
                            :options="{ w: '100', h: '100' }"
                        />
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="评论时间：">
                    <p>{{ formData.addAddTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复状态：">
                    <p v-if="formData.addStatus == 1 && formData.addReplyFlag">已回复</p>
                    <p v-if="!formData.addStatus == 1 || !formData.status == 1">-</p>
                    <p v-if="formData.addStatus == 1 && !formData.addReplyFlag" class="status-wait">待回复</p>
                </el-form-item>
                <el-form-item label="商家回复内容：">
                    <p class="text-wrap">{{ formData.addShopReplyContent || '-' }}</p>
                </el-form-item>
                <el-form-item label="商家回复时间：">
                    <p>{{ formData.addShopReplyTime || '-' }}</p>
                </el-form-item>
                <el-form-item label="平台评论状态：">
                    <div v-if="formData.addCommFlag">
                        <span v-if="formData.addStatus == 0" class="status-wait">待审核</span>
                        <span v-if="formData.addStatus == 1" class="status-pass">通过</span>
                        <span v-if="formData.addStatus == -1" class="status-veto">拒绝</span>
                    </div>
                    <div v-else>-</div>
                </el-form-item>
                <el-form-item label="平台审核时间：" class="btn_lastItem">
                    <p>{{ formData.addAuditTime || '-' }}</p>
                </el-form-item>
                <LsSticky :data="formData">
                    <el-row type="flex" justify="center" class="w-100 overflow-h py-10 mt-10 bg-white">
                        <!-- 用户信息的商品评论也会跳转至此 因此要用back -->
                        <el-button size="small" @click="$router.back()">返回</el-button>
                        <el-button v-if="formData.status == 0" size="small" type="primary" @click="showDialog(formData.status, 1)">
                            审核初评
                        </el-button>
                        <el-button v-if="formData.addStatus == 0" size="small" type="primary" @click="showDialog(formData.addStatus, 2)">
                            审核追评
                        </el-button>
                    </el-row>
                </LsSticky>
            </el-form>
        </el-card>
        <dialogComment
            ref="dialogComment"
            :comment-id="commentId"
            :comment-add-id="commentAddId"
            :comment-status="commentStatus"
            :comment-type="commentType"
            @getData="getData"
        />
    </section>
</template>
<script>
import detailsTable from './components/detailsTable'
import { commentList } from '@/api/ModuleOrder.js'
import dialogComment from './components/dialogComment'
export default {
    components: {
        detailsTable,
        dialogComment
    },
    data() {
        return {
            formData: {},
            commentStatus: '', // 要传的状态
            commentId: '', // 要传的初评id
            commentAddId: '', // 要传的追评id
            commentType: '' // 类型
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            commentList
                .getCommentDetail({
                    id: this.$route.query.id
                })
                .then((res) => {
                    if (res.code == 1) {
                        this.formData = res.data
                        // JSON.parse 传入的参数如果为空字符串则会报错
                        this.formData.photos = res.data.photos != '' ? JSON.parse(res.data.photos) : []
                        this.formData.addPhotos = res.data.addPhotos != '' ? JSON.parse(res.data.addPhotos) : []
                    }
                })
        },
        // 审核评论
        showDialog(status, type) {
            // type  0=初评，1=追评
            this.commentType = type
            this.commentStatus = status
            this.commentId = this.$route.query.id
            this.commentAddId = this.$route.query.addId
            this.commentStatus = status
            this.$refs.dialogComment.showDialog()
        }
    }
}
</script>
<style lang="scss" scoped></style>
