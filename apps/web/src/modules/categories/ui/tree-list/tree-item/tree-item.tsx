import { TreeItemContainer, extendedClasses } from './tree-item-styles'

type Props = {
  categoryId: string
  title: string
  isActive?: boolean
  isRoot?: boolean
}

export function TreeItem({ isActive, isRoot, title, categoryId }: Props) {
  return (
    <TreeItemContainer
      data-category-id={categoryId}
      className={extendedClasses({ isActive, isRoot })}
    >
      {title}
    </TreeItemContainer>
  )
}
