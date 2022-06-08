import { observer } from 'mobx-react-lite'
import { useCallback } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { ExpenseRow } from './expense-row'
import { Row, RowsContainer } from './expense-list-styles'

export const ExpenseList = observer(() => {
  const { moneySpendingAction, moneySpendingStore, moneyFormStore } = useMoneySpendingContext()

  const onClick = useCallback(
    (e: any) => {
      const expenseId = getAttrFromElement(e.target as HTMLElement, 'data-expense-id')
      if (!expenseId) return
      moneySpendingAction.handleToggleSelectedExpense(expenseId)
    },
    [moneySpendingAction],
  )

  const selectedId = moneyFormStore.currentExpenseView?.id

  return (
    <RowsContainer onClick={onClick}>
      {moneySpendingStore.expensesView.map((expenseView) => {
        const key = `${expenseView.id}-${expenseView.cost}-${expenseView.catParentTitle}-${expenseView.catTitle}`
        const isSelected = expenseView.id === selectedId
        return (
          <Row key={key} data-expense-id={expenseView.id}>
            <ExpenseRow expenseView={expenseView} isSelected={isSelected} />
          </Row>
        )
      })}
    </RowsContainer>
  )
})
