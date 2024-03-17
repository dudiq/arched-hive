import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'

import { observer } from '@repo/service'
import { Button, Icon } from '@repo/ui-kit'

import { DateRangeSelect } from './date-range-select'

export const Header = observer(() => {
  const { analyticAction, analyticStore } = useAnalyticContext()
  return (
    <div>
      <div>
        <Button
          onClick={analyticAction.handlePrevReport}
          isDisabled={!analyticStore.isPrevAvailable}
        >
          <Icon iconName="a-left" />
        </Button>
        <div>
          <DateRangeSelect />
        </div>
        <Button
          onClick={analyticAction.handleNextReport}
          isDisabled={!analyticStore.isNextAvailable}
        >
          <Icon iconName="a-right" />
        </Button>
      </div>
    </div>
  )
})
