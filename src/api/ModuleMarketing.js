import { request } from '@/utils/request'

// 优惠券api
const couponApi = {
    //平台优惠券api
    saveCoupon: (data) => request.post('/activity/admin/coupon', data), // 保存优惠券

    updateCouponStatu: (status, data) => request.put(`/activity/admin/coupon/updateStatus/${status}`, data), // 修改优惠券状态

    updateShCouponStatu: (status, data) => request.put(`/activity/admin/shop/coupon/updateStatus/${status}`, data), // 修改商家优惠券状态

    couponDetail: (couponId, data) => request.get(`/activity/admin/coupon/${couponId}`, data), // 修改优惠券状态

    couponShop: (data) => request.get(`/activity/admin/coupon/shop`, data), // 根据id查询优惠券优惠商品

    couponShopPut: (data) => request.put(`/activity/admin/couponShop`, data), // 更新优惠券店铺

    copyCouponShop: (couponId) => request.postForm(`/activity/admin/couponShop/copy/${couponId}`), // 拷贝优惠券商品

    couponProductDel: (couponShopId, couponId) => request.delete(`/activity/admin/couponShop/${couponShopId}/${couponId}`), // 删除优惠券商品

    updateInvalid: (data) => request.postForm(`/activity/admin/couponUser/updateStatus`, data) // 强制失效用户优惠券状态

    //商家优惠券api

    // updateInvalid: (data) => request.postForm(`/activity/admin/couponUser/updateStatus`, data) // 强制失效用户优惠券状态

    // updateInvalid: (data) => request.postForm(`/activity/admin/couponUser/updateStatus`, data) // 强制失效用户优惠券状态
}
const popupAdvertApi = {
    // 弹窗广告详情/shop/advertise/{id}
    // queryAdvertise:(data) => request.get('/shop/advertise/query/queryAdvertise',data),
    queryAdvertise:(id) => request.get(`/shop/advertise/${id}`),

    // 弹窗图表数据
    advertiseDataReport:(data) => request.get('/shop/advertise/advertise/advertiseDataReport',data),

    // 新增弹窗广告
    addAdvertise:(data)=>request.post('/shop/advertise',data),
    
    // 修改弹窗广告
    editAdvertise:(data)=>request.post('/shop/advertise/updateAdvertise',data),
    // 修改弹窗广告
    advertiseUpdateStatus:(data)=>request.post('/shop/advertise/updateAdvertise',data),

    advertiseCount:(data)=>request.get('/shop/advertise/advertise/advertiseCount',data)

}

export { couponApi, popupAdvertApi }
