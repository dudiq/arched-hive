import { Icon, List } from '@repo/ui-kit'

import type { IconNames } from '@repo/ui-kit'
import type { ReactNode } from 'react'

type Props = {
  onClick: () => void
  icon: IconNames
  title: string
  children: ReactNode
}

export function ListBlock({ onClick, icon, title, children }: Props) {
  return (
    <List.Row onClick={onClick}>
      <List.Cell>
        <Icon iconName={icon} />
      </List.Cell>
      <List.Cell>{title}</List.Cell>
      <List.Cell>{children}</List.Cell>
    </List.Row>
  )
}
