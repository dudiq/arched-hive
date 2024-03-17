import { useMoneySpendingContext } from '@pv/money-spending/interface/use-money-spending-context'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

export const Controls = observer(() => {
  const { expenseSelectionStore, moneySpendingAction, expenseSelectionAction } =
    useMoneySpendingContext()
  const { isEditing } = expenseSelectionStore

  return (
    <div className="">
      <div>
        {!!isEditing && (
          <Button
            shape="circle"
            iconName="trash"
            iconSize="huge"
            onClick={expenseSelectionAction.handleRemoveExpense}
          />
        )}
      </div>
      <div>
        {!!isEditing && (
          <Button
            shape="circle"
            iconName="edit-l"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpense}
          />
        )}
      </div>
      <div>
        {!isEditing && (
          <Button
            shape="circle"
            iconName="plus"
            iconSize="huge"
            onClick={moneySpendingAction.handleOpenExpense}
          />
        )}
      </div>
    </div>
  )
})
