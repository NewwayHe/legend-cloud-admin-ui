<template>
    <!-- /*
     * @Descripttion:(楼层组件：菜单)：menuTab
    */ -->
    <div
        class="h-44p flex-start"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            color: floors.fontThemeColor ? parmas.themeColor : floors.color
        }"
    >
        <div class="h-100 font-14 text-nowrap overflow-h flex-1" :class="[`flex-${floors.position || 'start'}`]">
            <div
                v-for="(item, index) in floors.data.titleList"
                :key="index"
                class="px-10 flex-center"
                :style="{
                    color: item.themeColor ? parmas.themeColor : item.color,
                    borderRight: `${
                        floors.assistLine && index != floors.data.titleList.length - 1 && floors.position != 'around' && floors.position != 'between'
                            ? '1px'
                            : '0px'
                    } solid ${floors.bdThemeColor ? parmas.themeColor : floors.borderColor}`,
                    height: `${floors.assistLine && index != floors.data.titleList.length - 1 ? '15px' : ''}`
                }"
            >
                <img v-if="floors && item.img" class="mr-3" style="width: 20px; height: 20px" :src="$photoServer + item.img" alt="" />
                <span>{{ item.title }}</span>
            </div>
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
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
