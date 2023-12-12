<template>
    <!-- /*
     * @Descripttion:通用组件：遮罩层，注意：父组件要加上hover-floors这个class
    */ -->
    <div class="position-relative hover-floors w-100">
        <div class="h-100 mask-layer w-100">
            <div class="w-100 h-100 position-relative flex-center" @click="dealFloors('edit')">
                <div class="position-absolute rounded-3 px-5" style="background-color: #b2b2b2; top: 3px; right: 3px">
                    <i v-show="!isWideScreen" class="font-18 text-white main-hover px-5 py-10 el-icon-plus" @click.stop="dealFloors('add')"></i>
                    <i
                        v-if="!(floors.type == 'coupon')"
                        class="font-18 text-white main-hover px-5 py-10 el-icon-document-copy"
                        @click.stop="dealFloors('copy')"
                    ></i>
                    <i class="font-18 text-white main-hover px-5 py-10 el-icon-delete" @click.stop="dealFloors('delete')"></i>
                    <i class="font-18 text-white main-hover px-5 py-10 el-icon-bottom" @click.stop="dealFloors('down')"></i>
                    <i class="font-18 text-white main-hover px-5 py-10 el-icon-top" @click.stop="dealFloors('up')"></i>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    components: {},
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isWideScreen: {
            //如果是宽屏，不显示+号，因为isWideScreen为true时【添加组件】组件已经显示在页面左侧了
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        // 处理楼层
        dealFloors(type) {
            this.$emit('dealFloors', type)
        }
    }
}
</script>

<style lang="scss" scoped>
.hover-floors {
    position: relative;
    .mask-layer {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
    }
    &:hover {
        .mask-layer {
            cursor: move;
            display: inherit;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 4;
        }
    }
}
</style>
