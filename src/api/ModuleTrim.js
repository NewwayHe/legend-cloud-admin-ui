import { request } from '@/utils/request'

// 装修中心
const decorate = {
    // 装修中心
    prodList: (data) => request.postForm('/shop/admin/decorate/action/prodList', data), // 获取商品弹层数据
    prodGroup: (data) => request.postForm('/shop/admin/decorate/action/prodGroup', data), // 获取分组弹层数据
    pcPosterPage: (data) => request.postForm('/shop/admin/decorate/action/pc/poster/page', data), //【后台】获取PC页面弹层数据
    mbPosterPage: (data) => request.postForm('/shop/admin/decorate/action/mobile/poster/page', data), // 【后台】获取mobile页面弹层数据
    category: (data) => request.postForm('/shop/admin/decorate/action/category', data), // 【后台】获取分类弹层数据

    save: (data) => request.post('/shop/admin/decoratePage/save', data), // 【后台】保存装修
    release: (data) => request.put('/shop/admin/decoratePage/release', data), // 【后台】发布装修
    edit: (data) => request.postForm('/shop/admin/decoratePage/edit', data), // 根据id获取装修页面的数据(点击‘编辑装修’时用)

    sCategory: (data) => request.postForm('/s/decorate/action/category', data), // 获取店铺分类弹层数据
    sPcPosterPage: (data) => request.postForm('/s/decorate/action/pcPosterPage', data), // 获取PC店铺装修页面弹层数据
    sProdList: (data) => request.postForm('/s/decorate/action/prodList', data), // 获取店铺商品弹层数据

    // 营销组件加载数据专用
    couponReceivable: (data) => request.get(`/activity/coupon/receivable`, data), //【用户】用户可领取优惠券列表(店铺、skuId)

    getThemeColor: (data) => request.get('/shop/mobile/theme/color', data),     //获取移动端主题颜色
    getCateList: (data) => request.get('/shop/admin/decoratePage/list', data),      //获取对于分类的列表
}

export { decorate }
