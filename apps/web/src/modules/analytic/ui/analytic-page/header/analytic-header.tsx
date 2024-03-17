import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'

import { observer } from '@repo/service'
import { Button, Icon } from '@repo/ui-kit'

import { DateRangeSelect } from './date-range-select'

export const AnalyticHeader = observer(() => {
  const { analyticAction, analyticStore } = useAnalyticContext()
  return (
    <div>
      <div>
        <Button
          onClick={analyticAction.handlePrevReport}
          isDisabled={!analyticStore.isPrevAvailable}
        >
          <Icon name="ALeft" />
        </Button>
        <div>
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
