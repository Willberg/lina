import { IRetTodo, ITodo } from "@/types/todo/types";
import moment from "moment";

export const calCp = (v: IRetTodo, k: number | string) => {
  let cp = ((v.value || 100) / (v.estimateTime || 1)).toFixed(4)
  if (k === '100' || k === 100) {
    cp = (v.value / v.realityTime).toFixed(4)
  }
  return cp
}

export const handleTodoList = (result: any, todoList: ITodo[]) => {
  if (result.status) {
    // 拉取数据时要清空原来的数据
    todoList.splice(0, todoList.length)
    result.data.forEach((v: IRetTodo) => {
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
      todoList.push(todo)
    })
  }
}
