import request from '@/utils/request'

// 添加timer
export const addTimer = (
  data: {
    type: number;
    status: number;
  }) => {
  return request({
    url: '/api/timer/add',
    method: 'post',
    data: data
  })
}

// 更新timer
export const updateTimer = (
  data: {
    id: number;
    type?: number;
    status?: number;
  }) => {
  return request({
    url: '/api/timer/update',
    method: 'post',
    data: data
  })
}

// 查询timer列表
export const listTimer = (
  data: {
    creatTime: number;
  }) => {
  return request({
    url: '/api/timer/list',
    method: 'get',
    params: data
  })
}

// 查询最近的timer
export const searchTimerLastOne = () => {
  return request({
    url: '/api/timer/last/one',
    method: 'get'
  })
}
