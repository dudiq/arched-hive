import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'

import './expense-item-page.langs'
import { ButtonWrapper } from '@pv/modules/money-spending/ui/pages/expense-item-page/expense-item-styles'
import { Button } from '@pv/ui-kit/button'
import { useFocusContext } from '@pv/modules/focus'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'

export const ExpenseItemPage = observer(() => {
  const { moneySpendingAction } = useMoneySpendingContext()
  const { focusStore } = useFocusContext()

  return (
    <>
      <ScrollContainer>test</ScrollContainer>
      {!focusStore.isTyping && (
        <ButtonWrapper>
          <Button
            shape="circle"
            iconName="cross"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpenseList}
          />
        </ButtonWrapper>
      )}
    </>
  )
})
