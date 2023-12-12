<template>
    <div>
        <el-dialog :visible.sync="isVisible" :before-close="handleClose" title="视频预览" custom-class="rounded-3 " width="550px" append-to-body>
            <div id="newPlayer" ref="newPlayer" class="m-auto"></div>
        </el-dialog>
    </div>
</template>

<script>
// import Player from 'xgplayer'
export default {
    props: {
        videoUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isVisible: false
        }
    },
    watch: {
        isVisible(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.playerInit(this.videoUrl)
                })
            }

            // newVal && (this.playerInit(this.videoUrl),this.$emit('input', this.videoUrl))
        }
    },
    methods: {
        showDialog() {
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
            // this.playerOptions.sources[0].src=this.photoUrl + this.classInfo.videoId
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
