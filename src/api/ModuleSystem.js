import { request } from '@/utils/request'

// 平台权限接口
const menuAuthManage = {
    // 获取菜单列表，用来选择父级菜单
    getMenuSelect: (data) => request.get('/user/admin/menu/tree/select/admin/menu/list', data),
    // 获取菜单列表
    getMenuList: (data) => request.get('/user/admin/menu/tree', data),
    // 保存菜单
    saveMenu: (data) => request.post('/user/admin/menu', data),
    // 修改菜单
    editMenu: (data) => request.put('/user/admin/menu', data),
    // 登录后加载菜单
    userMenu: (data) => request.get('/user/admin/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/user/admin/menu/' + data),
    // 根据用户id获取该用户拥有权限
    getRoleList: (id) => request.get(`/user/admin/menu/tree/${id}`),
    // 查询所有角色
    getAllRoleList: (data) => request.get(`/user/admin/role/list`, data),
    // 保存角色
    saveRole: (data) => request.post('/user/admin/role/menu', data),

    // 获取菜单列表
    getShopMenuList: (data) => request.get('/user/admin/shop/menu/tree', data),
    // 保存菜单
    saveShopMenu: (data) => request.post('/user/admin/shop/menu', data),
    // 修改菜单
    editShopMenu: (data) => request.put('/user/admin/shop/menu', data),
    // 删除菜单
    deleteShopMenu: (id) => request.delete('/user/admin/shop/menu/' + id)
}

// 商家权限接口
const shopAuthManage = {
    // 获取菜单列表
    getMenuList: (data) => request.get('/user/admin/shop/menu/tree', data),
    // 保存菜单
    saveMenu: (data) => request.post('/user/admin/shop/menu', data),
    // 修改菜单
    editMenu: (data) => request.put('/user/admin/shop/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/user/admin/shop/menu/' + data),

    // 根据用户id获取该用户拥有权限
    getRoleList: (id) => request.get(`/user/admin/shop/menu/tree/${id}`),

    // 保存商家角色权限
    saveRole: (data) => request.post('/user/admin/shop/role/menu', data),
    // 获取菜单列表
    getShopMenuList: (data) => request.get('/user/admin/shop/menu/tree', data),
    // 保存菜单
    saveShopMenu: (data) => request.post('/user/admin/shop/menu', data),
    // 修改菜单
    editShopMenu: (data) => request.put('/user/admin/shop/menu', data),
    // 删除菜单
    deleteShopMenu: (id) => request.delete('/user/admin/shop/menu/' + id),

    // 商家端菜单树
    getShopMenuSelect: (data) => request.get('/user/admin/shop/menu/tree/select/list', data)
}

// 用户权限接口
const userAuthManage = {
    // 获取菜单列表
    getMenuList: (data) => request.get('/user/admin/ordinary/menu/tree', data),
    // 保存菜单
    saveMenu: (data) => request.post('/user/admin/ordinary/menu', data),
    // 修改菜单
    editMenu: (data) => request.put('/user/admin/ordinary/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/user/admin/ordinary/menu/' + data),
    // 根据用户id获取该用户拥有权限
    getRoleList: (id) => request.get(`/user/admin/ordinary/menu/tree/${id}`),
    // 查询所有角色
    getAllRoleList: (data) => request.get(`/user/admin/role/list`, data),
    // 保存商家角色权限
    saveRole: (data) => request.post('/user/admin/ordinary/role/menu', data),

    // 获取菜单列表
    getShopMenuList: (data) => request.get('/user/admin/ordinary/menu/tree', data),
    // 保存菜单
    saveShopMenu: (data) => request.post('/user/admin/shop/menu', data),
    // 修改菜单
    editShopMenu: (data) => request.put('/user/admin/shop/menu', data),
    // 删除菜单
    deleteShopMenu: (id) => request.delete('/user/admin/shop/menu/' + id)
}

const version = {
    // 获取下程序版本：develop（开发版），trial（体验版），release（正式版）
    getMpVersion: (params) => request.PUT('/api/businessConfig/getMpVersion', params)
}

