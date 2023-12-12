<template>
    <!-- /*
     * @Descripttion:(其它组件：辅助线)：assistLine
    */ -->
    <div
        class="overflow-h w-100"
        :class="[floors.position == 'middle' ? 'flex-center' : floors.position == 'left' ? 'flex-start' : 'flex-end']"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            color: floors.fontThemeColor ? parmas.themeColor : floors.color,
            height: `${floors.height}px`
        }"
    >
        <span
            v-if="floors.assistType != 'none'"
            class="h-0"
            :style="{
                width: `${floors.width}%`,
                borderTop: `${(floors.assistType == 'dotted' ? 2 : 1) * floors.size}px ${floors.fontThemeColor ? parmas.themeColor : floors.color} ${
                    floors.assistType
                }`
            }"
        ></span>
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
    methods: {}
}
</script>

<style lang="scss" scoped></style>
