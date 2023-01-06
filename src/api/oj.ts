import request from '@/utils/request'

export const add = (
  data: {
    pid: number;
    name: string;
    difficulty: string;
    ojType: number;
    type: string;
    preTime: number;
    link: string;
    importance: number;
  }) => request({
  url: '/api/oj/add',
  method: 'post',
  data: data
})

export const update = (
  data: {
    id: number;
    pid?: number;
    name?: string;
    difficulty?: string;
    ojType?: number;
    type?: string;
    preTime: number;
    useTime?: number;
    standalone?: string;
    study?: string;
    link?: string;
    ansLink?: string;
    importance?: number;
    createTime?: number;
    status?: number;
  }) => request({
  url: '/api/oj/update',
  method: 'post',
  data: data
})

export const list = (
  data: {
    pid?: number;
    begin?: number;
    end?: number;
    offset: number;
    count: number;
  }) => request({
  url: '/api/oj/list',
  method: 'get',
  params: data
})

export const count = (
  data: {
    pid?: number;
    begin?: number;
    end?: number;
  }) => request({
  url: '/api/oj/count',
  method: 'get',
  params: data
})
