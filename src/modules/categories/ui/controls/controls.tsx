import { Button } from '@pv/ui-kit/button'
import { Icon } from '@pv/ui-kit/icon'
import { observer } from 'mobx-react-lite'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { ButtonWrapper } from './controls-styles'

export const Controls = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()
  const isChildCategory = !categoriesStore.selectedCategory?.catId
  return (
    <ButtonWrapper>
      {categoriesStore.selectedCategoryId && (
        <Button shape="circle" onClick={categoriesAction.handleRemoveCategory}>
          <Icon iconName="trash" iconSize="huge" />
        </Button>
      )}
      {categoriesStore.selectedCategoryId && (
        <Button shape="circle" onClick={categoriesAction.handleEditCategory}>
          <Icon iconName="edit-l" iconSize="huge" />
        </Button>
      )}
      {isChildCategory && (
        <Button shape="circle" onClick={categoriesAction.handleAddCategory}>
          <Icon iconName="plus" iconSize="huge" />
        </Button>
      )}
    </ButtonWrapper>
  )
})
