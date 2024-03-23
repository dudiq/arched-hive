import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

export const Controls = observer(() => {
  const { expenseSelectionStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { isEditing } = expenseSelectionStore

  return (
    <div className="absolute right-6 bottom-3 flex flex-col gap-2">
      {!!isEditing && (
        <Button
          shape="circle"
          iconName="Trash"
          iconSize="huge"
          onClick={expenseSelectionAction.handleRemoveExpense}
        />
      )}
      {!!isEditing && (
        <Button
          shape="circle"
          iconName="EditL"
          iconSize="huge"
          onClick={moneySpendingAction.handleOpenExpense}
        />
      )}
      {!isEditing && (
        <Button
          shape="circle"
          iconName="Plus"
          iconSize="huge"
          onClick={moneySpendingAction.handleOpenExpense}
        />
      )}
    </div>
  )
})
