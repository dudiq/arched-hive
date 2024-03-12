import { observer } from '@repo/service'
import { Icon } from '@repo/ui-kit'

import { Container, Title } from './navi-item-styles'
import { useNaviItem } from './use-navi-item'

import type { IconNames } from '@repo/ui-kit'

type Props = {
  path: string
  isMatch?: boolean
  icon: IconNames
  title: string
}

export const NaviItem = observer(({ isMatch, path, icon, title }: Props) => {
  const { isMatched, handleChangePage } = useNaviItem({ isMatch, path })

  return (
    <Container isMatched={isMatched} onClick={handleChangePage}>
      <Icon iconName={icon} />
      <Title>{title}</Title>
    </Container>
  )
})
