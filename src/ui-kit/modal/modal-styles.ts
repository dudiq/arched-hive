import { styled } from '@linaria/react'

export const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--clr-2);
  opacity: var(--opacity-overflow);
`
