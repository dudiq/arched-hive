import { Button } from '@pv/ui-kit/button'
import { observer } from 'mobx-react-lite'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { ButtonWrapper, Item } from './controls-styles'

export const Controls = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()
  const isChildCategory = !categoriesStore.selectedCategory?.catId
  const plusButtonVariant = categoriesStore.selectedCategoryId ? 'primary' : 'secondary'

  return (
    <ButtonWrapper>
      <Item>
        {categoriesStore.selectedCategoryId && (
          <Button
            shape="circle"
            iconName="trash"
            iconSize="huge"
            onClick={categoriesAction.handleRemoveCategory}
          />
        )}
      </Item>
      <Item>
        {categoriesStore.selectedCategoryId && (
          <Button
            shape="circle"
            iconName="edit-l"
            iconSize="huge"
            onClick={categoriesAction.handleEditCategory}
          />
        )}
      </Item>
      <Item>
        {isChildCategory && (
          <Button
            shape="circle"
            iconName="plus"
            iconSize="huge"
            variant={plusButtonVariant}
            onClick={categoriesAction.handleAddCategory}
          />
        )}
      </Item>
    </ButtonWrapper>
  )
})
