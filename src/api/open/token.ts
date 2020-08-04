import request from '@/utils/request'

// 增加任务(开放)
export const openFreshToken = (token: string) =>
  request({
    url: '/api/open/token/refresh',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }
  })
