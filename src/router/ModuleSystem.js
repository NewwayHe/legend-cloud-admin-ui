/* Layout */
import Layout from '@/layout'
const ModuleSystem = [
    {
        path: '/ModuleSystem',
        component: Layout,
        redirect: '/ModuleSystem/baseSet',
        name: 'ModuleSystem',
        meta: {
            title: '系统设置',
            icon: 'setting'
        },
        children: [
            {
                path: 'menuAuthManage',
                component: () => import('@/views/ModuleSystem/menuAuthManage/index'), // Parent router-view
                name: 'menuAuthManage',
                meta: { title: '权限管理' },
                children: [
                    {
                        path: 'menuManagePla',
                        component: () => import('@/views/ModuleSystem/index'), // Parent router-view
                        name: 'menuManagePla',
                        meta: { title: '平台菜单管理' },
                        children: [
                            {
                                path: 'menuManagePla',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManagePla'), // Parent router-view
                                name: 'menuManagePla',
                                meta: { title: '平台菜单' }
                            },
                            {
                                path: 'plaRole',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManagePla/plaRole'), // Parent router-view
                                name: 'plaRole',
                                meta: { title: '平台角色' }
                            }
                        ]
                    },
                    {
                        path: 'menuManageShop',
                        component: () => import('@/views/ModuleSystem/menuAuthManage/index'), // Parent router-view
                        name: 'menuManageShop',
                        meta: { title: '商家菜单管理' },
                        children: [
                            {
                                path: 'menuShop',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManageShop'), // Parent router-view
                                name: 'menuShop',
                                meta: { title: '商家菜单' }
                            },
                            {
                                path: 'shopRole',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManageShop/shopRole'), // Parent router-view
                                name: 'shopRole',
                                meta: { title: '商家角色' }
                            }
                        ]
                    },
                    {
                        path: 'menuManageUser',
                        component: () => import('@/views/ModuleSystem/menuAuthManage/index'), // Parent router-view
                        name: 'menuManageUser',
                        meta: { title: '用户菜单管理' },
                        children: [
                            {
                                path: 'userShop',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManageUser'), // Parent router-view
                                name: 'userShop',
                                meta: { title: '用户菜单' }
                            },
                            {
                                path: 'userRole',
                                component: () => import('@/views/ModuleSystem/menuAuthManage/menuManageUser/userRole'), // Parent router-view
                                name: 'userRole',
                                meta: { title: '用户角色' }
                            }
                        ]
                    }
                ]
            },
            {
                path: 'baseSet',
                component: () => import('@/views/ModuleSystem/baseSet/baseSet.vue'), // Parent router-view
                name: 'baseSet',
                meta: { title: '基本设置' },
            },
            {
                path: 'deliveryManage',
                component: () => import('@/views/ModuleSystem/deliveryManage/index'), // Parent router-view
                name: 'deliveryManage',
                meta: { title: '配送管理' },
                children: [
                    {
                        path: 'areaManage',
                        component: () => import('@/views/ModuleSystem/deliveryManage/areaManage'), // Parent router-view
                        name: 'areaManage',
                        meta: { title: '地区管理' }
                    },
                    {
                        path: 'logisticsCompany',
                        component: () => import('@/views/ModuleSystem/deliveryManage/logisticsCompany'), // Parent router-view
                        name: 'logisticsCompany',
                        meta: { title: '物流公司' }
                    }
                ]
            },
            {
                path: 'agreeManage',
                component: () => import('@/views/ModuleSystem/agreeManage/index'), // Parent router-view
                name: 'agreeManage',
                meta: { title: '协议管理' }
            },
            {
                path: 'industry',
                component: () => import('@/views/ModuleSystem/industry'), // Parent router-view
                name: 'industry',
                meta: { title: '行业管理' }
            },
            {
                path: 'systemManage',
                component: () => import('@/views/ModuleSystem/systemManage/index'), // Parent router-view
                name: 'systemManage',
                meta: { title: '系统管理' },
                children: [
                    {
                        path: 'dataDict',
                        component: () => import('@/views/ModuleSystem/systemManage/dataDict'), // Parent router-view
                        name: 'dataDict',
                        meta: { title: '数据字典' }
                    },
                    {
                        path: 'record',
                        component: () => import('@/views/ModuleSystem/systemManage/record'), // Parent router-view
                        name: 'record',
                        meta: { title: '系统日志' }
                    },
                    {
                        path: 'keyword',
                        component: () => import('@/views/ModuleSystem/systemManage/keyword'), // Parent router-view
                        name: 'keyword',
                        meta: { title: '关键字屏蔽' }
                    }
                ]
            },
            {
                path: 'materialCentre',
                component: () => import('@/views/ModuleSystem/materialCentre'), // Parent router-view
                name: 'materialCentre',
                meta: { title: '素材中心' }
            }
        ]
    }
]

export default ModuleSystem
