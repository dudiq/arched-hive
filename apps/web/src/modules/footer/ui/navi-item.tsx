import { useCallback } from 'react'

import { Icon } from '@repo/ui-kit'

import type { IconName } from '@repo/ui-kit'

type Props = {
  title: string
  icon: IconName
  isActive: boolean
  onClick: () => void
}

export function NaviItem({ isActive, title, icon, onClick }: Props) {
  const colorStyle = isActive
    ? 'text-gray-600 dark:text-gray-100'
    : 'text-gray-400 dark:text-gray-400'

  const handleClick = useCallback(() => {
    if (isActive) return
    onClick()
  }, [onClick, isActive])

  return (
    <button
      className={`flex ${colorStyle} flex-col items-center justify-center w-full p-2`}
      onClick={handleClick}
    >
      <Icon name={icon} />
      <div className="text-xs mt-1">{title}</div>
    </button>
  )
}
