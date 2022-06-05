import './money-spending.langs'
import { Button } from '@pv/ui-kit/button'
import { Icon } from '@pv/ui-kit/icon'
import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { ButtonWrapper } from './money-spending-styles'

export function MoneySpending() {
  return (
    <ScrollContainer>
      <ButtonWrapper>
        <Button shape="circle">
          <Icon iconName="plus" iconSize="huge" />
        </Button>
      </ButtonWrapper>
    </ScrollContainer>
  )
}
