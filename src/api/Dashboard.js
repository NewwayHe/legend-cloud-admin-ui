import { request } from '@/utils/request'

const indexApi = {
    //首页用户信息
    register: (data) => request.get('/user/admin/count/register', data),

    //首页商品信息
    info: (data) => request.get('/product/admin/product/index/info', data),

    //待处理事项列表
    PendingList: (data) => request.get('/basic/admin/audit/getPending', data)
}

export { indexApi }
