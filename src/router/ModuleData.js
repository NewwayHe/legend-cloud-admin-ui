/* Layout */
import Layout from '@/layout'
const ModuleData = [
    {
        path: '/ModuleData',
        component: Layout,
        redirect: '/ModuleData/reportManage',
        name: 'ModuleData',
        meta: {
            title: '数据管理',
            icon: 'data'
        },
        children: [
            {
                path: 'userData',
                component: () => import('@/views/ModuleData/userData/index'), // Parent router-view
                name: 'userData',
                meta: {
                    title: '用户报表'
                },
                children: [
                    {
                        path: 'userStatistics',
                        component: () => import('@/views/ModuleData/userData/userStatistics'), // Parent router-view
                        name: 'userStatistics',
                        meta: {
                            title: '用户统计'
                        }
                    },
                    {
                        path: 'userTotalStatistics',
                        component: () => import('@/views/ModuleData/userData/userTotalStatistics'), // Parent router-view
                        name: 'userTotalStatistics',
                        meta: {
                            title: '用户数量统计'
                        }
                    },
                    {
                        path: 'userNewStatistics',
                        component: () => import('@/views/ModuleData/userData/userNewStatistics'), // Parent router-view
                        name: 'userNewStatistics',
                        meta: {
                            title: '用户新增统计'
                        }
                    },
                    {
                        path: 'userRanking',
                        component: () => import('@/views/ModuleData/userData/userRanking'), // Parent router-view
                        name: 'userRanking',
                        meta: {
                            title: '用户购买力排行'
                        }
                    }
                ]
            },
            {
                path: 'productData',
                component: () => import('@/views/ModuleData/productData/index'), // Parent router-view
                name: 'productData',
                meta: {
                    title: '商品报表'
                },
                children: [
                    {
                        path: 'productStatistics',
                        component: () => import('@/views/ModuleData/productData/productStatistics'), // Parent router-view
                        name: 'productStatistics',
                        meta: {
                            title: '商品统计'
                        }
                    },
                    {
                        path: 'productSurvey',
                        component: () => import('@/views/ModuleData/productData/productSurvey'), // Parent router-view
                        name: 'productSurvey',
                        meta: {
                            title: '商品概况'
                        }
                    },
                    {
                        path: 'searchSurvey',
                        component: () => import('@/views/ModuleData/productData/searchSurvey'), // Parent router-view
                        name: 'searchSurvey',
                        meta: {
                            title: '搜索概况'
                        }
                    },
                    {
                        path: 'categorySurvey',
                        component: () => import('@/views/ModuleData/productData/categorySurvey'), // Parent router-view
                        name: 'categorySurvey',
                        meta: {
                            title: '类目概况'
                        }
                    }
                ]
            },
            {
                path: 'marketData',
                component: () => import('@/views/ModuleData/marketData/index'), // Parent router-view
                name: 'marketData',
                meta: {
                    title: '营销报表'
                },
                children: [
                    {
                        path: 'mCoupon',
                        component: () => import('@/views/ModuleData/marketData/mCoupon'), // Parent router-view
                        name: 'mCoupon',
                        meta: {
                            title: '活动列表-商家优惠券'
                        }
                    },
                    {
                        path: 'mCouponDetails',
                        component: () => import('@/views/ModuleData/marketData/mCouponDetails'), // Parent router-view
                        name: 'mCouponDetails',
                        meta: {
                            title: '活动详情- 商家优惠券'
                        }
                    },
                    {
                        path: 'pCoupon',
                        component: () => import('@/views/ModuleData/marketData/pCoupon'), // Parent router-view
                        name: 'pCoupon',
                        meta: {
                            title: '活动列表-平台优惠券'
                        }
                    },
                    {
                        path: 'pCouponDetails',
                        component: () => import('@/views/ModuleData/marketData/pCouponDetails'), // Parent router-view
                        name: 'pCouponDetails',
                        meta: {
                            title: '活动详情- 平台优惠券'
                        }
                    }
                ]
            },
            {
                path: 'reportManage',
                component: () => import('@/views/ModuleData/reportManage/index'), // Parent router-view
                name: 'goodsManage',
                meta: {
                    title: '报表管理'
                },
                children: [
                    {
                        path: 'salesVolume',
                        component: () => import('@/views/ModuleData/reportManage/salesVolume'), // Parent router-view
                        name: 'salesVolume',
                        meta: {
                            title: '销售额'
                        }
                    },
                    {
                        path: 'saleAnalys',
                        component: () => import('@/views/ModuleData/reportManage/saleAnalys'), // Parent router-view
                        name: 'saleAnalys',
                        meta: {
                            title: '销售分析'
                        }
                    },
                ]
            },
            {
                path: 'visteManage',
                component: () => import('@/views/ModuleData/visteManage/index'), // Parent router-view
                name: 'visteManage',
                meta: {
                    title: '访问管理'
                },
                children: [
                    {
                        path: 'signHistory',
                        component: () => import('@/views/ModuleData/visteManage/signHistory'), // Parent router-view
                        name: 'signHistory',
                        meta: {
                            title: '用户登录历史'
                        }
                    },
                    {
                        path: 'signHistoryTotal',
                        component: () => import('@/views/ModuleData/visteManage/signHistoryTotal'), // Parent router-view
                        name: 'signHistoryTotal',
                        meta: {
                            title: '用户登录历史统计'
                        }
                    }
                ]
            },
            {
                path: 'pushManage',
                component: () => import('@/views/ModuleData/pushManage/index'), // Parent router-view
                name: 'pushManage',
                meta: {
                    title: '推送管理'
                },
                children: [
                    {
                        path: 'messageHistory',
                        component: () => import('@/views/ModuleData/pushManage/messageHistory'), // Parent router-view
                        name: 'messageHistory',
                        meta: {
                            title: '短信发送历史'
                        }
                    }
                ]
            },
        ]
    }
]

export default ModuleData
