import './expense-item-page.langs'

import { useEffect } from 'react'
import { useInject } from '@pv/app/interface/use-inject'
import { FocusStore } from '@pv/focus/interface/stores/focus.store'
import { Layout } from '@pv/layout/ui'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button, ScrollContainer, Swap } from '@repo/ui-kit'

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

  return (
    <Layout>
      <ScrollContainer>
        <Categories />
        <Swap has={moneySpendingStore.isCalculatorVisible}>
          <div className="mt-2 mx-2 flex flex-col gap-2">
            <Desc />
            <PadTitle />
            <PadBlock />
          </div>
        </Swap>
      </ScrollContainer>
      <Swap has={!focusStore.isTyping}>
        <div className="absolute bottom-4 right-4">
          <Button
            shape="circle"
            iconName="ALeft"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpenseList}
          />
        </div>
      </Swap>
    </Layout>
  )
})
