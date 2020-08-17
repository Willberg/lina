import request from '@/utils/request'

// 添加funds
export const apiAddFunds = (
  data: {
    amount: number;
    category: number;
    type: number;
  }) => {
  return request({
    url: '/api/funds/add',
    method: 'post',
    data: data
  })
}

// 更新funds
export const apiUpdateFunds = (
  data: {
    id: number;
    amount?: number;
    category?: number;
    type?: number;
    status?: number;
  }) => {
  return request({
    url: '/api/funds/update',
    method: 'post',
    data: data
  })
}

// 查询月支出列表
export const apiListDisbursements = (
  data: {
    selectedMonth: string;
  }) => {
  return request({
    url: '/api/funds/disbursement/list',
    method: 'get',
    params: data
  })
}

// 查询月收支
export const apiListFunds = (
  data: {
    selectedMonth: string;
  }) => {
  return request({
    url: '/api/funds/list',
    method: 'get',
    params: data
  })
}

// 查询流水
export const apiSearchFunds = (
  data: {
    id: number;
  }) => {
  return request({
    url: '/api/funds/select',
    method: 'get',
    params: data
  })
}
