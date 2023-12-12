/* Layout */
import Layout from '@/layout'
const ModuleMarketing = [
    {
        path: '/ModuleMarketing',
        component: Layout,
        redirect: '/ModuleMarketing/shopActivity',
        name: 'ModuleMarketing',
        meta: {
            title: '营销管理',
            icon: 'shuju'
        },
        children: [
			{
			    path: 'marketing',
			    component: () => import('@/views/ModuleMarketing/marketing'),
			    name: 'marketing',
			    meta: {
			        title: '营销广场'
			    }
			},
			{
                path: 'shopActivity',
                component: () => import('@/views/ModuleMarketing/shopActivity/index'),
                name: 'shopActivity',
                meta: {
                    title: '店铺活动'
                },
                children: [
                    {
                        path: 'coupon',
                        component: () => import('@/views/ModuleMarketing/shopActivity/coupon'),
                        name: 'coupon',
                        meta: {
                            title: '优惠券'
                        }
                    },
                    {
                        path: 'couponDetail',
                        component: () => import('@/views/ModuleMarketing/shopActivity/coupon/couponDetail'),
                        name: 'couponDetail',
                        meta: {
                            title: '优惠券详情'
                        },
                        hidden: true
                    },
                    {
                        path: 'couponData',
                        component: () => import('@/views/ModuleMarketing/shopActivity/coupon/couponData'),
                        name: 'couponData',
                        meta: {
                            title: '优惠券报表'
                        },
                        hidden: true
                    }
                ]
            },
            {
                path: 'platformActivity',
                component: () => import('@/views/ModuleMarketing/platformActivity/index'),
                name: 'platformActivity',
                meta: {
                    title: '平台活动'
                },
                children: [
                    {
                        path: 'red',
                        component: () => import('@/views/ModuleMarketing/platformActivity/red'),
                        name: 'red',
                        meta: {
                            title: '平台红包'
                        }
                    },
                    {
                        path: 'redDetail',
                        component: () => import('@/views/ModuleMarketing/platformActivity/red/redDetail'),
                        name: 'redDetail',
                        meta: {
                            title: '查看平台红包'
                        },
                        hidden: true
                    },
                    {
                        path: 'redAdd',
                        component: () => import('@/views/ModuleMarketing/platformActivity/red/redAdd'),
                        name: 'redAdd',
                        meta: {
                            title: '新增红包'
                        },
                        hidden: true
                    },
                    {
                        path: 'redData',
                        component: () => import('@/views/ModuleMarketing/platformActivity/red/redData'),
                        name: 'redData',
                        meta: {
                            title: '优惠券报表'
                        },
                        hidden: true
                    }
                ]
            },
            {
                path: 'popupAdvert',
                component: () => import('@/views/ModuleMarketing/popupAdvert/index'),
                name: 'popupAdvert',
                meta: {
                    title: '弹窗广告'
                },
                children:[
                    {
                        path: 'popupAdvertData',
                        component: () => import('@/views/ModuleMarketing/popupAdvert/popupAdvertData'), // Parent router-view
                        name: 'popupAdvertData',
                        meta: {
                            title: '弹窗广告列表'
                        }
                    },
                    {
                        path: 'popupAdvertDetails',
                        component: () => import('@/views/ModuleMarketing/popupAdvert/popupAdvertDetails'), // Parent router-view
                        name: 'popupAdvertDetails',
                        meta: {
                            title: '弹窗广告详情'
                        }
                    },
                    {
                        path: 'popupAdvertChart',
                        component: () => import('@/views/ModuleMarketing/popupAdvert/popupAdvertChart'), // Parent router-view
                        name: 'popupAdvertChart',
                        meta: {
                            title: '弹窗广告数据'
                        }
                    },
                ]
                
            },
        ]
    }
]

export default ModuleMarketing
