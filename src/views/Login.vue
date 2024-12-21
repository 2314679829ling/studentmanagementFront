<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input 
            v-model="formData.username" 
            type="text" 
            placeholder="用户名" 
            @input="handleUsernameInput"
            required 
          />
        </div>
        <div class="form-group">
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="密码" 
            @input="validatePassword"
            required 
          />
          <div v-if="!isLogin && passwordError" class="error-message">
            {{ passwordError }}
          </div>
        </div>
        <div v-if="isLogin" class="remember-password">
          <label>
            <input type="checkbox" v-model="rememberPassword"> 记住密码
          </label>
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          {{ isLogin ? '登录' : '注册' }}
        </button>
        <div class="toggle-mode">
          <a href="#" @click.prevent="toggleMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { userApi } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const isLogin = ref(true)
const rememberPassword = ref(false)
const passwordError = ref('')

// 使用响应式对象管理表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 处理用户名输入，去除首尾空格
const handleUsernameInput = () => {
  formData.username = formData.username.trim()
}

// 验证密码
const validatePassword = () => {
  // 移除密码中的空格
  if (formData.password.includes(' ')) {
    formData.password = formData.password.replace(/\s/g, '')
  }

  if (!isLogin.value) {
    if (formData.password.length < 4) {
      passwordError.value = '密码不能少于4位'
    } else {
      passwordError.value = ''
    }
  }
}

const handleSubmit = async () => {
  if (loading.value) return
  
  // 注册时的密码验证
  if (!isLogin.value) {
    if (formData.password.length < 4) {
      ElMessage.error('密码不能少于4位')
      return
    }
  }

  // 确保密码不含空格
  formData.password = formData.password.replace(/\s/g, '')

  loading.value = true

  try {
    if (isLogin.value) {
      await AuthService.login({
        username: formData.username.trim(),
        password: formData.password 
      })

      if (rememberPassword.value) {
        AuthService.saveCredentials(formData.username.trim(), formData.password)
      } else {
        AuthService.clearRememberedCredentials()
      }

      router.push('/student')
    } else {
      const response = await userApi.register({
        username: formData.username.trim(),
        password: formData.password // 已经移除空格，不需要再trim
      })

      if (response.data.code === 200) {
        ElMessage.success('注册成功，请登录')
        isLogin.value = true
        formData.username = ''
        formData.password = ''
      } else {
        ElMessage.error(response.data.message || '注册失败')
      }
    }
  } catch (error: any) {
    const message = error.response?.data?.message || (isLogin.value ? '登录失败' : '注册失败')
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formData.username = ''
  formData.password = ''
  rememberPassword.value = false
  passwordError.value = ''
}

// 初始化时检查记住的凭证
const initSavedCredentials = () => {
  const savedCredentials = AuthService.getRememberedCredentials()
  if (savedCredentials) {
    formData.username = savedCredentials.username
    formData.password = savedCredentials.password
    rememberPassword.value = true
  }
}

// 检查是否已登录
if (AuthService.isAuthenticated()) {
  router.push('/student')
} else {
  initSavedCredentials()
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-box {
  width: 360px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #409eff;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 16px;
}

.login-button:not(:disabled):hover {
  background-color: #66b1ff;
}

.login-button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
}

.toggle-mode a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.toggle-mode a:hover {
  color: #66b1ff;
}

.remember-password {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.remember-password input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
  cursor: pointer;
}

.remember-password label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
}
</style>