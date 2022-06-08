import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'preact/compat'
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
  const isFocusItem = useMemo(() => {
    return !!selectedId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RowsContainer onClick={onClick}>
      {moneySpendingStore.expensesView.map((expenseView) => {
        const key = `${expenseView.id}-${expenseView.cost}-${expenseView.catParentTitle}-${expenseView.catTitle}`
        const isSelected = expenseView.id === selectedId
        const isScrollTo = isSelected && isFocusItem
        return (
          <Row key={key} data-expense-id={expenseView.id}>
            <ExpenseRow expenseView={expenseView} isSelected={isSelected} isScrollTo={isScrollTo} />
          </Row>
        )
      })}
    </RowsContainer>
  )
})
