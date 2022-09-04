function toToday(today: number | string | Date) {
  return !today ? new Date() : new Date(today)
}

export function getMonthStart(today: number | string | Date): number {
  const dToday = toToday(today)
  const month = new Date(dToday.getFullYear(), dToday.getMonth())
  const ret = month.getTime()
  return ret
}
