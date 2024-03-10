import { observer } from '@repo/service'
import { Button } from '@pv/ui-kit/button'
import { Icon } from '@pv/ui-kit/icon'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'
import { DateRangeSelect } from './date-range-select'
import { Container, DateSelectContainer, Root } from './header-styles'

export const Header = observer(() => {
  const { analyticAction, analyticStore } = useAnalyticContext()
  return (
    <Root>
      <Container>
        <Button
          onClick={analyticAction.handlePrevReport}
          isDisabled={!analyticStore.isPrevAvailable}
        >
          <Icon iconName="a-left" />
        </Button>
        <DateSelectContainer>
          <DateRangeSelect />
        </DateSelectContainer>
        <Button
          onClick={analyticAction.handleNextReport}
          isDisabled={!analyticStore.isNextAvailable}
        >
          <Icon iconName="a-right" />
        </Button>
      </Container>
    </Root>
  )
})
