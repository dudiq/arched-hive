type Props = {
  categoryId: string
  title: string
  isActive?: boolean
  isRoot?: boolean
}

export function TreeItem({ isActive, isRoot, title, categoryId }: Props) {
  return (
    <div className="p-2" data-category-id={categoryId}>
      {title}
    </div>
  )
}
