<!-- /*
 * @Descripttion:首页装修
*/ -->
<template>
    <section v-loading class="">
        <el-card :body-style="{ padding: `20px 20px 10px 20px` }">
            <!-- 海报页面 -->
            <div class="table">
                <el-row type="flex">
                    <el-col>
                        <el-radio-group v-model="searchFilters.category" size="large" class="mb-20" @change="changeStatus">
                            <el-radio-button label="INDEX">首页装修</el-radio-button>
                            <el-radio-button label="INDEX-T">页面模板</el-radio-button>
                            <el-radio-button label="POSTER">海报页</el-radio-button>
                            <el-radio-button label="POSTER-T">海报模板</el-radio-button>
                            <el-radio-button label="CATEGORY">分类展示</el-radio-button>
                            <el-radio-button label="CATEGORY_ADVERT">分类广告</el-radio-button>
                            <el-radio-button label="APP_ADVERT">APP启动广告</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>

                <template
                    v-if="
                        searchFilters.category == 'INDEX' ||
                        searchFilters.category == 'INDEX-T' ||
                        searchFilters.category == 'POSTER' ||
                        searchFilters.category == 'POSTER-T'
                    "
                >
                    <!-- 查询 -->
                    <div class="search">
                        <el-form :inline="true" :model="searchFilters" size="small" @submit.native.prevent>
                            <el-form-item label="页面名称">
                                <el-input v-model="searchFilters.name" placeholder="请输入" @keyup.enter.native="dbnSearch" />
                            </el-form-item>
                            <el-form-item v-if="searchFilters.category == 'INDEX' || searchFilters.category == 'POSTER'" label="状态">
                                <el-select v-model="searchFilters.status" clearable placeholder="全部状态" size="small">
                                    <el-option label="未发布" :value="-1" />
                                    <el-option label="已发布" :value="1" />
                                    <el-option label="已更新未发布" :value="0" />
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="searchFilters.category == 'INDEX-T' || searchFilters.category == 'POSTER-T'" label="类型">
                                <el-select v-model="searchFilters.type" clearable placeholder="全部" size="small">
                                    <el-option label="全部" :value="null" />
                                    <el-option label="官方" :value="1" />
                                    <el-option label="原创" :value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-20">
                                <el-button size="small" @click.stop="dbnSearch">搜索</el-button>
                                <el-button size="small" type="primary" @click.stop="editInfo('')">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!--可以使用的首页样式列表-->
                    <el-row v-if="tableList && tableList.length" class="d-flex flex-wrap mt-10" :gutter="20" style="flex-warp: warp">
                        <el-col v-for="item in tableList" :key="item.id" :md="6" :lg="4" class="mb-20">
                            <div class="homePage">
                                <div class="maskParent" @mouseenter="showMask(item.id)" @mouseleave="hideMask(item.id)">
                                    <div class="bannerTitle">
                                        <div class="dot" :style="{ background: 'rgba(254, 41, 83, 1)' }" />
                                        <div class="dot" :style="{ background: 'rgba(245, 177, 63, 1)' }" />
                                        <div class="dot" :style="{ background: 'rgba(103, 194, 58, 1)' }" />
                                    </div>
                                    <div class="mainContent">
                                        <div class="imgs">
                                            <ls-image
                                                mode="fill"
                                                style="vertical-align: middle; position: absolute"
                                                :src="item.coverPicture"
                                                :options="{ w: '100%' }"
                                            />
                                        </div>
                                    </div>
                                    <!-- 遮罩层 -->
                                    <div v-show="isMask && item.id == current" class="mask">
                                        <div class="mackBox" />
                                        <div class="editAndModify">
                                            <el-button
                                                v-if="searchFilters.category == 'INDEX-T' || searchFilters.category == 'POSTER-T'"
                                                type="primary"
                                                size="small"
                                                @click="editInfo(item.id, 'putToUse')"
                                            >
                                                应&emsp;用
                                            </el-button>
                                            <el-button v-if="item.type != 1" type="primary" size="small" @click="editInfo(item.id)">
                                                编&emsp;辑
                                            </el-button>
                                            <el-button v-if="item.type != 1" type="primary" size="small" @click="modifyCover(item.id)">
                                                修改封面图
                                            </el-button>
                                            <el-button type="primary" size="small" @click="previewTemplate(item.id)">预&emsp;览</el-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="bottomContent">
                                    <div class="nameAndFuncs">
                                        <div class="titlename">
                                            <span>{{ item.name }}</span>
                                        </div>
                                        <div class="moreFunction">
                                            <el-col>
                                                <el-dropdown trigger="click" placement="top">
                                                    <span class="icon iconfont icon-more" />
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item @click.native="edit(item.id, item.name, 'updateName')">
                                                            编辑名称
                                                        </el-dropdown-item>
                                                        <el-dropdown-item
                                                            v-if="searchFilters.category == 'INDEX' && !item.useFlag"
                                                            @click.native="useIndexInfo(item.id, item)"
                                                        >
                                                            设为首页
                                                        </el-dropdown-item>
                                                        <el-dropdown-item @click.native="edit(item.id, item.name, 'clone')">
                                                            复制{{ categoryName }}
                                                        </el-dropdown-item>
                                                        <el-dropdown-item
                                                            v-if="
                                                                item.status != 1 &&
                                                                (searchFilters.category == 'INDEX' || searchFilters.category == 'POSTER')
                                                            "
                                                            @click.native="releaseIndexInfo(item.id)"
                                                        >
                                                            发布{{ categoryName }}
                                                        </el-dropdown-item>
                                                        <el-dropdown-item v-if="!item.useFlag" @click.native="deleteIndexInfo(item.id)">
                                                            删除{{ categoryName }}
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </el-col>
                                        </div>
                                    </div>
                                    <!-- 未发布noRelease 已经更新未发布updateAndnoRelease   已经发布Release-->
                                    <div
                                        v-if="searchFilters.category == 'INDEX' || searchFilters.category == 'POSTER'"
                                        class="releaseState"
                                        :class="{ noRelease: item.status == '-1' || '0', Release: item.status == '1' }"
                                    >
                                        <span>{{ releaseStatus(item.status) }}</span>
                                    </div>
                                    <div
                                        v-else
                                        class="mt-10 d-inline-block text-white p-5 font-12 rounded-3"
                                        :style="{ background: item.type == 1 ? '#45be89' : '#ff9b00' }"
                                    >
                                        <span>{{ item.type == 1 ? '官方' : '原创' }}</span>
                                    </div>
                                </div>
                                <div v-if="item.useFlag" class="flag"><span>使用中</span></div>
                            </div>
                        </el-col>
                    </el-row>

                    <!--没有内容时显示的页面-->
                    <Empty v-else :text="`暂无${categoryName}内容`" :loading="tableListLoading" />
                    <LsSticky :data="tableList">
                        <el-row type="flex" justify="end" class="w-100 overflow-h py-10 mt-10 bg-white">
                            <pagination
                                :current-page="page.curPage"
                                :total="tableTotal"
                                :page-sizes="[12, 30, 50, 100, 500, 1000]"
                                :page-size="page.pageSize"
                                @size-change="pageSizeChange"
                                @current-change="currentPageChange"
                            />
                        </el-row>
                    </LsSticky>
                </template>
                <!-- 分类展示 -->
                <template v-if="searchFilters.category == 'CATEGORY'">
                    <trimCategory />
                </template>
                <!-- 分类广告 -->
                <template v-if="searchFilters.category == 'CATEGORY_ADVERT'">
                    <catAdvert />
                </template>
                <!-- APP启动广告 -->
                <template v-if="searchFilters.category == 'APP_ADVERT'">
                    <appAdvert />
                </template>
            </div>

            <!-- 修改封面图片 -->
            <cover-modify ref="modifyDialog" :choose-item="chooseItem" @modifyImg="modifySubmit" />
            <!-- 链接弹框组件 -->
            <dialogName
                ref="dialogName"
                v-model="newName"
                field="页面名称"
                :title="api == 'updateName' ? '编辑' : '复制'"
                @validatePassed="validatePassed"
            />
        </el-card>
        <dialogPreview ref="dialogPreview" />
        <dialogCategory ref="dialogCategory" />
    </section>
