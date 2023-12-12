<template>
    <!-- /*
     * @Descripttion:(功能组件：悬浮按钮)：assistLine
    */ -->
    <div
        v-if="floors.show"
        class="position-absolute zindex-109 shadow-sm flex-center"
        :style="{
            width: '60px',
            height: '60px',
            left: `${floors.position == 'left' ? '21px' : ''}`,
            right: `${floors.position == 'right' ? '26px' : ''}`,
            bottom: `${103 + 50 + floors.offsetBottom}px`,
            borderRadius: `${floors.position == 'left' ? '0px 30px 30px 0px' : '30px 0px 0px 30px'}`,
            background: floors.themeColor ? parmas.themeColor : floors.backgroundColor
        }"
        @click.stop="changeFloors('setUp')"
    >
        <!-- <img class="rounded-circle" style="width: 40px; height: 40px" :src="$photoServer + floors.img" alt="" /> -->
        <img v-if="floors.img" class="rounded-circle" style="width: 40px; height: 40px" :src="floors.img ? $photoServer + floors.img : ''" alt="" />
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
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        changeFloors(flag) {
            this.$emit('changeFloors', flag)
        }
    }
}
</script>

<style lang="scss" scoped></style>
