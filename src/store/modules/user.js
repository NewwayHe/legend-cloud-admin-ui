import { login, logout, getInfo } from '@/api/user'
import { basic } from '@/api/ModuleSystem'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { object, debounce } from '@/utils/utils.js'

const getDefaultState = () => {
    return {
        token: getToken(),
        userInfo: {},
        roles: [],
        repeatVerify: {}, //二次校验参数
        messageInfo: {
            //未读消息信息
            count: 0
        }
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = object.deepClone(userInfo)
    },
    SET_REPEATVERIFY: (state, info) => {
        state.repeatVerify = info
    },
    SET_MSGINFO: (state, info) => {
        state.messageInfo = info
    }
}

const actions = {
    // user login
    login({ state, commit }, options) {
        return new Promise((resolve, reject) => {
            const loginParams = {
                grant_type: 'legendshop',
                scope: 'server',
                user_type: 'ADMIN'
            }
            // 增加二次校验请求头
            const { captchaType = '', token = '', pointJson = '' } = state.repeatVerify
            login({ ...loginParams, ...options.userInfo }, { addHeader: { grantType: 'legendshop', captchaType, code: options.code } })
                .then((response) => {
                    // console.log(response)
                    const { access_token } = response
                    commit('SET_TOKEN', access_token)
                    setToken(access_token)
                    // const { data } = response
                    // commit('SET_TOKEN', data.token)
                    // setToken(data.token)
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then((response) => {
                    commit('SET_USERINFO', response.data)
                    resolve({ roles: [1, 2] })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    /* 【用户】获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等
		注意：一、debounce方法如果写在getSystemConfig()的话，Promise resolve()出来的值会为空(如果外面同时执行两次getSystemConfig的话，它会同时执行两次Promise从而resolve一个空值出来)
			 二、debounce方法如果写在Promise和getSystemConfig()之间，防抖会失效
			 三、debounce方法如果写在Promise里，但不是另外开一个__私密方法的话，防抖会失效
	 */
    getSystemConfig({ commit, state }) {
        return new Promise((resolve, reject) => {
            actions.__systemConfig(commit, state, resolve, reject)
        })
    },
    __systemConfig: debounce(function (commit, state, resolve, reject) {
        basic
            .systemConfig()
            .then((response) => {
                if (response.code && response.data) {
                    // commit('SET_SYSTEMCONFIG', response.data)
                    localStorage.setItem('systemConfig', JSON.stringify(response.data))
                    // console.log('SYSTEMCONFIG:', JSON.parse(localStorage.getItem('systemConfig')));
                    resolve(response.data)
                } else {
                    reject(response)
                }
            })
            .catch((error) => {
                reject(error)
                // 备注：如果这里不写finally，则外面调用的getSystemConfig就没有finally方法
            })
            .finally(() => {})
    }),

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout()
                .then(() => {
                    removeToken() // must remove  token  first
                    resetRouter()
                    commit('RESET_STATE')
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    },

    // 请求登录token之前需要使用captcha/check的参数
    saveRepeatVerify({ commit }, info) {
        commit('SET_REPEATVERIFY', info)
    },

    // 请求未读消息数
    getMsgInfo({ commit }) {
        return new Promise((resolve, reject) => {
            basic
                .getUnread()
                .then((response) => {
                    // console.log('消息数--', response)
                    if (response.code == 1) {
                        commit('SET_MSGINFO', { count: response.data })
                    } else {
                        commit('SET_MSGINFO', { count: 0 })
                    }
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
