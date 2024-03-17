import { useCategoriesContext } from '@pv/categories/interface/use-categories-context'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

export const Controls = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()
  const isChildCategory = !categoriesStore.selectedCategory?.catId
  const isSelectedCategory = !!categoriesStore.selectedCategoryId
  const plusButtonVariant = isSelectedCategory ? 'primary' : 'secondary'

  return (
    <div>
      <div>
        {!!isSelectedCategory && (
          <Button
            shape="circle"
            iconName="Trash"
            iconSize="huge"
            onClick={categoriesAction.handleRemoveCategory}
          />
        )}
      </div>
      <div>
        {!!isSelectedCategory && (
          <Button
            shape="circle"
            iconName="EditL"
            iconSize="huge"
            onClick={categoriesAction.handleEditCategory}
          />
        )}
      </div>
      <div>
        {!!isChildCategory && (
          <Button
            shape="circle"
            iconName="Plus"
            iconSize="huge"
            variant={plusButtonVariant}
            onClick={categoriesAction.handleAddCategory}
          />
        )}
      </div>
    </div>
  )
})
