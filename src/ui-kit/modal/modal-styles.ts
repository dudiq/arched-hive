import { styled } from '@linaria/react'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  right: 0;
`

export const ContainerBg = styled.div`
  z-index: 2;
  max-height: 100vh;
  overflow: auto;
  min-width: 320px;
  background-color: var(--clr-2);
  box-shadow: 4px 8px 30px -4px var(--clr-shadow);
  border-radius: 6px;
  padding: 10px;
`

export const Overlay = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--clr-2);
  opacity: var(--opacity-overflow);
`
