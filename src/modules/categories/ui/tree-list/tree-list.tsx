import { observer } from 'mobx-react-lite'
import { useCallback } from 'preact/compat'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { Container, TreeItem } from './tree-list-styles'

export const TreeList = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()

  const selectedId = categoriesStore.selectedCategoryId
  const onClick = useCallback(
    (e: any) => {
      const categoryId = getAttrFromElement(e.target as HTMLElement, 'data-category-id')
      if (!categoryId) return
      categoriesAction.toggleSelectedCategoryId(categoryId)
    },
    [categoriesAction],
  )

  return (
    <Container onClick={onClick}>
      {categoriesStore.categoryTree.map((treeItem) => {
        const { item, isRoot } = treeItem
        const isActive = item.id === selectedId
        const key = `${item.id}-${item.title}-${item.catId}`
        return (
          <TreeItem key={key} isActive={isActive} isRoot={isRoot} data-category-id={item.id}>
            {item.title}
          </TreeItem>
        )
      })}
    </Container>
  )
})
