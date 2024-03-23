import { useCategoriesContext } from '@pv/categories/interface/use-categories-context'

import { observer } from '@repo/service'
import { Button } from '@repo/ui-kit'

export const Controls = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()
  const isChildCategory = !categoriesStore.selectedCategory?.catId
  const isSelectedCategory = !!categoriesStore.selectedCategoryId

  return (
    <div className="absolute right-6 bottom-3 flex flex-col gap-2">
      {!!isSelectedCategory && (
        <Button
          shape="circle"
          iconName="Trash"
          iconSize="huge"
          onClick={categoriesAction.handleRemoveCategory}
        />
      )}
      {!!isSelectedCategory && (
        <Button
          shape="circle"
          iconName="EditL"
          iconSize="huge"
          onClick={categoriesAction.handleEditCategory}
        />
      )}
      {!!isChildCategory && (
        <Button
          shape="circle"
          iconName="Plus"
          iconSize="huge"
          onClick={categoriesAction.handleAddCategory}
        />
      )}
    </div>
  )
})
