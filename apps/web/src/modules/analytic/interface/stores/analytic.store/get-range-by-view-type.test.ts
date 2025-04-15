import { REPORT_VIEW } from '@pv/analytic/core/constants'

import { describe, expect, it } from '@repo/unit-test'

import { getRangeByViewType } from './get-range-by-view-type'

describe('getRangeByViewType', () => {
  const createLocalDate = (
    year: number,
    month: number,
    day: number,
    hours = 0,
    minutes = 0,
    seconds = 0,
    ms = 0,
  ) => {
    return new Date(year, month - 1, day, hours, minutes, seconds, ms).getTime()
  }

  const testDate = createLocalDate(2024, 2, 15)

  it('should return correct range for MONTHLY view', () => {
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.MONTHLY,
      viewDate: testDate,
    })

    const expectedStart = createLocalDate(2024, 2, 1)
    const expectedEnd = createLocalDate(2024, 2, 29, 23, 59, 59, 999)

    expect(result.startDate).toBe(expectedStart)
    expect(result.endDate).toBe(expectedEnd)
  })

  it('should return correct range for SEASONALLY view', () => {
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.SEASONALLY,
      viewDate: testDate, // February 15, 2024 (Winter)
    })

    // For February, the season is Winter (Dec-Feb)
    const expectedStart = createLocalDate(2023, 12, 1) // Dec 1
    const expectedEnd = createLocalDate(2024, 2, 29, 23, 59, 59, 999) // Feb 29 (leap year)

    expect(result.startDate).toBe(expectedStart)
    expect(result.endDate).toBe(expectedEnd)
  })

  it('should return correct range for YEARLY view', () => {
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.YEARLY,
      viewDate: testDate,
    })

    const expectedStart = createLocalDate(2024, 1, 1)
    const expectedEnd = createLocalDate(2024, 12, 31, 23, 59, 59, 999)

    expect(result.startDate).toBe(expectedStart)
    expect(result.endDate).toBe(expectedEnd)
  })

  it('should return correct range for FIVE_YEARLY view', () => {
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.FIVE_YEARLY,
      viewDate: testDate,
    })

    const expectedStart = createLocalDate(2019, 2, 1)
    const expectedEnd = createLocalDate(2024, 2, 29, 23, 59, 59, 999)

    expect(result.startDate).toBe(expectedStart)
    expect(result.endDate).toBe(expectedEnd)
  })

  it('should return correct range for ALL view', () => {
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.ALL,
      viewDate: testDate,
    })

    expect(result.startDate).toBe(0)
    expect(result.endDate).toBeLessThanOrEqual(Date.now())
  })

  it('should handle December for SEASONALLY view correctly', () => {
    const decemberDate = createLocalDate(2024, 12, 15)
    const result = getRangeByViewType({
      viewType: REPORT_VIEW.SEASONALLY,
      viewDate: decemberDate,
    })

    // For December, the season is Winter (Dec-Feb)
    const expectedStart = createLocalDate(2024, 12, 1) // Dec 1
    const expectedEnd = createLocalDate(2025, 2, 28, 23, 59, 59, 999) // Feb 28 next year

    expect(result.startDate).toBe(expectedStart)
    expect(result.endDate).toBe(expectedEnd)
  })
})
