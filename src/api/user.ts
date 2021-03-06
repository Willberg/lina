import request from '@/utils/request'

export const login = (
  data: {
    userName?: string;
    password: string;
    phoneNumber?: string;
    email?: string;
  }) =>
  request({
    url: '/api/user/login',
    method: 'post',
    data: data
  })

export const getUser = () =>
  request({
    url: '/api/user/profile',
    method: 'get'
  })

export const register = (
  data: {
    userName: string;
    password: string;
    phoneNumber?: string;
    email?: string;
  }) =>
  request({
    url: '/api/user/register',
    method: 'post',
    data: data
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

export const updatePassword = (
  data: {
    oldPassword: string;
    newPassword: string;
  }) =>
  request({
    url: '/api/user/password/change',
    method: 'post',
    data: data
  })
