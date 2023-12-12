<template>
    <el-cascader ref="cascaderAddr" v-model="cascaderValue" :props="props" placeholder="省-市-区-街道" @change="changeCity" />
</template>

<script>
import { addressApi } from '@/api/ModuleCommon.js'

export default {
    props: {
        value: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        let _that = this
        return {
            cascaderValue: [], // 所选值的数组
            cascaderLable: [], // 所选值的label数组
            props: {
                lazy: true,
                value: 'id',
                label: 'name',
                async lazyLoad(node, resolve) {
                    const { level, value } = node
                    let nodes = ''
                    if (level == 0) {
                        nodes = await _that.getProvinces()
                    } else if (level == 1) {
                        nodes = await _that.getCities(value)
                    } else if (level == 2) {
                        nodes = await _that.getAreas(value)
                    } else if (level == 3) {
                        nodes = await _that.getStreets(value)
                    }
                    resolve(nodes)
                }
            }
        }
    },
    watch: {
        value: {
            handler(newValue) {
                this.cascaderValue = newValue
            },
            immediate: true
        },
        cascaderValue(newValue) {
            this.$emit('input', newValue)
        }
    },
    methods: {
        async getProvinces() {
            let provinces = ''
            let { data } = await addressApi.location(0)
            provinces = [...data]
            for (let item of provinces) {
                item.children = []
            }
            return provinces
        },
        async getCities(value) {
            let cities = ''
            let { data } = await addressApi.location(value)
            cities = [...data]
            for (let item of cities) {
                item.children = []
            }
            return cities
        },
        async getAreas(value) {
            let areas = ''
            let { data } = await addressApi.location(value)
            areas = [...data]
            for (let item of areas) {
                item.children = []
            }
            return areas
        },
        async getStreets(value) {
            let streets = ''
            let { data } = await addressApi.location(value)
            streets = [...data]
            for (let item of streets) {
                item.leaf = true
            }
            return streets
        },

        // 确定一个节点item
        changeCity() {
            this.cascaderLable = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
        }
    }
}
</script>

<style scoped>
::v-deep .el-cascader-menu__list {
    width: 100%;
    height: 100%;
}
</style>
