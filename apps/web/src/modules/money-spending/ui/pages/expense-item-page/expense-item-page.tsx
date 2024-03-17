import './expense-item-page.langs'

import { useEffect } from 'react'
import { useInject } from '@pv/app/interface/use-inject'
import { FocusStore } from '@pv/focus/interface/stores/focus.store'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, ScrollContainer } from '@repo/ui-kit'

import { Categories } from './categories'
import { Desc } from './desc'
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
          <div>
            <Desc />
            <PadTitle />
            <PadBlock />
          </div>
        )}
      </ScrollContainer>
      {!focusStore.isTyping && (
        <div>
          <Button
            shape="circle"
            iconName="ALeft"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpenseList}
          />
        </div>
      )}
    </>
  )
})
