import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

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
    if (res.status) {
      return res
    }

    if (res.code === 'user.0002') {
      if (location.hash === '#/') {
        return res
      }

      if (location.hash.endsWith('login')) {
        Message({
          message: '用户名或密码错误',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        MessageBox.confirm(
          res.message,
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 防止todoList页面死循环
          location.hash = '#/login'
        }).catch(() => {
          location.hash = '#/'
        })
      }
    } else {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
