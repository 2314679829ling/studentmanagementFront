<template>
  <div class="login-container">
    <div class="login-box">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input v-model="username" type="text" placeholder="用户名" required />
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="密码" required />
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { userApi } from '@/api'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const isLogin = ref(true)
    const loading = ref(false)
    const rememberPassword = ref(false)

    onMounted(async () => {
      // 检查是否已经登录
      if (AuthService.isAuthenticated()) {
        router.push('/student')
        return
      }

      // 检查是否有保存的凭证
      const savedCredentials = AuthService.getRememberedCredentials()
      if (savedCredentials) {
        username.value = savedCredentials.username
        password.value = savedCredentials.password
        rememberPassword.value = true
      }
    })

    const handleSubmit = async () => {
      if (loading.value) return
      loading.value = true

      try {
        if (isLogin.value) {
          await AuthService.login({
            username: username.value,
            password: password.value
          })

          if (rememberPassword.value) {
            AuthService.saveCredentials(username.value, password.value)
          } else {
            AuthService.clearRememberedCredentials()
          }

          router.push('/student')
        } else {
          await userApi.register({
            username: username.value,
            password: password.value
          })
          ElMessage.success('注册成功，请登录')
          isLogin.value = true
          username.value = ''
          password.value = ''
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
      username.value = ''
      password.value = ''
      rememberPassword.value = false
    }

    return {
      username,
      password,
      isLogin,
      loading,
      rememberPassword,
      handleSubmit,
      toggleMode
    }
  }
})
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
</style>