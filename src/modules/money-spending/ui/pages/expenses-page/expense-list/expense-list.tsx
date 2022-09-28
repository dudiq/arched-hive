import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { ExpenseRow } from './expense-row'
import { Row, RowsContainer } from './expense-list-styles'

export const ExpenseList = observer(() => {
  const { expenseSelectionAction, expenseSelectionStore, expensesViewStore } =
    useMoneySpendingContext()

  const onClick = useCallback(
    (e: any) => {
      const expenseId = getAttrFromElement(e.target as HTMLElement, 'data-expense-id')
      if (!expenseId) return
      expenseSelectionAction.handleSelectExpense(expenseId)
    },
    [expenseSelectionAction],
  )

  const selectedId = expenseSelectionStore.currentExpenseView?.id
  const isFocusItem = useMemo(() => {
    return !!selectedId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RowsContainer onClick={onClick}>
      {expensesViewStore.expensesView.map((expenseView) => {
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
