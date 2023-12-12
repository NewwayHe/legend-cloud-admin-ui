<template>
    <div class="d-inline-block">
        <div class="lsUpload">
            <template v-if="multiple">
                <vuedraggable
                    v-model="tempUrl"
                    style="fontsize: 0"
                    class="draggable"
                    :options="{ animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
                >
                    <transition-group>
                        <div v-for="(item, index) in tempUrl" :key="index + 1" class="lsUpload__imgWarp flex-center" :style="uploadStyle">
                            <ls-image
                                :os-options="{ w: '100', h: '100' }"
                                mode="contain"
                                :src="item"
                                style="border-radius: 6px; width: 100%; height: 100%"
                            />
                            <i class="lsUpload__imgClose el-icon-error" @click="delImg(index)" />
                        </div>
                    </transition-group>
                </vuedraggable>
            </template>
            <el-upload
                v-if="multiple ? tempUrl.length < limit : true"
                :headers="headers"
                name="file"
                :multiple="multiple"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="$config.server + '/basic/file/upload'"
                :data="{ fileSource: 'S', scope: isPrivate ? 'private' : 'public', fileType: 0 }"
                accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP"
                :on-error="handleAvatarError"
                :file-list="fileList"
                class="position-relative hover-border ml-5"
                :disabled="disabled"
            >
                <!-- :limit="limit" -->
                <div :class="{ lsUpload__box: !isHiddenImg && (!button || (!multiple && tempUrl)) }" :style="uploadStyle">
                    <!-- <el-image  :src="$photoServer + tempUrl"  /> -->
                    <ls-image
                        v-if="!isHiddenImg && !multiple && tempUrl"
                        :isPreview="false"
                        :os-options="{ w: '100', h: '100' }"
                        mode="contain"
                        :src="tempUrl"
                        class="lsUpload__img"
                        style="border-radius: 6px; width: 100%; height: 100%"
                    />
                    <el-button v-else-if="isHiddenImg && tempUrl" type="primary" size="small">
                        <div class="font-14">
                            已选择
                            <i class="el-icon-upload el-icon--right" />
                        </div>
                    </el-button>
                    <template v-else>
                        <el-button v-if="button" type="primary" size="small">
                            <div class="font-14">
                                上传
                                <i class="el-icon-upload el-icon--right" />
                            </div>
                        </el-button>
                        <i v-else class="el-icon-plus uploader-icon" />
                    </template>
                </div>
                <i
                    v-if="deleteAble && tempUrl"
                    class="d-none el-icon-error font-24 position-absolute cursor-pointer bg-white rounded-circle"
                    style="top: -12px; right: -12px"
                    @click.stop="del"
                />
            </el-upload>
        </div>
    </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import { getToken } from '@/utils/auth'
