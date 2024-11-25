import { AnalyticAction } from '@pv/analytic/interface/actions/analytic.action'
import { AnalyticStore } from '@pv/analytic/interface/stores/analytic.store'
import { useInject } from '@pv/service/interface/use-inject'

import { observer } from '@repo/service'
import { Button, Icon } from '@repo/ui-kit'

import { DateRangeSelect } from './date-range-select'

export const AnalyticControl = observer(() => {
  const { analyticAction, analyticStore } = useInject({
    analyticStore: AnalyticStore,
    analyticAction: AnalyticAction,
  })

  return (
    <div>
      <div className="flex w-full gap-2">
        <Button
          onClick={analyticAction.handlePrevReport}
          isDisabled={!analyticStore.isPrevAvailable}
        >
          <Icon name="ALeft" />
        </Button>
        <div className="flex-1">
          <DateRangeSelect />
        </div>
        <Button
          onClick={analyticAction.handleNextReport}
          isDisabled={!analyticStore.isNextAvailable}
        >
          <Icon name="ARight" />
        </Button>
      </div>
    </div>
  )
})
