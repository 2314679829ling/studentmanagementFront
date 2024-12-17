import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import StudentManagement from '../views/StudentManagement.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/student',
            name: 'student',
            component: StudentManagement,
            meta: { requiresAuth: true }
        },
        {
            path: '/students',
            redirect: '/student'
        }
    ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth) {
        if (!token) {
            // 没有token，重定向到登录页
            next('/login')
            return
        }

        // 验证token是否过期
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const isExpired = payload.exp * 1000 < Date.now()

            if (isExpired) {
                // token过期，清除并重定向到登录页
                localStorage.removeItem('token')
                next('/login')
                return
            }
        } catch (e) {
            // token解析失败，清除并重定向到登录页
            localStorage.removeItem('token')
            next('/login')
            return
        }
    }

    // 如果已登录且访问登录页，重定向到首页
    if (to.path === '/login' && token) {
        next('/student')
        return
    }

    next()
})

export default router 