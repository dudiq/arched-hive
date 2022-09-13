import { t } from '@pv/interface/services/i18n'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'

const seasonCodeMap: Record<number, () => string> = {
  0() {
    return t('analytic.seasons.winter')
  },
  1() {
    return t('analytic.seasons.spring')
  },
  2() {
    return t('analytic.seasons.summer')
  },
  3() {
    return t('analytic.seasons.autumn')
  },
}

const monthToSeason: Record<number, number> = {
  // winter
  11: 0,
  0: 0,
  1: 0,

  // spring
  2: 1,
  3: 1,
  4: 1,

  //summer
  5: 2,
  6: 2,
  7: 2,

  // autumn
  8: 3,
  9: 3,
  10: 3,
}

type Args = {
  formatter: Intl.DateTimeFormat
  endDate: number
}

export const titleMap: Record<REPORT_VIEW, (args: Args) => string> = {
  [REPORT_VIEW.MONTHLY]({ formatter, endDate }: Args) {
    const startD = new Date(endDate)
    const title = formatter.format(startD)

    const now = new Date()
    const yearTitle = now.getFullYear() != startD.getFullYear() ? startD.getFullYear() : ''
    const ret = `${title} ${yearTitle}`
    return ret
  },
  [REPORT_VIEW.SEASONALLY]({ endDate }: Args) {
    const endD = new Date(endDate)

    const month = endD.getMonth()
    const seasonCode = monthToSeason[month]
    const season = seasonCodeMap[seasonCode]()

    const now = new Date()
    const yearTitle = now.getFullYear() != endD.getFullYear() ? endD.getFullYear() : ''
    return `${season} ${yearTitle}`
  },
  [REPORT_VIEW.YEARLY]({ endDate }: Args) {
    const startD = new Date(endDate)
    return `${startD.getFullYear()}`
  },
  [REPORT_VIEW.FIVE_YEARLY]({ endDate }: Args) {
    const endD = new Date(endDate)
    const ret = `${endD.getFullYear() - 5} - ${endD.getFullYear()}`
    return ret
  },
  [REPORT_VIEW.ALL]() {
    return t('analytic.all')
  },
}
