export const calShowTime = (difficulty: string | undefined, useTime: number | undefined) => {
  if (difficulty === undefined || useTime === undefined) {
    return 1
  }
  if (difficulty === '简单') {
    if (useTime <= 10 * 60) {
      return 1
    } else {
      return 2
    }
  } else if (difficulty === '中等') {
    if (useTime <= 30 * 60) {
      return 1
    } else {
      return 2
    }
  } else {
    if (useTime <= 60 * 60) {
      return 1
    } else {
      return 2
    }
  }
}