</template>
<script>
import { request } from '@/utils/request'
import { trim } from '@/api/ModuleStore'
import common from '@/mixins/pages/commom'

import appAdvert from './components/appAdvert'
import catAdvert from './components/catAdvert'
import coverModify from './components/coverModify'
import dialogCategory from './components/dialogCategory'
import trimCategory from './components/trimCategory'
import dialogName from '../../../ModuleTrim/components/dialogName'
import dialogPreview from '@/components/iphonePreview/dialogPreview.vue'

export default {
    name: 'MbTrimIndex',
    components: {
        appAdvert,
        catAdvert,
        coverModify,
        dialogCategory,
        trimCategory,
        dialogName,
        dialogPreview
    },
    mixins: [common],
    data() {
        return {
            url: {
                getData: '/shop/admin/decoratePage/list'
            },
            searchFilters: {
                name: '',
                status: '',
                category: this.$route.params.category ? this.$route.params.category : 'INDEX',
                source: 'mobile'
            },
            page: {
                pageSize: 12
            },
            useIndexPage: {}, // 存储首页使用中
            isMask: false, // 遮罩层面控制

            current: 0,

            chooseItem: '',

            newName: '', //dialogName修改名称专用
            id: '', //dialogName修改名称专用
            api: '' //dialogName修改名称专用
        }
    },
    computed: {
        releaseStatus() {
            return function (state) {
                const stateText = {
                    '-1': '未发布',
                    0: '已更新未发布',
                    1: '已发布'
                }
                return stateText[state]
            }
        },
        categoryName() {
            let name = ''
            if (this.searchFilters.category == 'INDEX-T') {
                name = '页面模板'
            } else if (this.searchFilters.category == 'POSTER-T') {
                name = '海报模板'
            } else if (this.searchFilters.category == 'POSTER') {
                name = '海报'
            } else {
                name = '页面'
            }
            return name
        }
    },
    watch: {},

    mounted() {
        if (this.$route.params.category) {
            this.searchFilters.category = this.$route.params.category
        }
    },
    methods: {
        // 首页装修/海报页面切换状态
        changeStatus(type) {
            this.page.curPage = 1
            this.tableList = []
            if (type == 'INDEX' || type == 'INDEX-T' || type == 'POSTER' || type == 'POSTER-T') {
                this.getData()
            }
        },

        // 打开修改封面弹窗
        modifyCover(id) {
            this.chooseItem = id
            this.$refs.modifyDialog.dialogShow()
        },

        // 保存修改
        modifySubmit(imgUrl, id) {
            trim.updateCoverPicture({ coverPicture: imgUrl, id: id }).then((res) => {
                if (res.code) {
                    this.$message.success('操作成功')
                    this.getData()
                    this.$refs.modifyDialog.dialogClose()
                }
            })
        },

        // 编辑装修
        editInfo(id, type) {
            if ((this.searchFilters.category == 'INDEX' || this.searchFilters.category == 'POSTER') && !id) {
                this.$refs.dialogCategory.change(this.searchFilters.category)
            } else {
                this.$router.push({
                    path: '/h5Trim',
                    query: {
                        id: id || '',
                        category: this.searchFilters.category || '',
                        isUser: type == 'putToUse' ? true : ''
                    }
                })
            }
        },

        // 遮罩显示
        showMask(index) {
            this.isMask = true
            this.current = index
        },
        // 隐藏遮罩
        hideMask(index) {
            this.isMask = false
            this.current = null
        },
        // 设为首页
        useIndexInfo(id) {
            this.$confirm('设置首页后，会代替原来首页。确定设置?', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    trim.decoratePageUse({ id, category: this.searchFilters.category }).then((res) => {
                        if (res.code) {
                            this.$message.success('操作成功')
                            this.getData()
                        }
                    })
                })
                .catch(() => {})
        },

        // 发布首页装修
        releaseIndexInfo(id) {
            this.$confirm('发布模板后，可使用该模板。确定发布?', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    request
                        .postForm('/shop/admin/decoratePage/releasePage', { id })
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {})
        },

        // 删除首页装修
        deleteIndexInfo(id) {
            this.$confirm('数据删除后，无法恢复。确定删除?', '消息确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    trim.delPage(id)
                        .then((res) => {
                            if (res.code) {
                                this.$message.success('操作成功')
                                this.getData()
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            this.$message.error(err.msg)
                        })
                })
                .catch(() => {})
        },

        edit(id, name, api) {
            this.id = id
            if (api == 'clone') {
                this.newName = ''
            } else {
                this.newName = name
            }
            this.api = api
            this.$refs.dialogName.showDialog(api)
        },

        // 【后台】修改页面名称
        validatePassed(api) {
            trim[api]({
                id: this.id,
                newName: this.newName
            }).then((res) => {
                if (res.code) {
                    this.$message.success('操作成功')
                    this.getData()
                }
            })
        },
        // 子组件专用,让子组件可以直接按钮跳转到其它tab栏
        changeCategory(type) {
            this.searchFilters.category = type
        },
        // 预览
        previewTemplate(id) {
            let url = ''
            if (this.searchFilters.category == 'POSTER' || this.searchFilters.category == 'POSTER-T') {
                url = `${this.$config.shareUrl}/ModuleCommon/poster/poster?templateId=${id}&device=mobile`
            } else {
                url = `${this.$config.shareUrl}/pages/index/index?templateId=${id}&device=mobile`
            }
            this.$refs.dialogPreview.showDialog({ url: url })
        }
    }
}
</script>
<style lang="scss" scoped>
.box-card {
    // overflow-x: scroll;
    padding: 20px 0px;
}

