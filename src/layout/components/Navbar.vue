<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb class="breadcrumb-container" />

        <div class="right-menu d-flex">
            <div class="w-50p h-100 flex-center" @click.stop="$router.push({ name: 'excelCenter' })">
                <i class="iconfont icon-backtop1 font-20 cursor-pointer" style="transform: rotate(180deg)"></i>
            </div>
            <!-- 暂无后端接口，先屏蔽 -->
            <!-- <div class="w-50p h-100 flex-center">
                <i class="iconfont icon-gouwuche font-20"></i>
            </div> -->
            <div class="w-50p h-100 flex-center position-relative cursor-pointer" @click.stop="$router.push({ name: 'message' })">
                <i class="iconfont icon-lingdang" style="font-size: 20px"></i>
                <span v-if="messegeNum" class="position-absolute text-fff _message font" style="right: 4px; top: 12px">
                    {{ messegeNum > 99 ? '99+' : messegeNum }}
                </span>
            </div>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper px-15 h-100">
                    <i class="el-icon-s-custom font-20 d-block mr-10" />
                    <!-- <ls-image :src='userInfo.avatar' :options="{ w: '25', h: '25'}"></ls-image> -->
                    <div class="line-clamp1 flex-1">{{ userInfo.username }}</div>
                    <!-- <img :src="userInfo.avatar" class="user-avatar" /> -->
                    <!-- <i class="el-icon-caret-bottom" /> -->
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <router-link to="/"><el-dropdown-item>首页</el-dropdown-item></router-link>
                    <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
                    <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
                    <el-dropdown-item divided @click.native="logout"><span style="display: block">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { userInfo } from '@/api/ModuleUser'
export default {
    components: {
        Breadcrumb,
        Hamburger
    },
    computed: {
        ...mapGetters(['sidebar', 'userInfo', 'messegeNum'])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            this.$router.push(`/login`)
            this.$store.dispatch('tagsView/delAllVisitedViews') //不把标签视图清空的话，切换另一个没权限的角色，他仍然能通过标签进入他没权限的页面
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 63px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 60px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    ._message {
        display: block;
        padding: 2px 4px;
        // width: 28px;
        // height: 20px;
        line-height: 1.2;
        background: #f56c6c;
        border-radius: 100px;
        text-align: center;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            width: 120px;
            margin-right: 20px;

            .avatar-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                // margin-top: 5px;
                position: relative;
                cursor: pointer;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
// ::v-deep.user-dropdown {
//     z-index: 9999 !important;
// }
</style>
