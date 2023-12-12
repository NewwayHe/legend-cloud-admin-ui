<template>
    <el-form
        ref="videoForm"
        :model="modelVideo"
        size="small"
        label-width="80px"
    >
        <el-form-item label="本地视频" :rules="rules.video" prop="video">
            <!-- <upload-video v-model="modelVideo.video"></upload-video> -->
            <upload key="modelVideoUpload" v-model="modelVideo.video" :floder-id="floderId" :poster-conf="posterConf" :limit="1" upload-type="video" @success="handleSuccess" @delCb="handleDel"/>
            <div style="color: #999; font-size: 12px; line-height: 22px;">
               <!-- 视频大小不超过 30 MB，建议时长五分钟以内， 建议宽高比16:9， 支持的视频文件类型包括：wmv、asf、asx、rm、rmvb MPEG、mp4、3gp、mov、m4v、avi、dat、mkv、flv、vob -->
               视频大小不超过 30 MB，建议时长五分钟以内， 建议宽高比16:9， 现支持的视频文件类型包括：MP4
            </div>
        </el-form-item>
        <el-form-item label="视频封面" prop="videoPic">
            <upload key="modelVideoPic" v-model="modelVideo.videoPic" :floder-id="floderId" :poster-conf="posterConf" :limit="1" @success="handleSuccess" @delCb="handleDel"/>
            <div style="color: #999; font-size: 12px; line-height: 22px">
               支持.jpg, .gif, .png格式，大小不超过3 MB。如果不添加封面，系统会默认截取视频的第一个画面作为封面。
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
import upload from './Upload'
import { materialCenter } from '@/api/ModuleSystem'

export default {
    components: {
        upload,
    },
    props: {
        floderId: {
            type: [Number, String],
            required: true
        },
        attachmentTree: {
            type: Array
        },
        treeValue: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            //树分组
            modelVideo: {
                videoName: '',
                videoPic: [],
                // group: '',
                video: [],
                TreeValue: 0        //这个并没有用上！
            },

            rules: {
                video: [{ required: true, message: `请上传视频`, trigger: 'blur' }],
                // TreeValue: [{ required: true, trigger: 'blur', message: '请选择分组' }],
                videoName: [{ required: true, message: `请输入视频标题`, trigger: 'blur' }],
                // videoPic: [{ required: true, message: `请上传视频封面`, trigger: 'blur' }]
            },

            picAttachmentId: 0, //视频-封面图绑定Id
            clearAttachment: {  //当视频-封面图[都]被删除后 清空attachmentId
                picNull: true,
                videoNull: true
            },
        }
    },
    computed: {
        // upload组件绑定的 视频-封面图参数
        posterConf() {
            return {
                useAttachment: true,   //标识 接口使用绑定关系
                attachmentId: this.picAttachmentId,    //绑定ID 外部传入
            }
        }
    },
    watch: {
        TreeValue(val) {
            console.log('视频', val)
            this.modelVideo.TreeValue = val
        }
    },
    created() {},
    mounted() {
        this.modelVideo.TreeValue = this.TreeValue
    },
    methods: {
        check() {   ////这个暂时用不上了
            this.$refs['videoForm'].validate((valid) => {
                if (valid) {
                    this.updatedAttachment({
                        files: this.modelVideo.video,
                        // treeId: this.modelVideo.TreeValue,
                        // uploadType: 3,
                        // videoCoverUrl: this.modelVideo.videoPic,
                        // videoTitle: this.modelVideo.videoName
                    })
                } else {
                    return false
                }
            })
        },

        updatedAttachment(params) {
            let filePath = params.files
            console.log(filePath, params, '----------------')
            materialCenter
                .confirmUpload({ filePath: filePath })
                .then((res) => {
                    if (!res.code) {
                        this.$message.error(res.message)
                        return
                    }
                    this.resetFields()
                    this.$emit('uploadSussess') //上传成功
                })
                .catch((res) => {
                    this.$message.error(res.message)
                })
        },

        resetFields() {
            this.$refs.videoForm.resetFields()
        },
        // resetFields会失效 使用这个resetData
        resetData() {
            this.modelVideo = {
                videoName: '',
                videoPic: [],
                // group: '',
                video: [],
                TreeValue: 0
            }
            this.picAttachmentId = 0; //视频-封面图绑定Id
            this.clearAttachment = {  //当视频-封面图[都]被删除后 清空attachmentId
                picNull: true,
                videoNull: true
            }
        },

        // 上传成功后 需要拿到attachmentId绑定 视频与封面图的关系
        handleSuccess(res) {
            this.picAttachmentId = res?.data?.attachmentId || 0
            if(res.typeNull) {
                this.clearAttachment[res.typeNull] = false;
            }
        },

        // 删除视频/封面图时 即两个都为空时 要清空当前保存的picAttachmentId
        handleDel(typeNull) {
            this.clearAttachment[typeNull] = true;
            let otherNull = typeNull == 'picNull' ? 'videoNull': 'picNull';
            if(this.clearAttachment[otherNull]) {       //清空
                this.picAttachmentId = 0;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.lsUpload {
    span {
        font-size: 12px !important;
        display: flex;
    }
}
</style>
