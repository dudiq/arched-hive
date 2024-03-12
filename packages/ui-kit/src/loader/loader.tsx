import { Icon } from '../icon'

import { Container, Wrapper } from './loader-styles'

export function Loader() {
  return (
    <Wrapper>
      <Icon iconName="load" iconSize="big" />
    </Wrapper>
  )
}

export function BlockLoader() {
  return (
    <Container>
      <Loader />
    </Container>
  )
}
