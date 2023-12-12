import { request } from '@/utils/request'
export function login(data) {
    return request.postForm('/oauth2/oauth2/token', data)
}
// 获取菜单列表
export function getMenuList(data) {
    return request.get('/user/admin/menu/tree', data)
}
// 保存菜单
export function saveMenu(data) {
    return request.post('/user/admin/menu', data)
}
// 登录后加载菜单
export function userMenu(data) {
    return request.get('/user/admin/menu', data)
}

// 登录后加载菜单
export function deleteMenu(id) {
    return request.delete('/user/admin/menu', id)
}
