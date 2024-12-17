# 学生管理系统

一个基于 Vue 3 + TypeScript + Element Plus 的前端项目，实现学生信息的管理功能。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Axios
- Vue Router
- Pinia

## 功能特性

- 用户认证
  - JWT 登录认证
  - 注册功能
  - 记住密码
  - 自动登录
  - Token 过期处理

- 学生管理
  - 学生列表展示
  - 添加学生
  - 编辑学生信息
  - 删除学生

## 项目结构
```
src/
├── api/ # API 接口
├── router/ # 路由配置
├── services/ # 业务服务
├── mock/ # 模拟数据(已注释)
├── types/ # TypeScript 类型定义
└── views/ # 页面组件

```
## API 接口

### 认证接口

- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册

### 学生管理接口

- GET `/api/students` - 获取学生列表
- POST `/api/students` - 添加学生
- PUT `/api/students/:id` - 更新学生信息
- DELETE `/api/students/:id` - 删除学生