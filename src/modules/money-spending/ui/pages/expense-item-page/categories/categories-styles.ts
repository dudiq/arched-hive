import { styled } from '@linaria/react'

export const Header = styled.div`
  min-height: 54px;
  display: flex;
  align-items: center;
  margin-left: 6px;
`

export const CategoryTag = styled.button`
  background-color: transparent;
  border-radius: 10px;
  height: 32px;
  margin: 4px;
  color: var(--clr-primary-text);
  border: 1px solid var(--clr-primary);
  display: inline-flex;
  align-items: center;

  &[data-is-selected='true'] {
    border: 1px solid var(--clr-primary-text);
  }
`
