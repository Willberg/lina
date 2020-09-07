import request from '@/utils/request'
import { IPatchAddTodo } from "@/types/todo/types";

// 批量增加任务
export const patchAddTodo = (
  data: {
    groupId?: number;
    maxTime?: number;
    minPriority?: number;
    todoList: Array<IPatchAddTodo>;
  }) =>
  request({
    url: '/api/todo/patch/add',
    method: 'post',
    data: data
  })

// 更新任务
export const updateTodo = (
  data: {
    id: number;
    task?: string;
    estimateTime?: number;
    realityTime?: number;
    priority?: number;
    status?: number;
  }) => {
  return request({
    url: '/api/todo/update',
    method: 'post',
    data: data
  })
}

// 更新任务
export const updateTodoGroup = (
  data: {
    id: number;
    maxTime?: number;
    minPriority?: number;
    isPrivate?: boolean;
  }) => {
  return request({
    url: '/api/todo/group/update',
    method: 'post',
    data: data
  })
}

// 查询任务组列表
export const listTodoGroup = (
  data: {
    offset?: number;
    count?: number;
    status?: number;
    startTime?: number;
    endTime?: number;
    sort?: string;
  }) =>
  request({
    url: '/api/todo/group/list',
    method: 'get',
    params: data
  })

// 查询任务组总数
export const countTodoGroup = (
  data: {
    status?: number;
    startTime?: number;
    endTime?: number;
  }
) =>
  request({
    url: '/api/todo/group/total',
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
