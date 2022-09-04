import { Select } from '@pv/ui-kit/select'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { observer } from 'mobx-react-lite'
import { REPORT_VIEW } from '@pv/modules/analytic/core/constants'
import { useMemo } from 'preact/compat'
import { useLanguageContext } from '@pv/modules/language'
import { titleMap } from './title-map'

export const DateRangeSelect = observer(() => {
  const { langStore } = useLanguageContext()
  const { analyticStore, analyticAction } = analyticContext()

  const lang = langStore.currentLanguage

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(lang, {
      month: 'long',
    })
  }, [lang])

  const endDate = 123

  const options = useMemo(() => {
    const args = { formatter: dateFormatter, endDate }
    return [
      {
        label: titleMap[REPORT_VIEW.ALL](args),
        value: REPORT_VIEW.ALL,
      },
      {
        label: titleMap[REPORT_VIEW.MONTHLY](args),
        value: REPORT_VIEW.MONTHLY,
      },
      {
        label: titleMap[REPORT_VIEW.FIVE_YEARLY](args),
        value: REPORT_VIEW.FIVE_YEARLY,
      },
      {
        label: titleMap[REPORT_VIEW.YEARLY](args),
        value: REPORT_VIEW.YEARLY,
      },
      {
        label: titleMap[REPORT_VIEW.SEASONALLY](args),
        value: REPORT_VIEW.SEASONALLY,
      },
    ]
  }, [dateFormatter])
  return (
    <div>
      <Select
        onChange={(value) => {
          analyticAction.handleChangeReportView(value as REPORT_VIEW)
        }}
        options={options}
        value={analyticStore.reportView}
      />
    </div>
  )
})
