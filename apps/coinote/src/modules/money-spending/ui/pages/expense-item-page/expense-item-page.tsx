import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { observer } from '@repo/service'
import { Button } from '@pv/ui-kit/button'
import { useFocusContext } from '@pv/modules/focus'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useEffect } from 'preact/compat'
import { Block, ButtonWrapper } from './expense-item-styles'
import { Categories } from './categories'
import { Desc } from './desc'
import { PadTitle } from './pad-title'
import { PadBlock } from './pad-block'

import './expense-item-page.langs'

export const ExpenseItemPage = observer(() => {
  const { moneySpendingAction, expenseSelectionAction, moneySpendingStore } =
    useMoneySpendingContext()
  const { focusStore } = useFocusContext()

  useEffect(() => {
    return () => {
      expenseSelectionAction.handleSelectCategoryId('')
    }
  }, [expenseSelectionAction])

  return (
    <>
      <ScrollContainer>
        <Categories />
        {moneySpendingStore.isCalculatorVisible && (
          <Block>
            <Desc />
            <PadTitle />
            <PadBlock />
          </Block>
        )}
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
