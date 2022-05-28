import { observer } from 'mobx-react-lite'
import { Separator } from '@pv/ui-kit/separator'
import { Container, Title } from './header-styles'
import { useHeader } from './use-header'

export const Header = observer(() => {
  const { title } = useHeader()

  return (
    <>
      <Container>
        <Title>{title}</Title>
      </Container>
      <Separator />
    </>
  )
})
