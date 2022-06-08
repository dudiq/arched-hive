import { Button } from '@pv/ui-kit/button'
import { observer } from 'mobx-react-lite'
import { useMoneySpendingContext } from '@pv/modules/money-spending/interface/use-money-spending-context'
import { ButtonWrapper, Item } from './controls-styles'

export const Controls = observer(() => {
  const { moneyFormStore } = useMoneySpendingContext()
  const { isEditing } = moneyFormStore

  return (
    <ButtonWrapper>
      <Item>{isEditing && <Button shape="circle" iconName="trash" iconSize="huge" />}</Item>
      <Item>{isEditing && <Button shape="circle" iconName="edit-l" iconSize="huge" />}</Item>
      <Item>{!isEditing && <Button shape="circle" iconName="plus" iconSize="huge" />}</Item>
    </ButtonWrapper>
  )
})
