import { getMonthStart } from './get-month-start'

const MS_DAY = 24 * 60 * 60 * 1000

export function getMonthEnd(today: number | string | Date): number {
  const startMonthMs = getMonthStart(today)
  const dToday = new Date(startMonthMs)
  const days = new Date(dToday.getFullYear(), dToday.getMonth() + 1, 0).getDate()
  const ret = startMonthMs + days * MS_DAY - 1
  return ret
}
