export interface ITodoGroup {
  id: number
  createTime: number
  totalValue: number
  finishValue: number
  totalTime: number
  maxTime: number
  minPriority: number
  updateDateTime: string
  status: string
}

export interface ITodo {
  id: number
  groupId: number
  cp: string
  createDate: string
  task: string
  value: number
  estimateTime: number
  realityTime: number
  updateDateTime: string
  priority: number
  status: number
}

export interface IRetTodo {
  id: number
  task: string
  value: number
  estimateTime: number
  realityTime: number
  groupId: number
  createTime: number
  updateTime: number
  priority: number
  status: number
}

export interface IPatchAddTodo {
  task: string;
  value: number;
  estimateTime: number;
  priority: number;
}
