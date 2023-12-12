/* Layout */
import Layout from '@/layout'
const ModuleStore = [
    {
        path: '/ModuleStore',
        component: Layout,
        redirect: '/ModuleStore',
        name: 'ModuleStore',
        meta: {
            title: '商城管理',
            icon: 'gouwuche'
        },
        children: [
            {
                path: 'messageManage',
                component: () => import('@/views/ModuleStore/messageManage/index'), // Parent router-view
                name: 'advert',
                meta: { title: '消息管理', icon: 'jiagouyonghu' },
                children: [
                    {
                        path: 'notice',
                        component: () => import('@/views/ModuleStore/messageManage/notice'), // Parent router-view
                        name: 'notice',
                        meta: { title: '公告' }
                    },
                    {
                        path: 'noticeOperate',
                        component: () => import('@/views/ModuleStore/messageManage/notice/noticeOperate'), // Parent router-view
                        name: 'noticeOperate',
                        meta: { title: '编辑公告' },
                        hidden: true
                    },
                    {
                        path: 'news',
                        component: () => import('@/views/ModuleStore/messageManage/news'), // Parent router-view
                        name: 'news',
                        meta: { title: '新闻' },
                        hidden: true
                    },
                    {
                        path: 'newsOperate',
                        component: () => import('@/views/ModuleStore/messageManage/news/newsOperate'), // Parent router-view
                        name: 'newsOperate',
                        meta: { title: '编辑新闻' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'h5Trim',
                component: () => import('@/views/ModuleStore/h5Trim/index'), // Parent router-view
                name: 'h5Trim',
                meta: { title: '移动端装修', icon: 'jiagouyonghu' },
                children: [
                    {
                        path: 'mbTrimIndex',
                        component: () => import('@/views/ModuleStore/h5Trim/mbTrimIndex'), // Parent router-view
                        name: 'mbTrimIndex',
                        meta: { title: '移动端装修' }
                    },
                    {
                        path: 'mobileTrim',
                        component: () => import('@/views/ModuleTrim/h5Trim/index'), // Parent router-view
                        name: 'mobileTrim',
                        meta: { title: '移动端装修' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'feedbackManage',
                component: () => import('@/views/ModuleStore/feedbackManage/index'), // Parent router-view
                name: 'feedbackManage',
                meta: { title: '帮助反馈', icon: 'jiagouyonghu' },
                children: [
                    {
                        path: 'help',
                        component: () => import('@/views/ModuleStore/feedbackManage/help'), // Parent router-view
                        name: 'help',
                        meta: { title: '帮助栏目' }
                    },
                    {
                        path: 'helpArticle',
                        component: () => import('@/views/ModuleStore/feedbackManage/helpArticle'), // Parent router-view
                        name: 'helpArticle',
                        meta: { title: '帮助文章' }
                    },
                    {
                        path: 'helpArticleOperate',
                        component: () => import('@/views/ModuleStore/feedbackManage/helpArticle/helpArticleOperate'), // Parent router-view
                        name: 'helpArticleOperate',
                        meta: { title: '编辑帮助文章' },
                        hidden: true
                    },
                    {
                        path: 'comment',
                        component: () => import('@/views/ModuleStore/feedbackManage/comment'), // Parent router-view
                        name: 'comment',
                        meta: { title: '反馈意见' }
                    }
                ]
            }
        ]
    }
]

export default ModuleStore
