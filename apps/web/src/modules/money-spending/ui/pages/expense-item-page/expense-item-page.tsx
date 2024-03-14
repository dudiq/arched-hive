import './expense-item-page.langs'

import { useEffect } from 'react'
import { useInject } from '@pv/app/interface/use-inject'
import { FocusStore } from '@pv/focus/interface/stores/focus.store'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, ScrollContainer } from '@repo/ui-kit'

import { Categories } from './categories'
import { Desc } from './desc'
import { Block, ButtonWrapper } from './expense-item-styles'
import { PadBlock } from './pad-block'
import { PadTitle } from './pad-title'

export const ExpenseItemPage = observer(() => {
  const { focusStore } = useInject({
    focusStore: FocusStore,
  })

  const { moneySpendingAction, expenseSelectionAction, moneySpendingStore } =
    useMoneySpendingContext()

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
