import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { test} from '@/utils/utils.js'
import { filterAsyncRouter } from '@/store/modules/permission'
import { menuAuthManage } from '@/api/ModuleSystem'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            if (!test.isEmpty(store.getters.userInfo)) {
                next()
            } else {
                try {
                    await store.dispatch('user/getInfo')
                    store.dispatch('user/getMsgInfo')
                    const accessRoutes = await store.dispatch('permission/generateRoutes')
                    accessRoutes.push({ path: '*', redirect: '/dashboard', hidden: true })
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                } catch (error) {
                    await store.dispatch('user/resetToken')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
