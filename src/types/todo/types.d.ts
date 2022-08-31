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

export interface IOj {
  id?: number;
  pid?: number;
  name?: string;
  difficulty?: string;
  ojType?: number;
  type?: string;
  preTime?: number;
  useTime?: number;
  standalone?: string;
  study?: string;
  link?: string;
  createTime?: number;
  updateTime?: number;
  status?: number;
}

export interface IOjUpdate {
  id: number;
  pid?: number | undefined;
  name?: string | undefined;
  difficulty?: string | undefined;
  ojType?: number | undefined;
  type?: string | undefined;
  preTime: number;
  useTime?: number | undefined;
  standalone?: string | undefined;
  study?: string | undefined;
  link?: string | undefined;
  status?: number | undefined;
}
