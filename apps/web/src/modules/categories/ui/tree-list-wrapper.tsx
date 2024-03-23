import { useCallback } from 'react'
import { useCategoriesContext } from '@pv/categories/interface/use-categories-context'

import { observer } from '@repo/service'

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
