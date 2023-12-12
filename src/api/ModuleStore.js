import { request } from '@/utils/request'
import { data } from 'autoprefixer'

// 新闻
const news = {
    updateStatus: (data) => request.put('/admin/headline/news/updateStatus', data), // 上/下线
    add: (data) => request.post('/admin/headline/news', data), // 添加
    edit: (data) => request.put('/admin/headline/news', data), // 编辑
    detail: (data) => request.get('/admin/headline/news/get', data) // 详情
}

// 移动端-广告
const startAdvert = {
    updateStatus: (data) => request.put('/shop/admin/app/start/adv/updateStatus', data) // 上/下线
}
// 公告
const notice = {
    updateStatus: (data) => request.postForm('/shop/admin/pub/updateStatus', data), // 上/下线
    add: (data) => request.post('/shop/admin/pub', data), // 添加
    edit: (data) => request.put('/shop/admin/pub', data), // 编辑
    detail: (id) => request.get('/shop/admin/pub/' + id) // 详情
}

// 帮助栏目
const helpCategory = {
    updateStatus: (data) => request.put('/shop/admin/news/category/updateStatus', data), // 上/下线
    add: (data) => request.post('/shop/admin/news/category', data),
    edit: (data) => request.put('/shop/admin/news/category', data)
}

// 帮助文章
const helpArticle = {
    newsDisplayCategory: (data) => request.get('/shop/admin/news/category/displayPage', data), // 获取指定栏目
    newsCategory: (data) => request.get('/shop/admin/news/category/query', data), // 获取所有帮助栏目
    updateStatus: (data) => request.postForm('/shop/admin/news/updateStatus', data), // 上/下线
    add: (data) => request.post('/shop/admin/news', data), // 添加
    edit: (data) => request.put('/shop/admin/news', data), // 编辑
    detail: (data) => request.get('/shop/admin/news/get', data) // 详情
}

// 反馈意见
const comment = {
    edit: (data) => request.post('/shop/admin/user/feedback/updateListById', data) // 上/下线
}

// 首页修改
const trim = {
    decoratePageList: (data) => request.get(`/shop/admin/decoratePage/list`, data), // 装修列表
    delPage: (id) => request.delete(`/shop/admin/decoratePage/${id}`), // 删除页面
    updateName: (data) => request.postForm(`/shop/admin/decoratePage/updateName`, data), // 【后台】修改页面名称
    decoratePageUse: (data) => request.postForm(`/shop/admin/decoratePage/use`, data), // 【后台】设为首页
    updateCoverPicture: (data) => request.postForm(`/shop/admin/decoratePage/updateCoverPicture`, data), // 【后台】修改封面图片
    clone: (data) => request.postForm(`/shop/admin/decoratePage/clone`, data) // 【后台】复制页面
}

// 首页装修 分类展示
const classifiedDisplay = {
    settingCategory: (data) => request.get('/shop/admin/app/setting/category', data), // 获取分类设置
    updateCategory: (data) => request.put('/shop/admin/app/setting/update/category', data) // 保存分类设置
}

export { news, notice, startAdvert, helpCategory, helpArticle, comment, trim, classifiedDisplay }