export default {
    components: {
        vuedraggable
    },
    props: {
        value: {
            type: [String, Array]
        },
        button: {
            // 是否按钮显示
            type: Boolean,
            default: false
        },
        // multiple: {//false:单图，true：多图
        //     type: Boolean,
        //     default: false
        // },
        isHiddenImg: {
            // 是否显示图片
            type: Boolean,
            default: false
        },
        deleteAble: {
            // 是否支持删除(当该值为true时，鼠标；移动到图片上时，会出现删除按钮)
            type: Boolean,
            default: false
        },
        limit: {
            // 限制多少张
            type: Number,
            default: 5
        },
        sortable: {
            //
            type: Boolean,
            default: false
        },
        onSuccess: {
            type: Function,
            default: function () {}
        },
        onError: {
            type: Function,
            default: function () {}
        },
        uploadStyle: {
            type: [String, Object],
            default: ''
        },
        isWatchTempUrl: {
            //
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        //是否私有文件
        isPrivate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // tempUrl: this.multiple ? [] : '',
            loadingFlag: null,
            // tempUrl: typeof this.value === 'object' ? [] : '',
            // multiple: typeof this.value === 'object', // false:单图，true：多图

            tempUrl: Array.isArray(this.value) ? [] : '',
            multiple: Array.isArray(this.value), // false:单图，true：多图
            sortList: Object,
            headers: { Authorization: 'Bearer ' + getToken() },
            fileList: []
        }
    },
    computed: {
        imageUrl() {
            return this.value
        }
    },
    watch: {
        tempUrl(newVal) {
            if (this.isWatchTempUrl && this.multiple) {
                if (newVal && newVal.length > this.limit) {
                    newVal.length = this.limit
                }
            }
            this.$emit('input', newVal)
        },
        value: {
            immediate: true,
            handler(newVal) {
                this.tempUrl = newVal
            }
        }
    },
    mounted() {},
    methods: {
        handleAvatarSuccess(res, file, fileList) {
            if (res.code === 1) {
                if (this.multiple) {
                    this.tempUrl.push(res.data.url)
                } else {
                    this.tempUrl = res.data.url
                }
                this.fileList = fileList
                this.$message.success('上传成功')
                this.onSuccess(res, file, fileList)
                this.$emit('success', res, file, fileList)
            } else {
                this.$message.error(res.msg)
            }
            this.loadingFlag.close()
            // this.imageUrl = URL.createObjectURL(file.raw);
            // this.tempUrl=val
            // this.$emit('input', val)
        },
        beforeAvatarUpload(file) {
            // this.loadingFlag = this.$loading({ text: '正在上传' })
            this.loadingFlag = this.$loading({ text: '正在上传' })
            // const isLt5M = file.size / 1024 / 1024 < 5;
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                this.loadingFlag.close()
                this.$message.error('上传头像图片大小不能超过 5MB!')
            }
            return isLt5M
        },
        handleAvatarError(err, file, fileList) {
            this.loadingFlag.close()
            this.onError(err, file, fileList)
        },
        delImg(index) {
            this.$confirm('确认删除该数据吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.tempUrl.splice(index, 1)
                this.fileList.splice(index, 1)
            })
        },
        del() {
            this.$emit('input', '')
        }
    }
}
</script>

<style lang="scss" scoped>
//    body{
//        line-height: 1;
//    }
.box {
    width: 100px;
    position: relative;
    background-color: red;
    &::before {
        content: '';
        padding-top: 100%;
        box-sizing: border-box;
        display: block;
        width: 0;
    }
}
.pox {
    position: absolute;

    height: 100%;

    width: 100%;

    left: 0;

    top: 0;

    border: 1px solid red;

    box-sizing: border-box;
}
@import '~@/styles/mixin.scss';
//  @keyframes shake { /* 水平抖动，核心代码 */
//         10%, 90% { transform: translate3d(-1px, 0, 0); }
//         20%, 80% { transform: translate3d(+2px, 0, 0); }
//         30%, 70% { transform: translate3d(-4px, 0, 0); }
//         40%, 60% { transform: translate3d(+4px, 0, 0); }
//         50% { transform: translate3d(-4px, 0, 0); }
//  }
@keyframes shake {
    /* 水平抖动，核心代码 */
    10%,
    90% {
        transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
    }
    20%,
    80% {
        transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.4px), 0) rotate(-4deg);
    }
    30%,
    70% {
        transform: translate3d(calc(50%), calc(-50% - 0.6px), 0) rotate(0deg);
    }
    40%,
    60% {
        transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
    }
    50% {
        transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.1px), 0) rotate(-4deg);
    }
}

.lsUpload {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    line-height: 1 !important;
	span {
	    font-size: 0;
	    display: flex;
	}
    .draggable {
        span {
            display: flex;
            flex-wrap: wrap;
        }
    }
    &__imgWarp {
        display: flex;
        flex-wrap: wrap;
        width: 100px;
        height: 100px;
        margin: 0 5px;
        position: relative;
        .lsUpload__imgClose {
            display: block;
        }
    }
    &__imgClose {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        color: rgba($color: #000000, $alpha: 0.4);
        font-size: 22px;
        display: none;
    }
    //上传外框
    .lsUpload__box {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100px;
        // height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            border-color: #409eff;
        }
        &::before {
            content: '';
            padding-top: 100%;
            box-sizing: border-box;
            display: block;
            width: 0;
        }
    }
    //上传组件内图片
    .uploader-img {
        width: 100%;
        height: 100%;
        display: block;
    }
    //上传组件内 +
    .uploader-icon {
        color: #c0c4d6;
        font-size: 18px;
    }
	.d-none {
	    color: #999999;
	    &:hover {
	        color: #666666;
	    }
	}
}

</style>