// 基本信息
const basic = {
    get: () => request.get('/basic/admin/system/config'), // 基本信息查询
    edit: (data) => request.put('/basic/admin/system/config', data), // 编辑
    systemConfig: () => request.get('/shop/systemConfig'), // 【用户】获取ICP备案号以及商城名称等
    contactInformationGet: (data) => request.get('/shop/contactInformation/infoByShopId', data), // 【商家，平台】根据当前登录用户id查询商家或平台微信联系方式存储表
    contactInformationSave: (data) => request.post('/shop/contactInformation/admin/save', data), // 【平台】保存平台微信联系方式
    excelPage: (data) => request.get('/basic/admin/export/excel/page', data), // 文件导出分页查询
    excelDownload: (data) => request.getFile('/basic/export/excel/download', data),

    getUnread: (data) => request.get('/basic/admin/msg/unread', data), //获取未读消息数
    getUnreadList: (data) => request.get('/basic/admin/msg/page', data), //获取未读消息数列表
    getUnreadDetail: (data) => request.get('/basic/admin/msg', data), //获取未读消息数详情
    cleanUnread: (data) => request.get('/basic/admin/msg/cleanUnread', data) //【后台】一键清除消息未读标记
}

const orderSet = {
    // 查询配置项列表
    orderSetting: (params) => request.get('/basic/admin/sys/params/item/list', params),
    // 修改配置项
    orderSysEdit: (params) => request.put('/basic/admin/sys/param/item/sys/value/items', params)
}

const paySet = {
    // 根据名称查询主配置
    sysNameList: (params) => request.get('/basic/admin/sys/params/name/list', params),
    sysGroupName: (params) => request.get('/basic/admin/sys/params/group/name/list', params),
    sysClearCache: () => request.get('basic/admin/cache/cleanCache')
}

// 基本信息
const protocolApi = {
    updateUrl: (data) => request.postForm('/basic/admin/protocol/update/url', data), // 基本信息查询  //【后台】更新协议链接
    queryById: (data) => request.get('/basic/admin/protocol/queryById', data) //【后台】查看协议链接
}
// 区域管理
const areaManage = {
    getRegionChildren: (params) => request.get(`/basic/admin/location/loadProvinceCityChildren/${params}`), //查询所有下级行政区，如广东省下所有市
    deleteRegion: (params) => request.get('/basic/admin/location/deleteLocation', params), //删除行政区
    addRegion: (data) => request.get('/basic/admin/location/insertLocation', data), //新增行政区
    editRegion: (data) => request.get('/basic/admin/location/updateLocation', data) //修改行政区
}

//  素材中心
const materialCenter = {
    getResourceList: (data) => request.get('/basic/admin/file/queryPageByShop', data), //获取文件夹及多媒体资源列表
    changeResourceName: (data) => request.get('/basic/admin/file/updateFileFolderName', data, { isShowMessage: false }), //修改文件夹或图片名字
    tempUpload: (data) => request.postFile('/basic/admin/file/uploadNew', data), //临时上传
    confirmUpload: (data) => request.put('/basic/admin/file/updateManagedFlage', data), //确认上传
    deleteResource: (data) => request.delete(`/basic/admin/file/delectFileByIdList`, data), //删除文件夹或多媒体资源
    createFloder: (data) => request.post('/basic/admin/file/saveFileFolder', data),
    getParentFloderList: (data) => request.get('/basic/admin/file/getIdList', data),
    getFloderTree: (data) => request.get('/basic/admin/file/queryPageAllFolder', data), //获取文件夹列表树
    moveResource: (data) => request.put('/basic/admin/file/updateFileFolderList', data),
    getSaveHistory: (data) => request.post('/basic/file/saveHistoryNew', data) //图片中心历史记录
}

export {
    menuAuthManage, // 平台权限模块
    shopAuthManage, // 商家权限模块
    userAuthManage, // 用户权限模块
    orderSet, // 订单设置
    paySet, // 支付设置
    version,
    basic,
    protocolApi, //
    materialCenter, //素材中心
    areaManage
}
