import { request } from '@/utils/request'

/**
 * 财务管理
 *
 * */

// 预存款
const deposit = {
    // 余额明细
    walletPage: (data) => request.get('/pay/admin/wallet/page', data)
}

// 结算管理
const settle = {
    // 平台总金额查询
    getSettleAmount: (data) => request.get('/shop/plate/capital/flow/amount', data),
    // 平台总金额导出excel
    exportSettleAmount: (data) => request.getFile('/shop/plate/capital/flow/export/excel', data),
    // 结算档期分页查询
    getSettleData: (data) => request.get('/order/admin/bill/period/page', data),
    // 结算档期列表导出
    exportSettleData: (data) => request.getFile('/order/admin/bill/period/export', data),
    // 结算账单分页查询
    getBillSettleData: (data) => request.get('/order/admin/shop/order/bill/page', data),
    // 结算账单列表导出
    exportSettleBillData: (data) => request.getFile('/order/admin/shop/order/bill/export', data),
    // 账单结算
    getSettleBill: (id) => request.put(`/order/admin/shop/order/bill/pay/${id}`),
    // 账单详情查询
    getSettleInfo: (id) => request.get(`/order/admin/shop/order/bill/${id}`),
    //结算账单详情账单导出
    exportSettleInfo: (data) => request.getFile('/order/admin/shop/order/bill/detailList/export', data),
    //账单审核
    billtoexamine: (id) => request.put(`/order/admin/shop/order/bill/check/${id}`),
    //账单结算
    settlement: (data) => request.postForm('/order/admin/shop/order/bill/pay', data),
    // 【后台】提现审核后，如果出现异常，重新支付
    compensate: (id) => request.get(`/pay/admin/wallet/compensate/${id}`)
}

export { settle, deposit }
