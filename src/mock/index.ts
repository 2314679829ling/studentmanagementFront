// import Mock from 'mockjs'
// import type { Student } from '../types/student'
// import type { User } from '../types/user'

// // 模拟延迟
// Mock.setup({
//     timeout: '300-600'
// })

// // 学生数据
// let students: Student[] = [
//     { id: 1, name: '张三', age: 18, grade: '高一', className: '1班' },
//     { id: 2, name: '李四', age: 17, grade: '高一', className: '2班' }
// ]

// // 用户数据
// let users: User[] = [
//     { username: 'admin', password: '123456' }
// ]

// // 模拟学生列表接口
// Mock.mock(/^\/api\/students$/, 'get', () => {
//     return {
//         code: 200,
//         data: students,
//         message: '获取成功'
//     }
// })

// // 模拟添加学生接口
// Mock.mock(/^\/api\/students$/, 'post', (options: any) => {
//     const student = JSON.parse(options.body)
//     const newStudent = {
//         ...student,
//         id: students.length + 1
//     }
//     students.push(newStudent)
//     return {
//         code: 200,
//         data: newStudent,
//         message: '添加成功'
//     }
// })

// // 模拟更新学生接口
// Mock.mock(/^\/api\/students\/\d+$/, 'put', (options: any) => {
//     const student = JSON.parse(options.body)
//     const index = students.findIndex(s => s.id === student.id)
//     if (index !== -1) {
//         students[index] = student
//     }
//     return {
//         code: 200,
//         data: null,
//         message: '更新成功'
//     }
// })

// // 模拟删除学生接口
// Mock.mock(/^\/api\/students\/\d+$/, 'delete', (options: any) => {
//     const id = parseInt(options.url.match(/\/students\/(\d+)/)?.[1] || '0')
//     students = students.filter(s => s.id !== id)
//     return {
//         code: 200,
//         data: null,
//         message: '删除成功'
//     }
// })

// // 模拟登录接口
// Mock.mock(/^\/api\/login$/, 'post', (options: any) => {
//     const { username, password } = JSON.parse(options.body)
//     const user = users.find(u => u.username === username && u.password === password)
//     if (user) {
//         return {
//             code: 200,
//             data: { username: user.username },
//             message: '登录成功'
//         }
//     }
//     return {
//         code: 401,
//         data: null,
//         message: '用户名或密码错误'
//     }
// })

// // 模拟注册接口
// Mock.mock(/^\/api\/register$/, 'post', (options: any) => {
//     const user = JSON.parse(options.body)
//     if (users.some(u => u.username === user.username)) {
//         return {
//             code: 400,
//             data: null,
//             message: '用户名已存在'
//         }
//     }
//     users.push(user)
//     return {
//         code: 200,
//         data: null,
//         message: '注册成功'
//     }
// }) 