import { useCallback, useMemo } from 'react'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'
import { titleMap } from '@pv/modules/analytic/ui/analytic-page/header/date-range-select/title-map'
import { useLanguageContext } from '@pv/modules/language'

export function useDateRangeSelect() {
  const { langStore } = useLanguageContext()
  const { analyticStore, analyticAction } = useAnalyticContext()

  const lang = langStore.currentLanguage

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(lang, {
      month: 'long',
    })
  }, [lang])

  const endDate = analyticStore.viewDate

  const options = useMemo(() => {
    const args = { formatter: dateFormatter, endDate }
    return [
      {
        label: titleMap[REPORT_VIEW.MONTHLY](args),
        value: REPORT_VIEW.MONTHLY,
      },
      {
        label: titleMap[REPORT_VIEW.SEASONALLY](args),
        value: REPORT_VIEW.SEASONALLY,
      },
      {
        label: titleMap[REPORT_VIEW.YEARLY](args),
        value: REPORT_VIEW.YEARLY,
      },
      {
        label: titleMap[REPORT_VIEW.ALL](args),
        value: REPORT_VIEW.ALL,
      },
    ]
  }, [dateFormatter, endDate])

  const onChange = useCallback(
    (value: string) => {
      analyticAction.handleChangeReportView(value as REPORT_VIEW)
    },
    [analyticAction],
  )

  return {
    onChange,
    options,
    reportView: analyticStore.reportView,
  }
}
