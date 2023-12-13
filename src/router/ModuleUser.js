/* Layout */
import Layout from '@/layout'
const ModuleSystem = [
    {
        path: '/ModuleUser',
        component: Layout,
        redirect: '/ModuleUser/userManage',
        name: 'ModuleUser',
        meta: {
            title: '用户管理',
            icon: 'yonghu'
        },
        children: [
            {
                path: 'userManage',
                component: () => import('@/views/ModuleUser/userManage/index'),
                name: 'userManage',
                meta: { title: '用户管理' },
                redirect: '/ModuleUser/userManage/userList',
                children: [
                    {
                        path: 'userList',
                        component: () => import('@/views/ModuleUser/userManage/userList'),
                        name: 'userList',
                        meta: { title: '普通用户列表' }
                    },

                    {
                        path: 'userInfo',
                        component: () => import('@/views/ModuleUser/userManage/userInfo'),
                        name: 'userInfo',
                        meta: { title: '用户信息' },
                        hidden: true
                    },
                    {
                        path: 'shopUserInfo',
                        component: () => import('@/views/ModuleUser/userManage/shopUserInfo'),
                        name: 'shopUserInfo',
                        meta: { title: '商家用户信息' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'storeManage',
                component: () => import('@/views/ModuleUser/storeManage/index'),
                name: 'storeManage',
                meta: { title: '店铺管理' },
                redirect: '/ModuleUser/storeManage/storeList',
                children: [
                    {
                        path: 'storeList',
                        component: () => import('@/views/ModuleUser/storeManage/storeList'), // Parent router-view
                        name: 'storeList',
                        meta: { title: '店铺列表' }
                    },
                    {
                        path: 'storeDetail',
                        component: () => import('@/views/ModuleUser/storeManage/storeDetail'), // Parent router-view
                        name: 'storeDetail',
                        meta: { title: '店铺详情' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'adminManage',
                component: () => import('@/views/ModuleUser/adminManage/index'), // Parent router-view
                name: 'adminManage',
                meta: { title: '管理员管理' },
                redirect: '/ModuleUser/adminManage/adminList',
                children: [
                    {
                        path: 'adminList',
                        component: () => import('@/views/ModuleUser/adminManage/adminList'), // Parent router-view
                        name: 'adminList',
                        meta: { title: '管理员列表' }
                    },
                    // {
                    //     path: 'addAdmin',
                    //     component: () =>
                    //                 import ('@/views/ModuleUser/adminManage/addAdmin'), // Parent router-view
                    //     name: 'addAdmin',
                    //     meta: { title: '添加管理员' }
                    // },
                    {
                        path: 'departmentManage',
                        component: () => import('@/views/ModuleUser/adminManage/departmentManage'), // Parent router-view
                        name: 'departmentManage',
                        meta: { title: '部门管理' }
                    }
                ]
            }
        ]
    }
]

export default ModuleSystem
