import Layout from '@/layout'

const ModuleOrder = [
    {
        path: '/ModuleOrder',
        component: Layout,
        redirect: '/ModuleOrder/orderList',
        name: 'ModuleOrder',
        meta: {
            title: '订单管理',
            icon: 'shuju'
        },
        children: [
            {
                path: 'orderList',
                component: () => import('@/views/ModuleOrder/orderList'),
                name: 'orderList',
                meta: { title: '订单列表' }
            },
            {
                path: 'orderDetail',
                component: () => import('@/views/ModuleOrder/orderList/orderDetail'),
                name: 'orderDetail',
                meta: { title: '订单详情' },
                hidden: true
            },
            {
                path: 'serviceOrderList',

                component: () => import('@/views/ModuleOrder/serviceOrderList'),
                name: 'serviceOrderList',
                meta: { title: '售后订单列表' }
            },
            {
                path: 'refuseDetail',
                component: () => import('@/views/ModuleOrder/serviceOrderList/refuseDetail'),
                name: 'refuseDetail',
                meta: { title: '售后订单详情' },
                hidden: true
            },
            {
                path: 'shopApplicationDetail',
                component: () => import('@/views/ModuleOrder/serviceOrderList/shopApplicationDetail'),
                name: 'shopApplicationDetail',
                meta: { title: '商家申请售后订单详情' },
                hidden: true
            },
            {
                path: 'commentList',
                component: () => import('@/views/ModuleOrder/commentList'),
                name: 'commentList',
                meta: { title: '评论列表' }
            },
            {
                path: 'commentDetail',
                component: () => import('@/views/ModuleOrder/commentList/commentDetails'),
                name: 'commentDetail',
                meta: { title: '评论详情' },
                hidden: true
            }
        ]
    }
]

export default ModuleOrder
