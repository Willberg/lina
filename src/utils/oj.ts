export const calUseTimeOk = (difficulty: string | undefined, useTime: number | undefined) => {
  if (difficulty === undefined || useTime === undefined) {
    return true
  }
  if (difficulty === '简单') {
    return useTime <= 10 * 60
  } else if (difficulty === '中等') {
    return useTime <= 30 * 60
  } else {
    return useTime <= 60 * 60
  }
}
