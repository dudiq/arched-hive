import './expense-item-page.langs'

import { useEffect } from 'react'
import { useFocusContext } from '@pv/focus'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, ScrollContainer } from '@repo/ui-kit'

import { Categories } from './categories'
import { Desc } from './desc'
import { Block, ButtonWrapper } from './expense-item-styles'
import { PadBlock } from './pad-block'
import { PadTitle } from './pad-title'

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
        {!!moneySpendingStore.isCalculatorVisible && (
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
