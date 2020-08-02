import { IRetTodo } from "@/types/todo/types";

export const calCp = (v: IRetTodo, k: number | string) => {
  let cp = ((v.value || 100) / (v.estimateTime || 1)).toFixed(4)
  if (k === '100' || k === 100) {
    cp = (v.value / v.realityTime).toFixed(4)
  }
  return cp
}
