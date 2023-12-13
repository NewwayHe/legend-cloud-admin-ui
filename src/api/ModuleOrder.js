import { request } from '@/utils/request'

//订单列表
const orderList = {
    subRemake: (date) => request.postForm('/order/admin/order/insert/remake', date), //添加备注
    getOrderDetails: (data) => request.get('/order/admin/order/get', data), //订单详情

    // 订单商家列表
    shopDetailQuerySelect2: (data) => request.get('/shop/shopDetail/querySelect2', data), //订单详情
    orderExport: (data) => request.getFile('/order/admin/order/export', data), //订单导出
    getShopList: (data) => request.post('/shop/shopDetail/getShopList', data) //根据后台选择店铺显示店铺列表,
}

// 售后
const serviceOrderApi = {
    // 审核退款订单
    auditRefund: (data) => request.postForm('/order/admin/order/refund/audit/refund', data),
    // 审核退货订单
    auditRefundGood: (data) => request.postForm('/order/admin/order/refund/audit/refund/good', data),
    // 售后详情
    orderRefundDetail: (data) => request.get('/order/admin/order/refund', data),
    // 售后订单审核
    confirmRefund: (data) => request.post('/order/admin/order/refund/confirm/refund', data),
    // 批量审核退款
    batchConfirmRefund: (data) => request.post('/order/admin/order/refund/confirm/refundList', data),
    // 售后订单导出
    refundExport: (data) => request.getFile('/order/admin/order/refund/export', data),
    // 售后订单详情备注
    refundRemake: (data) => request.postForm('/order/admin/order/refund/insert/remake', data),
    // 获取申请退款原因
    refundReason: () => request.post('/order/admin/order/refund/cancel/reason'),
    // 商家申请售后列表
    orderRefundPageCancelOrder: (data) => request.get('/order/admin/order/refund/pageCancelOrder', data),
    // 审核商家申请售后
    confirmRefundCancel: (data) => request.post('/order/admin/order/refund/confirm/refund/cancel', data),
    // 审核商家申请售后批量
    confirmRefundCancelList: (data) => request.post('/order/admin/order/refund/confirm/refund/cancelList', data),
    // 退款退货原因列表
    afterSalesReason: (data) => request.postForm('/order/admin/order/refund/afterSales/reason', data)
}
// 评论
const commentList = {
    // 查看评论详情
    getCommentDetail: (data) => request.get('/product/admin/product/comment/get', data),
    // 统计分析
    getAnalysis: (data) => request.get('/product/admin/product/comment/analysis', data),
    // 审核初评
    postComment: (data) => request.postForm('/product/admin/product/comment/audit', data),
    // 审核追评
    postReplyComment: (data) => request.postForm('/product/admin/product/comment/audit/add', data),
    // 批量审核初评追评
    postBatchComment: (data) => request.post('/product/admin/product/comment/batch/audit', data)
}

// 问答
const askAnswerApi = {
    // 商品咨询列表上下线
    consultOffline: (data) => request.get('/product/admin/product/consult/offline', data)
}

export { orderList, commentList, serviceOrderApi, askAnswerApi }
