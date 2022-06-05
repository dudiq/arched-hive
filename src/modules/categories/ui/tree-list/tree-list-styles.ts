import { styled } from '@linaria/react'

export const Container = styled.div``

export const TreeItem = styled.div`
  padding: 10px;
  margin-left: 10px;
  &[data-is-root='true'] {
    margin-left: 0;
  }
  &[data-is-active='true'] {
    background-color: var(--clr-hover);
  }
  border-top: 1px solid var(--clr-5);

  :first-child {
    border-top: none;
  }
`
