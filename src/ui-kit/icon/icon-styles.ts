import { styled } from '@linaria/react'

export const IconWrapper = styled.span`
  &[data-size='small'] {
    font-size: 10px;
  }
  &[data-size='normal'] {
    font-size: 14px;
  }
  &[data-size='big'] {
    font-size: 18px;
  }
  &[data-size='huge'] {
    font-size: 28px;
  }
`
