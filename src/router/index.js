import {createRouter, createWebHashHistory} from 'vue-router'

import store from "@/store";

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/projects',
        name: 'projects',
        component: () => import('../views/Projects.vue')
    },
    {
        path: '/home',
        name: 'home',
        redirect: '/project',
        component: () => import('../views/Home.vue'),
        // 子路由
        children: [{
            path: '/project',
            name: 'project',
            component: () => import('../views/project/Project.vue'),
            meta: {
                title: '项目首页'
            }
        },
            {
                path: '/bug',
                name: 'bug',
                component: () => import('../views/project/Bug.vue'),
                meta: {
                    title: 'Bug管理'
                }
            },
            {
                path: '/env',
                name: 'env',
                component: () => import('../views/project/Env.vue'),
                meta: {
                    title: '测试环境'
                }
            },
            {
                path: '/manager',
                name: 'manager',
                component: () => import('../views/project/Manager.vue'),
                meta: {
                    title: '接口管理'
                }
            },
            {
                path: '/plan',
                name: 'plan',
                component: () => import('../views/project/Plan.vue'),
                meta: {
                    title: '测试计划'
                }
            },
            {
                path: '/scenario',
                name: 'scenario',
                component: () => import('../views/project/Scenario.vue'),
                meta: {
                    title: '测试场景'
                }
            },
            {
                path: '/statement',
                name: 'statement',
                component: () => import('../views/project/Statement.vue'),
                meta: {
                    title: '测试报表'
                }
            },
            {
                path: '/task',
                name: 'task',
                component: () => import('../views/project/Task.vue'),
                meta: {
                    title: '定时任务'
                }
            },
            {
                path: '/test',
                name: 'test',
                component: () => import('../views/project/Test.vue'),
                meta: {
                    title: '接口测试'
                }
            },

        ]

    },

]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


// 设置路由导航守卫
router.beforeEach(async (to, from) => {
    const isAuthenticated = window.sessionStorage.getItem("token")
    if (
        // 检查用户是否已登录
        !isAuthenticated &&
        // ❗️ 避免无限重定向
        to.name !== 'login'
    ) {
        // 将用户重定向到登录页面
        return {name: 'login'}
    }

    if (to.meta.title) {
        store.commit("addHistoryTags", to)
    }
})


export default router
