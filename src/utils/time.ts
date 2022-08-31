import moment, { Moment } from 'moment'

export const cvtTimeMillisByDateTimeStr = (dateTimeStr: string) => {
  return moment(dateTimeStr, 'YYYY-MM-DD HH:mm:ss').unix() * 1000
}

export const nowDateTimeStr = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

export const startDateTimeStr = (m: Moment) => {
  return m.format('YYYY-MM-DD') + ' 00:00:00'
}

export const thisStartWeekDay = () => {
  return startDateTimeStr(moment().day(1))
}

export const thisStartMonthDay = () => {
  return startDateTimeStr(moment().date(1))
}

export const originalStartDay = () => {
  return startDateTimeStr(moment().set('year', 2000))
}

export const nowTimeMillis = () => {
  return moment().unix() * 1000
}

export const timeMillis2DateTime = (ts: number) => {
  return moment.unix(ts / 1000).format('YYYY-MM-DD HH:mm:ss')
}
