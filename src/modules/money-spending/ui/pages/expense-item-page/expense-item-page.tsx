import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from 'mobx-react-lite'
import { ButtonWrapper } from '@pv/modules/money-spending/ui/pages/expense-item-page/expense-item-styles'
import { Button } from '@pv/ui-kit/button'
import { useFocusContext } from '@pv/modules/focus'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useEffect } from 'preact/compat'
import { Categories } from './categories'

import './expense-item-page.langs'

export const ExpenseItemPage = observer(() => {
  const { moneySpendingAction } = useMoneySpendingContext()
  const { focusStore } = useFocusContext()
  useEffect(() => {
    return () => {
      moneySpendingAction.handleSelectCategoryId('')
    }
  }, [moneySpendingAction])

  return (
    <>
      <ScrollContainer>
        <Categories />
      </ScrollContainer>
      {!focusStore.isTyping && (
        <ButtonWrapper>
          <Button
            shape="circle"
            iconName="a-left"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpenseList}
          />
        </ButtonWrapper>
      )}
    </>
  )
})
