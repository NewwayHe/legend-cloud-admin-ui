<template>
    <!-- /*
     * @Descripttion:(其它组件：标题)：titleTab
    */ -->

    <div
        class="h-44p font-14 p-10"
        :class="[floors.titleType == 1 ? 'flex-start' : 'flex-center']"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            borderRadius: borderRadius || 0,
            margin: `0 ${floors.paddingX ? floors.paddingX + 'px' : '0'}`
        }"
    >
        <div v-if="floors.titleType == 3" class="flex-1 px-10">
            <div class="h-0 w-100" :style="{ borderTop: `1px solid ${floors.data.title.borderColor}` }"></div>
        </div>
        <span
            v-if="floors.showIcon == 'block'"
            class="d-inline-block mr-5"
            style="width: 4px"
            :style="{
                backgroundColor: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color,
                height: `${floors.data.title.fontSize + 2}px`
            }"
        ></span>
        <img
            v-if="floors && floors.iconImg && floors.showIcon == 'diy'"
            class="mr-3"
            style="width: 20px; height: 20px"
            :src="$photoServer + floors.iconImg"
            alt=""
        />
        <div
            class="letter-sp2"
            :style="{
                fontSize: `${floors.data.title.fontSize}px`,
                fontWeight: floors.data.title.fontWeight ? 'bold' : 'unset',
                color: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color
            }"
        >
            <span>{{ floors.data.title.title }}</span>
        </div>
        <div v-if="floors.titleType == 3" class="flex-1 px-10">
            <div class="h-0 w-100" :style="{ borderTop: `1px solid ${floors.data.title.borderColor}` }"></div>
        </div>
        <div
            v-if="floors.titleType == 1"
            class="flex-1 px-10 line-clamp1"
            :style="{
                fontSize: `${floors.data.seTitle.fontSize}px`,
                fontWeight: floors.data.seTitle.fontWeight ? 'bold' : 'unset',
                color: floors.data.seTitle.themeColor ? parmas.themeColor : floors.data.seTitle.color
            }"
        >
            <span>{{ floors.data.seTitle.title }}</span>
        </div>
        <div
            v-if="floors.titleType == 1"
            :style="{
                fontSize: `${floors.data.more.fontSize}px`,
                fontWeight: floors.data.more.fontWeight ? 'bold' : 'unset',
                color: floors.data.more.themeColor ? parmas.themeColor : floors.data.more.color
            }"
        >
            <span>{{ floors.data.more.title }}</span>
            <i v-if="floors.data.more.title" class="el-icon-arrow-right" />
        </div>
        <!-- 微信的胶囊 -->
        <div v-if="parmas.head.type == 'none' && isFirstFloor && platform == 'MP'" style="height: 44 px; width: 100px"></div>
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
        },
        platform: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        isFirstFloor() {
            //如果菜单组件是第一层，在小程序时加入胶囊点占符
            return this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid ? true : false
        },
        borderRadius() {
            let br = this.floors.borderRadius || 0
            switch (this.floors.radius) {
                case 'top':
                    return `${br}px ${br}px 0 0`
                case 'bottom':
                    return `0 0 ${br}px ${br}px`
                case 'topAndBottom':
                    return `${br}px`
                default:
                    return '0'
            }
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
