import axios from 'axios'
import type { ApiResponse } from '@/types/api'

import type { Student } from '@/types/student'
import type { LoginParams, RegisterParams, LoginResponse } from '@/types/api'
import { AuthService } from '@/services/auth.service'
import router from '@/router'

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // token过期或无效，清除token并重定向到登录页
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