export const filterHandlerMethod = (value: number, row: any, column: any) => {
  const property = column['property']
  return row[property] === value
}
