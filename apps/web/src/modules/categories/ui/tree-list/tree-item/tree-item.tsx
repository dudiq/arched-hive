type Props = {
  categoryId: string
  title: string
  isActive?: boolean
  isRoot?: boolean
}

export function TreeItem({ isActive, isRoot, title, categoryId }: Props) {
  const activeClass = isActive
    ? 'underline text-gray-400 dark:text-gray-600'
    : ''
  const rootClass = isRoot ? 'pl-4' : 'pl-8'
  return (
    <div
      className={`p-2 cursor-pointer ${activeClass} ${rootClass}`}
      data-category-id={categoryId}
    >
      {title}
    </div>
  )
}
