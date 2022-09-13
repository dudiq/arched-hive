import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { useCallback } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'

export function usePadBlock() {
  const { expenseSelectionAction } = useMoneySpendingContext()
  const handleClick = useCallback(
    (ev: any) => {
      const target = ev.target as HTMLDivElement
      const action = getAttrFromElement(target, 'data-action')
      if (!action) return
      if (!isNaN(Number(action))) {
        expenseSelectionAction.handleAddNumber(action)
        return
      }
      switch (action) {
        case 'clear':
          expenseSelectionAction.handleClear()
          return
        case 'backspace':
          expenseSelectionAction.handleBackspaceCost()
          return
        case 'plus':
          expenseSelectionAction.handlePushCost()
          return
        case 'dot':
          expenseSelectionAction.handleSetFloat()
          return
        case 'apply':
          expenseSelectionAction.handleApply()
          return
      }
    },
    [expenseSelectionAction],
  )

  return {
    handleClick,
  }
}
