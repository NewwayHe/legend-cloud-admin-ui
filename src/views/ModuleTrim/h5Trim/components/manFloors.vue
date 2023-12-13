<template>
    <!-- /*
     * @Descripttion:右边编辑栏(增加组件)
    */ -->
    <!-- 右边编辑栏(增加组件) -->
    <div>
        <div class="font-16 text-center">组件管理</div>
        <el-divider></el-divider>
        <div class="w-100 text-right cursor-pointer" :style="{ color: value.themeColor }" @click="cleanlAll">清空所有</div>
        <div class="mt-10">
            <div
                v-if="value.head.type != 'none' && value.category != 'POSTER' && value.category != 'POSTER-T'"
                class="border rounded-2 p-10 mb-10 flex-start cursor-not-allowed"
            >
                <i class="el-icon-s-unfold font-16 pr-10 v-bottom"></i>
                <span class="flex-1">
                    {{
                        value.head.type == 'searchAndBanner'
                            ? '搜索+轮播图'
                            : value.head.type == 'searchAndTitle'
                            ? '搜索+标题栏'
                            : value.head.type == 'searchAndTab'
                            ? '搜索+标签页'
                            : ''
                    }}
                </span>
                <el-tooltip effect="dark" content="备注：头部组件如果要删除,请在[基本配置]->[头部组件]里点击[无]来删除" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <vuedraggable
                v-model="value.floors"
                :options="{ group: 'data', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
            >
                <transition-group>
                    <div
                        v-for="(item, index) in value.floors"
                        :key="item.uuid"
                        class="border rounded-2 p-10 mb-10 flex-start cursor-move"
                        :class="[{ 'current-floors': item.uuid == uuid }]"
                        @click.stop="changeFloors(item.uuid)"
                    >
                        <i class="el-icon-s-unfold font-16 pr-10 v-bottom"></i>
                        <span class="flex-1">{{ item.typeName }}</span>
                        <i class="font-18 main-hover el-icon-delete" @click.stop="deleteFloors(index, item.typeName)"></i>
                    </div>
                </transition-group>
            </vuedraggable>
        </div>
    </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
export default {
    components: { vuedraggable },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        uuid: {
            type: String,
            default: ''
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {}
    },
    watch: {
        value: {
            handler(newValue, oldValue) {
                if (newValue) {
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    destroyed() {},
    methods: {
        // 处理楼层
        deleteFloors(index, typeName) {
            this.$confirm(`是否删除该楼层：${typeName}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.value.floors.splice(index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // })
                })
        },
        // 清空所有
        cleanlAll() {
            this.$confirm('是否删除所有楼层?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.value.floors = []
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // })
                })
        },
        changeFloors(uuid) {
            this.$emit('update:uuid', uuid)
            this.$emit('clickFloor', uuid) //用来解决点了同一个index(这时uuid没变化)，这时watch监听uuid数值没变而不触发从而导致方法不执行
        }
    }
}
</script>

<style lang="scss" scoped>
.current-floors {
    z-index: 3;
    box-shadow: rgba(45, 140, 240, 1) solid 2px;
    border: 3px solid rgba(45, 140, 240, 1);
}
</style>
