import { request } from '@/utils/request'

//商品概况页
const psyApi = {
    // 饼状图
    getTree: (data) => request.get('/product/admin/count/category/tree', data),
    //获取店铺list
    getList: (data) => request.get('/product/admin/count/shop/list', data),
    // 获取商品访问概况分页
    getPage: (data) => request.get('/product/admin/count/shop/page', data),
    // 获取店铺商品概况
    getDetail: (data) => request.get('/product/admin/count/shop/detail', data),
    //商品list
    getgoodList: (data) => request.get('/product/admin/count/good/list', data),
    //商品访问折线图
    getLine: (data) => request.get('/product/admin/count/shop/line', data)
}

//商品统计页
const pssApi = {
    //商品概况/商品spu总数
    getSpu: (data) => request.get('/product/admin/count/spu', data),
    //商品概况/商品sku总数
    getSku: (data) => request.get('/product/admin/count/sku', data),
    //商品概况/商品在售sku总数
    getSkuSale: (data) => request.get('/product/admin/count/sku/sale', data),
    //商品概况/商品spu访问用户数
    getSpuClick: (data) => request.get('/product/admin/count/spu/click', data),
    //搜索概况
    getSearchData: (data) => request.get('/product/admin/count/search/data', data),
    //分类概况
    getSkuCategory: (data) => request.get('/product/admin/count/sku/category', data)
}

//搜索概况页
const ssyApi = {
    // 分页
    getPage: (data) => request.get('/product/admin/count/search/page', data),
    // 导出
    getTable: (data) => request.get('/product/admin/count/search/page/excel', data)
}

//类目概况页
const csyApi = {
    // 饼状图
    getTree: (data) => request.get('/product/admin/count/category/tree', data),
    // 分页
    getPage: (data) => request.get('/product/admin/count/category/page', data),
    // 导出Excel
    getExcel: (data) => request.getFile('/product/admin/count/category/page/excel', data)
}

//用户统计页
const ussApi = {
    //地区分布统计
    getArea: (data) => request.get('/user/admin/count/area/data', data),
    //等级分布统计
    getGrade: (data) => request.get('/user/admin/count/grade/data', data),
    //用户购买力排行
    getPurchasing: (data) => request.get('/user/admin/count/purchasing/data', data),
    //店铺销售排行
    getShop: (data) => request.get('/user/admin/count/shop/data', data),
    //新增用户数据
    getNew: (data) => request.get('/user/admin/count/amount/new', data),
    //累计用户数据
    getTotal: (data) => request.get('/user/admin/count/amount/total', data),
    //消费用户数据
    getConsumer: (data) => request.get('/user/admin/count/amount/consumer', data)
}

//用户数量统计
const utsApi = {
    // 用户数量分页
    getPage: (data) => request.get('/user/admin/count/amount/page', data),
    // 获取用户浏览数据
    getView: (data) => request.get('/user/admin/count/amount/view', data)
}

//运营统计
const ossApi = {
    //运营统计概况
    getBusiness: (data) => request.get('/data/admin/count/business/data', data),
    //访问统计折线图
    getViewPic: (data) => request.get('/data/admin/count/view/pic', data),
    //成交统计折线图
    getDealPic: (data) => request.get('/data/admin/count/deal/pic', data),
    //售后统计折线图
    getReturnPic: (data) => request.get('/data/admin/count/return/pic', data)
}

// 用户购买力排行
const urgApi = {
    // 获取用戶购买力排行柱状图数据
    getPic: (data) => request.get('/user/admin/count/purchasing/pic', data)
}

// 营销概况
const msApi = {
    // 获取用戶购买力排行柱状图数据
    getMasketing: (data) => request.get('/data/admin/count/activity/page', data),
    // 新增使用次数统计图
    getCountLine: (data) => request.get('/data/admin/count/activity/publish/pic', data),
    // 新增成交金额统计图
    getDealLine: (data) => request.get('/data/admin/count/activity/deal/pic', data)
}
// 优惠券统计
const cpApi = {
    // 平台营销金额数据统计
    amountCount: (data) => request.get('/data/admin/coupon/statement/platform/amountCount', data),
    // 平台营销用户数据统计
    userAmountCount: (data) => request.get('/data/admin/coupon/statement/platform/userAmountCount', data),
    // 平台营销数据趋势统计
    userDataCount: (data) => request.get('/data/admin/coupon/statement/platform/userDataCount', data),
    // 商家营销金额数据统计
    shopAmountCount: (data) => request.get('/data/admin/coupon/statement/shop/amountCount', data),
    // 商家营销用户数据统计
    shopUserAmountCount: (data) => request.get('/data/admin/coupon/statement/shop/userAmountCount', data),
    // 商家营销数据趋势统计
    shopUserDataCount: (data) => request.get('/data/admin/coupon/statement/shop/userDataCount', data)
}

export { psyApi, pssApi, ssyApi, csyApi, ussApi, utsApi, ossApi, urgApi, msApi, cpApi }
