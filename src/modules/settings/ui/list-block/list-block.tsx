import { List } from '@pv/ui-kit/list'
import { Icon } from '@pv/ui-kit/icon'
import { IconNames } from '@pv/ui-kit/icon/types'
import { ComponentChildren } from 'preact'
import { IconWrapper, LastNode } from './list-block-styles'

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
