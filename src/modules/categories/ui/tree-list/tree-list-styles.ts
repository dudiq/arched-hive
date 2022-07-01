import { styled } from '@linaria/react'
import { css } from '@linaria/core'

export const Container = styled.div``

export const TreeItem = styled.div<{ isRoot?: boolean; isActive?: boolean }>`
  padding: 10px;
  margin-left: 10px;
  ${(props) => {
    if (props.isRoot)
      return css`
        margin-left: 0;
      `
    return ''
  }}
  ${(props) => {
    if (props.isActive)
      return css`
        background-color: var(--clr-hover);
      `
    return ''
  }}

  border-top: 1px solid var(--clr-5);

  :first-child {
    border-top: none;
  }
`
