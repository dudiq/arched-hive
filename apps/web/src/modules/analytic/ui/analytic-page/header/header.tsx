import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'

import { observer } from '@repo/service'
import { Button, Icon } from '@repo/ui-kit'

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
