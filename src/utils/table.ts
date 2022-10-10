import { calShowTime } from '@/utils/oj'

export const filterHandlerMethod = (value: number, row: any, column: any) => {
  const property = column['property']
  return row[property] === value
}

export const filterEmptyMethod = (value: string, row: any, column: any) => {
  const property = column['property']
  if (value === '是') {
    return row[property] !== undefined && row[property] !== ''
  } else {
    return row[property] === undefined || row[property] === ''
  }
}

export const filterUseTimeHandler = (value: number, row: any, column: any) => {
  return calShowTime(row['difficulty'], row['useTime']) === value
}
