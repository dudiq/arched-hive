import { observer } from 'mobx-react-lite'
import { Button } from '@pv/ui-kit/button'
import { Icon } from '@pv/ui-kit/icon'
import { analyticContext } from '@pv/modules/analytic/interface/analytic-context'
import { DateRangeSelect } from './date-range-select'
import { Container, DateSelectContainer } from './header-styles'

export const Header = observer(() => {
  const { analyticAction, analyticStore } = analyticContext()
  return (
    <Container>
      <Button onClick={analyticAction.handlePrevReport} isDisabled={!analyticStore.isPrevAvailable}>
        <Icon iconName="a-left" />
      </Button>
      <DateSelectContainer>
        <DateRangeSelect />
      </DateSelectContainer>
      <Button onClick={analyticAction.handleNextReport} isDisabled={!analyticStore.isNextAvailable}>
        <Icon iconName="a-right" />
      </Button>
    </Container>
  )
})
