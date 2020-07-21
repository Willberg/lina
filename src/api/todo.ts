import request from '@/utils/request'

// 批量增加任务
export const patchAddTodo = (
  data: {
    maxTime: number;
    minPriority: number;
    todoList: {
      task: string;
      value: number;
      estimateTime: number;
      priority: number;
    };
  }) =>
  request({
    url: '/api/todo/patch/add',
    method: 'post',
    params: data
  })

// 更新任务
export const updateTodo = (
  data: {
    id: number;
    task: string;
    estimateTime: number;
    realityTime: number;
    priority: number;
    status: number;
  }) => {
  return request({
    url: '/api/todo/update',
    method: 'post',
    params: data
  })
}

// 查询任务组列表
export const listTodoGroup = (
  data: {
    offset: number;
    count: number;
    timeMillis: number;
    sort: string;
  }) =>
  request({
    url: '/api/todo/group/list',
    method: 'get',
    params: data
  })

// 查询任务列表
export const listTodo = (
  data: {
    groupId: number;
  }) =>
  request({
    url: '/api/todo/list',
    method: 'get',
    params: data
  })
