<template>
    <!-- /*
     * @Descripttion:(其它组件：富文本)：richText
    */ -->
    <div
        :class="[!floors.fullScreen ? 'p-10' : '']"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor
        }"
    >
        <div v-html="floors.data.richTextData"></div>
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

<style lang="scss" scoped>
	::v-deep img{       //这里video加不上属性。。。
		max-width: 100%;
	}
</style>
