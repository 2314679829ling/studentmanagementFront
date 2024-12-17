import { userApi } from '../api'
import type { LoginParams } from '../types/api'
import axios from 'axios'

export class AuthService {
    static async login(credentials: LoginParams) {
        try {
            const response = await userApi.login(credentials)
            const { token } = response.data.data

            // 保存token
            localStorage.setItem('token', token)

            // 设置axios默认headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

            return response.data
        } catch (error) {
            throw error
        }
    }

    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('rememberedCredentials')
        delete axios.defaults.headers.common['Authorization']
    }

    static getToken() {
        return localStorage.getItem('token')
    }

    static isAuthenticated() {
        const token = this.getToken()
        if (!token) return false

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            // 检查token是否在24小时有效期内
            return payload.exp * 1000 > Date.now()
        } catch {
            return false
        }
    }

    static saveCredentials(username: string, password: string) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({ username, password }))
    }

    static getRememberedCredentials() {
        const saved = localStorage.getItem('rememberedCredentials')
        return saved ? JSON.parse(saved) : null
    }

    static clearRememberedCredentials() {
        localStorage.removeItem('rememberedCredentials')
    }




} 