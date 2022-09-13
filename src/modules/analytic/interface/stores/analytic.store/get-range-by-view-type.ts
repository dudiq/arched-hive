import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { getMonthEnd } from '@pv/utils/get-month-end'
import { getMonthStart } from '@pv/utils/get-month-start'

const monthToEndSeason: Record<number, number> = {
  11: 11,
  0: 1,
  1: 1,

  2: 4,
  3: 4,
  4: 4,

  5: 7,
  6: 7,
  7: 7,

  8: 10,
  9: 10,
  10: 10,
}

const startDateByView: Record<
  REPORT_VIEW,
  (initDate: number) => { startDate: number; endDate: number }
> = {
  [REPORT_VIEW.MONTHLY](initDate) {
    const startDate = getMonthStart(initDate)
    const endDate = getMonthEnd(initDate)
    return {
      startDate,
      endDate,
    }
  },
  [REPORT_VIEW.SEASONALLY](initDate) {
    const endDate = getMonthEnd(initDate)
    const endD = new Date(endDate)
    const month = endD.getMonth()
    let monthStartD = new Date(endD.getFullYear(), monthToEndSeason[month], 10)
    if (month === 11) {
      monthStartD = new Date(endD.getFullYear() + 1, 1, 10)
    }
    const seasonEnd = getMonthEnd(monthStartD)
    const seasonStartD = new Date(monthStartD)
    seasonStartD.setMonth(monthStartD.getMonth() - 2)
    const seasonStart = getMonthStart(seasonStartD.getTime())

    return {
      startDate: seasonStart,
      endDate: seasonEnd,
    }
  },
  [REPORT_VIEW.YEARLY](initDate) {
    const endDateEdge = getMonthEnd(initDate)
    const endD = new Date(endDateEdge)
    const startD = new Date(endD.getFullYear(), 0)
    const endDateD = new Date(endD.getFullYear(), 11)
    const endDate = getMonthEnd(endDateD)
    return {
      startDate: startD.getTime(),
      endDate,
    }
  },
  [REPORT_VIEW.FIVE_YEARLY](initDate) {
    const endDate = getMonthEnd(initDate)
    const endD = new Date(endDate)
    const startD = new Date(endD.getFullYear() - 5, endD.getMonth())
    return {
      startDate: startD.getTime(),
      endDate,
    }
  },
  [REPORT_VIEW.ALL]() {
    return {
      startDate: 0,
      endDate: Date.now(),
    }
  },
}

export function getRangeByViewType({
  viewType,
  viewDate,
}: {
  viewDate: number
  viewType: REPORT_VIEW
}) {
  const res = startDateByView[viewType](viewDate)
  return res
}
