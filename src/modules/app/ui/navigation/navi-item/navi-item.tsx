import { observer } from 'mobx-react-lite'
import { IconNames } from '@pv/ui-kit/icon/types'
import { Icon } from '@pv/ui-kit/icon'
import { Container, Title } from './navi-item-styles'
import { useNaviItem } from './use-navi-item'

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
