import { request } from '@/utils/request'
import { get } from 'xe-utils/methods'

// 商品列表
const GoodsManage = {
    productOnline: (data) => request.post('/product/admin/product/productOnline', data), // 违规商品上架
    getShopAllOnline: (data) => request.get('/shop/admin/shop/detail/allOnline', data), // 获取所有店铺
    getBrandAllOnline: (data) => request.get('/product/admin/brand/allOnline', data), // 获取所有品牌
    updateStatus: (data) => request.put('/admin/product/updateStatus', data),
    batchUpdateStatus: (data) => request.put('/product/admin/product/batchUpdateStatus', data),
    productExport: (data, vueThat) => request.getFile('/product/admin/product/export', data, vueThat),
    relationGroup: (data) => request.post('/product/admin/product/group/relation/group', data), // 保存商品分组
    reIndex: (id) => request.put(`/search/admin/search/index?type=${id}`), // 重建所有商品索引
    batchUpdateDelStatus: (data) => request.put('/product/admin/product/batchUpdateDelStatus', data), // 批量更新商品删除状态
    proPreview: (data) => request.get('/product/admin/product/preview', data), // 预览商品生成标识
    test: (data) => request.get('/product/admin/product/index/info', data),
    reIndexCount:(data)=> request.post('/search/admin/search/index/reIndexCount/count')
}

// 商品举报
const report = {
    getAccusationTypeAll: () => request.get('/product/admin/accusationType/all'), // 获取所有举报类型
    batchUpdateStatus: (data) => request.put('/product/admin/accusation/batchHandle', data), // 批量处理举报
    batchAccusation: (data) => request.post('/product/admin/accusation', data) // 处理商品下架
}

// 商品举报类型
const reportType = {
    updateStatus: (data) => request.put('/product/admin/accusationType/batchUpdateStatus', data), // 批量更新状态
    delete: (data) => request.delete('/product/admin/accusationType/batchDelete', data) // 批量删除
}

// 类目
const category = {
	productCategory: (data) => request.get('/product/category', data), // 商品类目(装修专用，只返回正在上线的分类)
    page: (data) => request.get('/product/admin/category', data), // 商品类目
    detail: (id) => request.get(`/product/admin/category/${id}`), // 类目详情
    page2: (data) => request.get(`/product/admin/category/product`, data), // 类目下的商品
    delete: (id) => request.delete(`/product/admin/category/${id}`), // 删除
    changeStatus: (id, status,includeProduct) => request.put(`/product/admin/category/changeStatus/${id}/${status}`,includeProduct), // 类目上下线
    add: (data) => request.post('/product/admin/category', data), // 商品类目
    edit: (data) => request.put('/product/admin/category', data), // 商品类目
    aggListAll: () => request.get('/product/admin/productPropertyAgg/listAll') // 获取所有规格参数分组
}

// 规格
const specifications = {
    specificationAgg: (data) => request.post('/product/admin/productPropertyAgg/specification', data), // 保存关联规格参数分组
    add: (data) => request.post('/product/admin/productProperty', data), // 新增
    edit: (data) => request.put('/product/admin/productProperty', data), // 编辑
    detail: (id) => request.get(`/product/admin/productProperty/${id}`) // 获取详情
}

// 参数
const params = {
    paramsAgg: (data) => request.post('/product/admin/productPropertyAgg/param', data), // 保存关联规格参数分组
    add: (data) => request.post('/product/admin/productProperty', data), // 新增
    edit: (data) => request.put('/product/admin/productProperty', data), // 编辑
    detail: (id) => request.get(`/product/admin/productProperty/${id}`) // 详情
}

// 参数组
const paramGroup = {
    paramsGroupAgg: (data) => request.post('/product/admin/productPropertyAgg/paramGroup', data), // 保存关联规格参数分组
    paramsProperty: (data) => request.get('/product/admin/productProperty/page', data), // 获取参数列表
    paramsGroupDeatail: (id) => request.get(`/product/admin/paramGroup/${id}`), // 获取参数组详情
    addParamsGroup: (data) => request.post('/product/admin/paramGroup', data), // 新增参数分组
    editParamsGroup: (data) => request.put('/product/admin/paramGroup', data) // 编辑参数分组
}

// 品牌
const commodityBrand = {
    updateStatus: (data) => request.put('/product/admin/brand/updateStatus', data), // 更新状态
    brandExport: (data, vueThat) => request.getFile('/product/admin/brand/export', data, vueThat), // 导出
	brandAll: (data) => request.get('/product/brand/all', data), // 【通用】查询所有在线的品牌
}

// 商品品牌
const commodityBrandDetail = {
    brandDetail: (id) => request.get(`/product/admin/brand/${id}`) // 查看详情
}

// 规格参数分组
const specificationParamsGroup = {
    productPropertyAgg: (id) => request.get(`/product/admin/productPropertyAgg/${id}`), // 单个规格参数分组详细信息(简略版)
    productDetailPropertyAgg: (id) => request.get(`/product/admin/productPropertyAgg/detail/${id}`), // 单个规格参数分组详细信息(详情版)
    add: (data) => request.post('/product/admin/productPropertyAgg', data), // 新增
    edit: (data) => request.put('/product/admin/productPropertyAgg', data), // 编辑
    getTree: () => request.get('/product/admin/category/briefTree') // 获取完整的类目树
}

// 商品分组
const goodsGroup = {
    groupRelation: (data) => request.post('/product/admin/product/group/relation/product', data), // 保存关联分组
    groupProduct: (data) => request.get('/product/admin/product/group/product', data), // 【后台】查看分组下的商品列表
    getGoodsList: (data) => request.get('/product/admin/product/page', data), // 获取商品列表
    getProductIdsList: (data) => request.get('/product/admin/product/group/productIds', data) // 获取已关联的商品id列表
    // /product/admin/product/group/productIds
}

export {
    GoodsManage,
    report,
    reportType,
    category,
    specifications,
    params,
    paramGroup,
    commodityBrand,
    commodityBrandDetail,
    specificationParamsGroup,
    goodsGroup
}
