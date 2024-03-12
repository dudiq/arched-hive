import { useCallback } from 'react'
import { getAttrFromElement } from '@pv/dom/interface/get-attr-from-element'

import { TreeItem } from './tree-item'
import { Container } from './tree-list-styles'

import type { TreeListType } from '@pv/categories/interface/stores/types'

type Props = {
  onClick: (categoryId: string) => void
  selectedId?: string
  categoryTree: TreeListType
}

export function TreeList({ categoryTree, onClick, selectedId }: Props) {
  const handleClick = useCallback(
    (e: any) => {
      const categoryId = getAttrFromElement(
        e.target as HTMLElement,
        'data-category-id',
      )
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
