import { User } from "./user"

export interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
}

export interface LoginParams {
    username: string
    password: string
}

export interface RegisterParams extends LoginParams { }

export interface LoginResponse {
    token: string;
    user: User;
} 