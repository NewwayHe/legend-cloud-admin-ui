import { request } from '@/utils/request'
export function login(data, opt) {
	return request.postForm('/oauth2/oauth2/token', data, opt)
}

export function getInfo(token) {
	return request.get('/user/admin/platform/user')
}

export function logout() {
	return request.delete('/oauth2/token/logout?userType=ADMIN')
}

export function verifyImg(data) {
	return request.post('/verify', data)
}