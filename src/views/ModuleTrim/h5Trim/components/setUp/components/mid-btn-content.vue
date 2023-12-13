<template>
    <div v-if="list && list.length" class="flex-center p-5">
        <div
            v-for="(item, index) in list"
            :key="index"
            class="flex-center shadow overflow-h"
            :class="Number(type) == 1 ? 'w-40p h-40p rounded-circle' : 'rounded-5 m-5 w-35p h-35p'"
            :style="[itemStyle(index)]"
            :prodSource="item.prodSource"
        >
            <ls-image :src="item.img" :options="{ w: Number(type) == 1 ? 40 : 35, h: Number(type) == 1 ? 40 : 35, br: 5 }"></ls-image>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    mixins: [],
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 自定义样式，对象形式
        cssStyle: {
            type: Object,
            default() {
                return {}
            }
        },
        // content 弹框的border线颜色
        type: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            pic: ''
        }
    },
    computed: {},
    created() {},
    onLoad() {},

    mounted() {},

    methods: {
        itemStyle(index) {
            let style = ''
            if (Number(this.type) == 1 && this.list) {
                if (this.list.length == 2) {
                    if (index == 0) {
                        style = { transform: `rotate(-30deg) translate(-15px, 0px)` }
                    }
                    if (index == 1) {
                        style = { transform: `rotate(30deg) translate(15px, 0px)` }
                    }
                }
                if (this.list.length == 3) {
                    if (index == 0) {
                        style = { transform: `rotate(-45deg) translate(-20px, 10px)` }
                    }
                    if (index == 2) {
                        style = { transform: `rotate(45deg) translate(20px, 10px)` }
                    }
                }
                if (this.list.length == 4) {
                    if (index == 0) {
                        style = { transform: `rotate(-60deg) translate(-30px, 15px)` }
                    }
                    if (index == 1) {
                        style = { transform: `rotate(-20deg) translate(-5px, 0px)` }
                    }
                    if (index == 2) {
                        style = { transform: `rotate(20deg) translate(5px, 0px)` }
                    }
                    if (index == 3) {
                        style = { transform: `rotate(60deg) translate(30px, 15px)` }
                    }
                }
                if (this.list.length == 5) {
                    if (index == 0) {
                        style = { transform: `rotate(-70deg) translate(-42px, 15px)` }
                    }
                    if (index == 1) {
                        style = { transform: `rotate(-30deg) translate(-10px, 0px)` }
                    }
                    if (index == 2) {
                        style = { transform: `rotate(0deg) translate(0px, -10px)` }
                    }
                    if (index == 3) {
                        style = { transform: `rotate(30deg) translate(10px, 0px)` }
                    }
                    if (index == 4) {
                        style = { transform: `rotate(70deg) translate(42px, 15px)` }
                    }
                }
            }
            style = this.$utils.object.deepMerge(style, this.cssStyle)
            return style
        }
    }
}
</script>

<style lang="stylus" scoped></style>
