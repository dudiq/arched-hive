import { styled } from '@linaria/react'

export const ButtonWrapper = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
`

export const Item = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  &:nth-child(1) {
    right: 70px;
  }
  &:nth-child(2) {
    right: 140px;
  }
`
