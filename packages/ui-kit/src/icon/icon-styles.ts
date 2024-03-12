import { styled } from '@linaria/react'

import type { IconSize } from '../icon/types'

export const IconWrapper = styled.span<{ size: IconSize }>`
  font-size: ${(props) => {
    switch (props.size) {
      case 'small':
        return '10px'
      case 'big':
        return '18px'
      case 'huge':
        return '28px'
      default:
      case 'normal':
        return '14px'
    }
  }};
`
