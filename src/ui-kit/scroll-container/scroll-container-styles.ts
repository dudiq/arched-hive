import { styled } from '@linaria/react'

export const ScrollContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  -webkit-overflow-scrolling: touch; //ios bug
`
