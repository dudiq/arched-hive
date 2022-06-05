import { styled } from '@linaria/react'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--clr-2);
  opacity: var(--opacity-default);
  z-index: 1;
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  animation-name: spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
