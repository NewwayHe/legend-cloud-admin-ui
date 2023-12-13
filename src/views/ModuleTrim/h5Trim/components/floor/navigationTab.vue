<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：TAB导航)：navigationTab
    */ -->
    <div class="w-100" :style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor }">
        <div v-if="floors.tabsShow" class="flex-start overflow-auto scrollbar-none" style="height: 40px">
            <div
                class="h-100 font-14 text-nowrap flex-1 flex-around"
                :style="{
                    color: floors.tabNoCurColor,
                    backgroundColor: floors.tabBgThemeColor ? parmas.themeColor : floors.tabBgColor,
                    '--curTabColor': curTabColor
                }"
            >
                <!-- :style="{
				    borderRight: `${
				        floors.data.tabList && floors.data.tabList.length != 1 && index != floors.data.tabList.length - 1 && floors.assistLine
				            ? 1
				            : 0
				    }px solid ${floors.assistLineColor}`
				}" -->
                <div v-for="(item, index) in floors.data.tabList" :key="index" :ref="'tabListItem' + index" class="px-10 flex-center flex-1">
                    <span
                        :class="[{ 'tab-pills': item.isSelect && floors.tabsType == 'pills' }]"
                        :style="{
                            color: item.isSelect ? curTabColor : '',
                            borderBottom: `${item.isSelect && floors.tabsType == 'line' ? 2 : 0}px solid ${item.isSelect ? curTabColor : ''}`
                        }"
                    >
                        {{ item.title }}
                    </span>
                </div>
            </div>
        </div>
        <div
            v-if="floors.data.tabList[currentIndex] && floors.data.tabList[currentIndex]"
            class="w-100 py-10"
            :style="{ color: floors.fontThemeColor ? parmas.themeColor : floors.color }"
        >
            <el-row type="flex" style="flex-wrap: wrap">
                <el-col
                    v-for="(item, index) in floors.data.tabList[currentIndex].imgList"
                    :key="index"
                    class="flex-col-center overflow-h pb-10 transition-all05"
                    :style="{ width: floors.col == 3 ? '33.3%' : floors.col == 4 ? '25%' : floors.col == 5 ? '20%' : '25%' }"
                >
                    <img v-if="item.img" style="width: 45px; height: 45px" :src="$photoServer + item.img" alt="" />
                    <div v-else class="bg-ccc flex-center" style="width: 45px; height: 45px"><i class="el-icon-picture text-999 font-36"></i></div>
                    <div class="text-nowrap p-5" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">{{ item.title }}</div>
                </el-col>
            </el-row>
        </div>
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
        return {
            currentIndex: 0 //当前的index
        }
    },
    computed: {
        curTabColor() {
            return this.floors.tabCurThemeColor ? this.parmas.themeColor : this.floors.tabCurColor
        }
    },
    watch: {
        'floors.data.tabList': {
            handler(newValue, oldValue) {
                let index = this.floors.data.tabList.findIndex((item) => {
                    return item.isSelect
                }) //找出是要正在选中的那一个元素的index
                this.currentIndex = index

                // 让选中的元素居中
                if (this.$refs['tabListItem' + index] && this.$refs['tabListItem' + index][0]) {
                    this.$nextTick(() => {
                        this.$refs['tabListItem' + index][0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
                    })
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.tab-pills {
    background-color: var(--curTabColor);
    border-radius: 15px;
    padding: 3px 10px;
    color: #ffffff !important;
}
</style>
