import request from '@/utils/request'

// 增加任务(开放)
export const openAddTodo = (
  data: {
    task: string;
    value?: number;
    priority: number;
  }) =>
  request({
    url: '/api/open/todo/add',
    method: 'post',
    data: data
  })

// 更新任务(开放)
export const openUpdateTodo = (
  token: string,
  data: {
    id: number;
    task?: string;
    priority?: number;
  }) => {
  return request({
    url: '/api/open/todo/update',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data: data
  })
}

// 查询任务列表(开放)
export const openListTodo = (
  token: string
) =>
  request({
    url: '/api/open/todo/list',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }
  })
