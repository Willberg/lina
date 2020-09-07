import moment, { Moment } from 'moment'

export const cvtTimeMillisByDateTimeStr = (dateTimeStr: string) => {
  return moment(dateTimeStr, 'YYYY-MM-DD HH:mm:ss').unix() * 1000
}

export const nowDateTimeStr = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

export const startDateTimeStr = (m: Moment) => {
  return m.format('YYYY-MM-DD') + " 00:00:00"
}
