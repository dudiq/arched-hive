import './expense-item-page.langs'

import { FocusStore } from '@pv/focus/interface/stores/focus.store'
import { Layout } from '@pv/layout/ui'
import { MoneySpendingAction } from '@pv/money-spending/interface/actions/money-spending.action'
import { MoneySpendingStore } from '@pv/money-spending/interface/stores/money-spending.store'
import { useInject } from '@pv/service/interface/use-inject'

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

  const { moneySpendingAction, moneySpendingStore } = useInject({
    moneySpendingAction: MoneySpendingAction,
    moneySpendingStore: MoneySpendingStore,
  })

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
