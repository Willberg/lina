import { IRetTodo, ITodo } from "@/types/todo/types";
import moment from "moment";

export const calCp = (v: IRetTodo, k: number | string) => {
  let cp = ((v.value || 100) / (v.estimateTime || 1)).toFixed(4)
  if (k === '100' || k === 100) {
    cp = (v.value / v.realityTime).toFixed(4)
  }
  return cp
}

export const handleTodoList = (result: any, todoList: ITodo[], isAdd?: boolean) => {
  if (result.status) {
    let needClear = isAdd === undefined || !isAdd
    let todoMap: Map<number, ITodo> = new Map<number, ITodo>()
    if (needClear) {
      // 拉取数据时要清空原来的数据
      todoList.splice(0, todoList.length)
    } else {
      for (let t of todoList) {
        todoMap.set(t.id, t)
      }
      todoList.splice(0, todoList.length)
    }

    result.data.forEach((v: IRetTodo) => {
      let todo = convertToTodo(v)
      if (needClear) {
        todoList.push(todo)
      } else {
        // 更新或添加
        todoMap.set(todo.id, todo)
      }
    })
    for (let key of todoMap.keys()) {
      let t = todoMap.get(key)
      if (t !== undefined) {
        todoList.push(t)
      }
    }
  }
}

export const convertToTodo = (v: any) => {
  let cp = calCp(v, v.status)
  let todo: ITodo = {
    id: v.id,
    groupId: v.groupId,
    cp: cp,
    createDate: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
    task: v.task,
    value: v.value,
    estimateTime: v.estimateTime,
    realityTime: v.realityTime,
    updateDateTime: moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss"),
    priority: v.priority,
    status: v.status
  }
  return todo
}
