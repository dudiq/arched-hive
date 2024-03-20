import { useCallback } from 'react'
import { getAttrFromElement } from '@pv/dom/interface/get-attr-from-element'
import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'

import { ExpenseRow } from './expense-row'

export const ExpenseList = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore, expensesViewStore } =
    useMoneySpendingContext()

  const onClick = useCallback(
    (e: any) => {
      const expenseId = getAttrFromElement(
        e.target as HTMLElement,
        'data-expense-id',
      )
      if (!expenseId) return
      expenseSelectionAction.handleSelectExpense(expenseId)
    },
    [expenseSelectionAction],
  )

  const selectedId = expenseSelectionStore.currentExpenseView?.id
  const isFocusItem = !!selectedId

  return (
    <div onClick={onClick}>
      {expensesViewStore.expensesView.map((expenseView, index) => {
        const key = `${expenseView.id}-${index}`
        const isSelected = expenseView.id === selectedId
        const isScrollTo = isSelected && isFocusItem
        return (
          <div key={key} data-expense-id={expenseView.id}>
            <ExpenseRow
              expenseView={expenseView}
              isSelected={isSelected}
              isScrollTo={isScrollTo}
            />
          </div>
        )
      })}
    </div>
  )
})
