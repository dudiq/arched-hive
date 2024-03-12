import { Icon, List } from '@repo/ui-kit'

import { IconWrapper, LastNode } from './list-block-styles'

import type { IconNames } from '@repo/ui-kit'
import type { ComponentChildren } from 'preact'

type Props = {
  onClick: () => void
  icon: IconNames
  title: string
  children: ComponentChildren
}

export function ListBlock({ onClick, icon, title, children }: Props) {
  return (
    <List.Row onClick={onClick}>
      <List.Cell isCentered>
        <IconWrapper>
          <Icon iconName={icon} />
        </IconWrapper>
      </List.Cell>
      <List.Cell isFullwidth>{title}</List.Cell>
      <List.Cell>
        <LastNode>{children}</LastNode>
      </List.Cell>
    </List.Row>
  )
}
