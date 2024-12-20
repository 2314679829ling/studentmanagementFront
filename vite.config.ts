import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// 环境变量配置
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    define: {
      // 注入全局变量
      __DEV__: JSON.stringify(isDev),
      __API_URL__: JSON.stringify(isDev ? 'http://localhost:8080/api' : '/api')
    },
    server: {
      proxy: isDev ? {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      } : undefined
    }
  }
})
