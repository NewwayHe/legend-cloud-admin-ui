import { request } from '@/utils/request'

const uploadApi = (data) => request.post('/basic/file/upload', data)
const addressApi = {
    //获取地址信息
    location: (parentId) => request.get(`/basic/location/children/${parentId}`)
}

// 搜索服务
const search = {
    searchProduct: (data) => request.post('/search/product', data) //【用户】搜索商品
}
const getDomainApi = (data) => request.get('/basic/domain', data) ///获取当前网址域名
const getToken = (data) => request.get('/shop/admin/grass/article/preview', data) ///获取文章详情token

// 小程序
const miniWxApi = {
    // 小程序码接口
    getMiniQrCode: (data) => request.get('/basic/wx/getMiniQrCode', { flag: false, ...data })
}
export { uploadApi, addressApi, search, getDomainApi, getToken, miniWxApi }
