import request from '@/utils/request'

// 添加cipher
export const apiAddCipher = (
  data: {
    name: string;
    userName?: string;
    email?: string;
    phoneNumber?: string;
    link: string;
  }) => {
  return request({
    url: '/api/cipher/add',
    method: 'post',
    data: data
  })
}

// 更新cipher
export const apiUpdateCipher = (
  data: {
    id: number;
    name?: string;
    userName?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    link?: string;
    status?: number;
  }) => {
  return request({
    url: '/api/cipher/update',
    method: 'post',
    data: data
  })
}

// 查询cipher
export const apiSearchCipher = (
  data: {
    name: string;
  }) => {
  return request({
    url: '/api/cipher/search',
    method: 'get',
    params: data
  })
}
