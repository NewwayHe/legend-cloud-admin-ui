<template>
    <div>
        <el-dialog :visible.sync="isVisible" :before-close="handleClose" title="视频预览" custom-class="rounded-3 " width="600px">
            <div class="flex-center w-100">
                <video height="300" width="500" :src="videoUrll" controls autoplay loop></video>
            </div>
            <el-row class="mt-20">
                <el-col :span="3" style="display: block; height: 40px; line-height: 40px">素材链接：</el-col>
                <el-col :span="21">
                    <el-input id="copy" v-model="copySrc" placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" @click="copyhandle">复制</el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        videoUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            copySrc: '',
            isVisible: false,
            videoUrll: ''
        }
    },
    watch: {
        isVisible(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.videoUrll = this.$photoServer + this.videoUrl
                })
            }
        }
    },
    methods: {
        copyhandle() {
            const copyMeta = document.getElementById('copy')
            copyMeta.select()
            document.execCommand('copy')
            this.$message.success('复制成功')
        },
        showDialog(url) {
            this.copySrc = url
            this.isVisible = true
        },
        handleClose() {
            this.isVisible = false
        },

        // 播放器初始化
        playerInit(url) {
            if (this.player) {
                this.player.destroy()
            }
            this.player = null
            this.player = new Player({
                id: 'newPlayer',
                url: this.$photoServer + url,
                width: 500,
                height: 300,
                autoplay: true,
                playsinline: false,
                fullscreen: false
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
