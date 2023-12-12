/* Layout */
import Layout from '@/layout'
const ModuleGoods = [
    {
        path: '/ModuleGoods',
        component: Layout,
        redirect: '/ModuleGoods/goodsManage',
        name: 'ModuleGoods',
        meta: {
            title: '商品管理',
            icon: 'shangpin'
        },
        children: [
            // 商品管理start
            {
                path: 'GoodsManage',
                component: () => import('@/views/ModuleGoods/GoodsManage/index'), // Parent router-view
                name: 'GoodsManage',
                meta: { title: '商品管理' },
                children: [
                    {
                        path: 'list',
                        component: () => import('@/views/ModuleGoods/GoodsManage/list'), // Parent router-view
                        name: 'list',
                        meta: { title: '商品列表' }
                    },
                    {
                        path: 'aduitList',
                        component: () => import('@/views/ModuleGoods/GoodsManage/aduitList'), // Parent router-view
                        name: 'aduitList',
                        meta: { title: '商品审核列表' }
                    },
                    {
                        path: 'violationsGood',
                        component: () => import('@/views/ModuleGoods/GoodsManage/violationsGood'), // Parent router-view
                        name: 'violationsGood',
                        meta: { title: '违规商品' }
                    },
                    {
                        path: 'goodsRecoveryList',
                        component: () => import('@/views/ModuleGoods/GoodsManage/goodsRecoveryList'), // Parent router-view
                        name: 'goodsRecoveryList',
                        meta: { title: '商品回收站' }
                    },
                    {
                        path: 'report',
                        component: () => import('@/views/ModuleGoods/GoodsManage/report'), // Parent router-view
                        name: 'goodsManageReport',
                        meta: { title: '商品举报' }
                    },
                    {
                        path: 'reportType',
                        component: () => import('@/views/ModuleGoods/GoodsManage/reportType/index'), // Parent router-view
                        name: 'reportType',
                        meta: { title: '商品举报类型' }
                    }
                ]
            },
            // 商品管理end

            //属性管理start
            {
                path: 'AttributeManage',
                component: () => import('@/views/ModuleGoods/AttributeManage/index'), // Parent router-view
                name: 'AttributeManage',
                meta: {
                    title: '属性管理'
                },
                children: [
                    {
                        path: 'specifications',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specifications'), // Parent router-view
                        name: 'specifications',
                        meta: { title: '规格管理' }
                    },
                    {
                        path: 'speOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specifications/speOperate'), // Parent router-view
                        name: 'speOperate',
                        meta: { title: '新增规格' },
                        hidden: true
                    },
                    {
                        path: 'params',
                        component: () => import('@/views/ModuleGoods/AttributeManage/params'), // Parent router-view
                        name: 'params',
                        meta: { title: '参数管理' }
                    },
                    {
                        path: 'paramsOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/params/paramsOperate'), // Parent router-view
                        name: 'paramsOperate',
                        meta: { title: '新增参数', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'paramsGroup',
                        component: () => import('@/views/ModuleGoods/AttributeManage/paramsGroup'), // Parent router-view
                        name: 'paramsGroup',
                        meta: { title: '参数组管理' }
                    },
                    {
                        path: 'commodityCategory',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory'), // Parent router-view
                        name: 'commodityCategory',
                        meta: { title: '商品类目' }
                    },
                    {
                        path: 'categoryDetail/:id',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory/categoryDetail'), // Parent router-view
                        name: 'categoryDetail',
                        meta: { title: '查看商品类目', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'categoryOperate',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityCategory/categoryOperate'), // Parent router-view
                        name: 'categoryOperate',
                        meta: { title: '编辑商品类目', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'goodReative',
                        component: () => import('@/views/ModuleGoods/AttributeManage/goodReative'), // Parent router-view
                        name: 'goodReative',
                        meta: { title: '商品分组' }
                    },
                    {
                        path: 'groupDetail',
                        component: () => import('@/views/ModuleGoods/AttributeManage/goodReative/groupDetail'), // Parent router-view
                        name: 'groupDetail',
                        meta: { title: '查看关联商品', noCache: true },
                        hidden: true
                    },
                    // {
                    //     path: 'commodityGroup',
                    //     component: () =>
                    //         import ('@/views/ModuleGoods/AttributeManage/commodityGroup'), // Parent router-view
                    //     name: 'commodityGroup',
                    //     meta: { title: '商品分组' }
                    // },
                    {
                        path: 'commodityBrand',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityBrand'), // Parent router-view
                        name: 'commodityBrand',
                        meta: { title: '商品品牌' }
                    },
                    {
                        path: 'commodityBrandDetail',
                        component: () => import('@/views/ModuleGoods/AttributeManage/commodityBrand/commodityBrandDetail'), // Parent router-view
                        name: 'commodityBrandDetail',
                        meta: { title: '查看关联商品', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'specificationParamsGroup',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specificationParamsGroup'), // Parent router-view
                        name: 'specificationParamsGroup',
                        meta: { title: '规格参数分组' }
                    },
                    {
                        path: 'speParGroupDetail/:id',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specificationParamsGroup/speParGroupDetail'), // Parent router-view
                        name: 'speParGroupDetail',
                        meta: { title: '规格参数分组详情', noCache: true },
                        hidden: true
                    },
                    {
                        path: 'speParaGroupOper',
                        component: () => import('@/views/ModuleGoods/AttributeManage/specificationParamsGroup/speParaGroupOper'), // Parent router-view
                        name: 'speParaGroupOper',
                        meta: { title: '新增规格参数分组', noCache: true },
                        hidden: true
                    }
                ]
            }
        ]
    }
    //打印发票
    // {
    //     path: 'orderPrint',
    //     component: () => import('@/views/ModuleGoods/orderManage/orderList/orderPrint'),
    //     name: 'orderPrint',
    //     meta: { title: '打印发票' },
    //     hidden: true
    // }
]

export default ModuleGoods
