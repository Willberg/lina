import { ITodo, ITodoGroup } from "@/types/todo/types";

export const statusGroup = [
  { label: '初始', value: 1 },
  { label: '等待', value: 10 },
  { label: '处理中', value: 20 },
  { label: '删除', value: 50 },
  { label: '完成', value: 100 }
]

export const priorities = [
  { label: '重要且紧急-1', value: 1 },
  { label: '重要且紧急-2', value: 2 },
  { label: '重要且紧急-3', value: 3 },
  { label: '紧急不重要-1', value: 4 },
  { label: '紧急不重要-2', value: 5 },
  { label: '紧急不重要-3', value: 6 },
  { label: '重要不紧急-1', value: 7 },
  { label: '重要不紧急-2', value: 8 },
  { label: '重要不紧急-3', value: 9 },
  { label: '既不重要也不紧急', value: 10 }
]

export const todoGroupPriorities = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 }
]

// home页面，todoList页面与Nav组件数据通信
export const todoGroupList: ITodoGroup[] = []
export const todoList: ITodo[] = []

export const statusArray = ['1', '10', '20', '50', '100']
export const filterArray = [
  { text: '初始', value: '1' },
  { text: '等待', value: '10' },
  { text: '处理中', value: '20' },
  { text: '删除', value: '50' },
  { text: '完成', value: '100' }
]