.box-card .el-card__body {
    padding: 0 15px;
}

.homePage {
    overflow: hidden;
    position: relative;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);

    .maskParent {
        width: 100%;
        height: 100%;
        position: relative;

        .bannerTitle {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0px 15px;
            height: 20px;
            line-height: 20px;
            background: rgba(253, 253, 253, 1);

            .dot {
                width: 5px;
                height: 5px;
                margin-right: 8px;
                border-radius: 3px;
            }
        }

        .mainContent {
            background: rgba(247, 248, 250, 1);
            padding: 14px 15px;

            .imgs {
                overflow: hidden;
                width: 100%;
                height: 0;
                padding-bottom: 125.3%;
                position: relative;
            }
        }

        .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            display: flex;
            justify-content: center;
            align-items: center;

            .mackBox {
                width: 100%;
                height: 100%;
                top: 0px;
                left: 0px;
                position: absolute;
                background-color: #000;
                filter: alpha(opacity=50);
                opacity: 0.5;
            }

            .editAndModify {
                position: absolute;
                display: flex;
                flex-direction: column;

                .el-button + .el-button {
                    margin-top: 10px;
                    margin-left: 0px;
                }
            }
        }
    }

    .bottomContent {
        padding: 20px 15px;

        .nameAndFuncs {
            display: flex;
            justify-content: space-between;
            position: relative;

            .titlename {
                width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: rgba(51, 51, 51, 1);
                font-size: 14px;
            }

            .moreFunction {
                cursor: pointer;

                .icon {
                    color: rgba(48, 140, 244, 1);
                }
            }
        }

        .releaseState {
            margin-top: 10px;
            display: inline-block;
            border: 1px solid;
            padding: 5px 5px;
            font-size: 12px;
            border-radius: 3px;

            &.noRelease {
                color: rgba(245, 108, 108, 1);
                border-color: rgba(245, 108, 108, 1);
            }

            &.Release {
                color: rgba(103, 194, 58, 1);
                border-color: rgba(103, 194, 58, 1);
            }
        }
    }

    .flag {
        position: absolute;
        /*绝对定位*/
        height: 30px;
        line-height: 30px;
        text-align: center;
        width: 120px;
        background-color: #ff5722;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        transform: rotate(-45deg);
        left: -29px;
        top: 17px;
    }
}

.el-dropdown-menu {
    background: rgb(51, 51, 51) !important;
    border: none;

    .el-dropdown-menu__item {
        color: white !important;

        &:hover {
            color: rgb(51, 51, 51) !important;
        }
    }
    ::v-deep .popper__arrow::after {
        border-top-color: rgb(51, 51, 51) !important;
    }
}
</style>
