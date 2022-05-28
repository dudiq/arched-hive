import './money-spending.langs'
import { Button } from '@pv/ui-kit/button'
import { Icon } from '@pv/ui-kit/icon'
import { ButtonWrapper } from './money-spending-styles'

export function MoneySpending() {
  return (
    <>
      <ButtonWrapper>
        <Button shape="circle">
          <Icon iconName="plus" iconSize="huge" />
        </Button>
      </ButtonWrapper>
    </>
  )
}
