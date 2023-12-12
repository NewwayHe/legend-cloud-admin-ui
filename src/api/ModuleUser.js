import { request } from '@/utils/request'
const userManage = {
    // 保存菜单
    addAdmin: (data) => request.post('/user/admin/platform/user', data),
    // 修改菜单
    editAdmin: (data) => request.put('/user/admin/platform/user', data),
    // 登录后加载菜单
    userMenu: (data) => request.get('/user/admin/menu', data),
    // 删除菜单
    deleteMenu: (data) => request.delete('/user/admin/menu/' + data),
    // 获取用户拥有权限
    getRoleList: (id) => request.get(`/user/admin/menu/tree/${id}`),
    // 查询所有角色
    getAllRoleList: (data) => request.get(`/user/admin/role/list`, data),
    // 保存角色
    saveRole: (data) => request.post('/user/admin/role/menu', data)
}

//用户列表
const userList = {
    /**
     *  普通用户
     */
    // 更新用户状态
    userUpdateStatus: (userId) => request.put(`/user/admin/ordinary/user/updateStatus/${userId}`),
    // 批量更新状态
    editBatchUserStatus: (data) => request.put(`/user/admin/ordinary/user/batch/update/status`, data),
    // 更改密码
    editUserPwd: (data) => request.put(`/user/admin/ordinary/user/updateLoginPassword`, data),
    // 添加站内信
    addUserInfo: (data) => request.postForm(`/user/admin/ordinary/user/sendMessage`, data),

    /**
     *  商家用户
     */
    // 修改商家在线状态
    editUserStatus: (id) => request.put(`/user/admin/shop/user/updateStatus/${id}`),
    // 批量更新状态
    editBatchShopUserStatus: (data) => request.put(`/user/admin/shop/user/batch/update/status`, data),
    // 更改商家用户登录密码
    editShopUserPwd: (data) => request.put(`/user/admin/shop/user/updateLoginPassword`, data),
    // 发送商家用户站内信
    addShopUserInfo: (data) => request.postForm(`/user/admin/shop/user/sendMessage`, data),

    userAudit: (data) => request.put(`/user/admin/ordinary/user/audit`, data)
}

//用户信息
const userInfo = {
    // 查询普通用户资料
    userDetail: (id, data) => request.get(`/user/admin/user/detail/${id}`, data),
    // 查询商家用户资料
    shopUserDetail: (shopUserId, data) => request.get(`/user/admin/shop/user/${shopUserId}`, data),

    editUserPwd: (data) => request.put(`/user/admin/ordinary/user/updateLoginPassword`, data),

    rolequeryByUserId: (userId) => request.put(`/user/admin/ordinary/role/queryByUserId/${userId}`),

    // userRolePage: (  data ) => request.get(`/user/admin/user/detail/expensesRecordPage`,data),
    // 分页查询角色信息
    userRolePage: (data) => request.get(`/user/admin/ordinary/role/get/role/page/by/userId`, data),
    // 分页查询角色信息（商家）
    shopRolePage: (data) => request.get(`/user/admin/shop/role/get/role/page/by/userId`, data),

    //根据用户ID和角色ID移除普通用户角色
    delUserRole: (data) => request.postForm(`/user/admin/ordinary/role/remove/by/userId`, data),
    //根据用户ID和角色ID移除普通用户角色(商家)
    delShopUserRole: (data) => request.postForm(`/user/admin/shop/role/remove/by/userId`, data),

    // 指定用户更新关联角色
    // updateUserRole: (params, data) => request.request('post' ,`/user/admin/ordinary/role/update/role/for/user`, params, data, {}),
    updateUserRole: (data) => request.post(`/user/admin/ordinary/role/update/role/for/user`, data),
    // 指定用户更新关联角色（商家）
    updateShopUserRole: (data) => request.post(`/user/admin/shop/role/update/role/for/user`, data)
}
// 店铺
const storeManage = {
    // 获取店铺详情
    storeDetail: (id, data) => request.get(`/shop/admin/shop/detail/${id}`, data),
    // 修改店铺信息
    editStoreDetail: (data) => request.put(`/shop/admin/shop/detail/updateDetail`, data),
    // 修改店铺类型
    editStoreType: (data) => request.postForm(`/shop/admin/shop/detail/updateShopType`, data),
    // 修改店铺商品审核
    editStoreStatus: (data) => request.postForm(`/shop/admin/shop/detail/updateProdAudit`, data),
    // 修改店铺佣金比例
    editStorePrice: (data) => request.postForm(`/shop/admin/shop/detail/updateCommissionRate`, data),
    // 历史
    shopHistory: (id, data) => request.get(`/shop/admin/shop/detail/${id}/audit/history`, data),
    // 批量修改状态
    BatchUserStatus: (data) => request.put(`/shop/admin/shop/detail/updateStatus`, data),
    // 批量审核
    BatchUserAudit: (data) => request.put(`/shop/admin/shop/detail/audit`, data)
}

const departmentApi = {
    // 添加部门
    addDept: (data) => request.post('/user/admin/dept', data),

    // 编辑部门
    editDept: (data) => request.put('/user/admin/dept', data),

    // 获取所有部门列表
    getAllDeptList: (data) => request.get('/user/admin/dept/getAllDeptList', data),

    //获取子部门列表
    getSubDeptList: (deptId, data) => request.get(`/user/admin/dept/getSubDeptList/${deptId}`, data),

    // 删除部门
    deleteDept: (deptId) => request.delete('/user/admin/dept/' + deptId)
}

export {
    userManage, //用户管理
    userInfo, //用户信息
    userList, //用户列表
    storeManage, //店铺管理
    departmentApi
}
