import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: 'https://acgv.fun',
  // baseURL: 'http://localhost:8081',
  withCredentials: true,
  timeout: 50 * 1000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (!res.status) {
      if (res.code === 'user.0002') {
        MessageBox.confirm(
          res.message,
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 重新登录，要清除vuex
          UserModule.setUser(undefined)
          if (!location.hash.endsWith('login') && !location.hash.endsWith('logout')) {
            // 防止todoList页面死循环
            location.hash = '#/login'
            // location.replace('/')
          }
          // location.reload() // To prevent bugs from vue-router
        })
        return Promise.reject(new Error('Error'))
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    if (error.message !== 'Error') {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
