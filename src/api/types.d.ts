export interface ITodoGroup {
  id: number
  createDate: string
  totalValue: number
  totalTime: number
  maxTime: number
  minPriority: number
  updateDateTime: string
  status: string
}

export interface ITodo {
  id: number
  groupId: number
  createDate: string
  simpleTask: string
  task: string
  value: number
  estimateTime: number
  updateDateTime: string
  priority: string
  status: string
}

export interface IRetTodo {
  id: number
  task: string
  value: number
  estimateTime: number
  groupId: number
  createTime: number
  updateTime: number
  priority: number
  status: number
}
