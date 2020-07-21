import request from '@/utils/request'

export const login = (
  data: {
    userName: string;
    password: string;
    phoneNumber: string;
    email: string;
  }) =>
  request({
    url: '/api/user/login',
    method: 'post',
    params: data
  })

export const register = (
  data: {
    userName: string;
    password: string;
    phoneNumber: string;
    email: string;
  }) =>
  request({
    url: '/api/user/register',
    method: 'post',
    params: data
  })

export const logout = () =>
  request({
    url: '/api/user/logout',
    method: 'get'
  })

export const createUrl = (
  data: {
    url: string;
    groupId: number;
  }) =>
  request({
    url: '/api/user/open/todo/url/create',
    method: 'get',
    params: data
  })
