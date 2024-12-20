import axios from 'axios'
import type { ApiResponse } from '@/types/api'

import type { Student } from '@/types/student'
import type { LoginParams, RegisterParams, LoginResponse } from '@/types/api'
import { AuthService } from '@/services/auth.service'
import router from '@/router'

// 声明全局变量
declare const __DEV__: boolean
declare const __API_URL__: string

export const api = axios.create({
    baseURL: __API_URL__,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    // 只在开发环境启用
    withCredentials: __DEV__
})

// 请求拦截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // 开发环境打印请求信息
    if (__DEV__) {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        })
    }
    return config
})

// 响应拦截器
api.interceptors.response.use(
    response => {
        if (__DEV__) {
            console.log('API Response:', response.data)
        }
        return response
    },
    error => {
        if (__DEV__) {
            console.error('API Error:', error.response || error)
        }

        if (error.response?.status === 401) {
            AuthService.logout()
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export const studentApi = {
    getList: () => api.get<ApiResponse<Student[]>>('/students'),
    add: (data: Omit<Student, 'id'>) => api.post<ApiResponse<Student>>('/students', data),
    update: (data: Student) => api.put<ApiResponse<void>>(`/students/${data.id}`, data),
    delete: (id: number) => api.delete<ApiResponse<void>>(`/students/${id}`)
}

export const userApi = {
    login: (data: LoginParams) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),
    register: (data: RegisterParams) => api.post<ApiResponse<null>>('/auth/register', data)
} 