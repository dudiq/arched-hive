import { useLanguageContext } from '@pv/modules/language'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { useCallback, useMemo } from 'preact/compat'
import { titleMap } from '@pv/modules/analytic/ui/analytic-page/date-range-select/title-map'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'

export function useDateRangeSelect() {
  const { langStore } = useLanguageContext()
  const { analyticStore, analyticAction } = analyticContext()

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
