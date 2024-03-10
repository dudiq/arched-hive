import { useCallback } from 'preact/compat'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import { TreeListType } from '@pv/modules/categories/interface/stores/types'
import { Container } from './tree-list-styles'
import { TreeItem } from './tree-item'

type Props = {
  onClick: (categoryId: string) => void
  selectedId?: string
  categoryTree: TreeListType
}

export function TreeList({ categoryTree, onClick, selectedId }: Props) {
  const handleClick = useCallback(
    (e: any) => {
      const categoryId = getAttrFromElement(e.target as HTMLElement, 'data-category-id')
      if (!categoryId) return
      onClick(categoryId)
    },
    [onClick],
  )

  return (
    <Container onClick={handleClick}>
      {categoryTree.map((treeItem) => {
        const { item, isRoot } = treeItem
        const isActive = item.id === selectedId
        const key = `${item.id}-${item.title}-${item.catId}`
        return (
          <TreeItem
            key={key}
            title={item.title}
            isActive={isActive}
            categoryId={item.id}
            isRoot={isRoot}
          />
        )
      })}
    </Container>
  )
}
