/* Layout */
import Layout from '@/layout'
const ModuleFinance = [
    {
        path: '/ModuleFinance',
        component: Layout,
        redirect: '/ModuleFinance/ModuleFinance',
        name: 'ModuleFinance',
        meta: {
            title: '财务管理',
            icon: 'qian'
        },
        children: [
            {
                path: 'depositManage',
                component: () => import('@/views/ModuleFinance/depositManage/index'), // Parent router-view
                name: 'depositManage',
                meta: {
                    title: '预存款'
                }
            },
            {
                path: 'settleManage',
                component: () => import('@/views/ModuleFinance/settleManage/index'), // Parent router-view
                name: 'settleManage',
                meta: {
                    title: '结账管理'
                },
                children: [
                    {
                        path: 'settleDetail',
                        component: () => import('@/views/ModuleFinance/settleManage/settleDetail'), // Parent router-view
                        name: 'settleDetail',
                        meta: {
                            title: '平台资金明细'
                        }
                    },
                    {
                        path: 'settleSchedule',
                        component: () => import('@/views/ModuleFinance/settleManage/settleSchedule'), // Parent router-view
                        name: 'settleSchedule',
                        meta: {
                            title: '结算档期'
                        }
                    },
                    {
                        path: 'settleBill',
                        component: () => import('@/views/ModuleFinance/settleManage/settleBill'), // Parent router-view
                        name: 'settleBill',
                        meta: {
                            title: '结算账单'
                        }
                    },
                    {
                        path: 'settleInfo',
                        component: () => import('@/views/ModuleFinance/settleManage/settleInfo'), // Parent router-view
                        name: 'settleInfo',
                        meta: {
                            title: '账单明细'
                        }
                        // hidden: true
                    }
                ]
            },
            {
                path: 'repeatPayList',
                component: () => import('@/views/ModuleFinance/repeatPayList'), // Parent router-view
                name: 'repeatPayList',
                meta: {
                    title: '重复支付列表'
                },
            }
        ]
    }
]

export default ModuleFinance
