import { observer } from '@repo/service'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { useCallback } from 'preact/compat'
import { TreeList } from './tree-list'

export const TreeListWrapper = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()

  const selectedId = categoriesStore.selectedCategoryId
  const onClick = useCallback(
    (categoryId: string) => {
      categoriesAction.toggleSelectedCategoryId(categoryId)
    },
    [categoriesAction],
  )

  return (
    <TreeList
      onClick={onClick}
      selectedId={selectedId}
      categoryTree={categoriesStore.categoryTree}
    />
  )
})
