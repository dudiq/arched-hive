import { styled } from '@linaria/react'

export const Container = styled.button`
  padding: 0 10px;
  background-color: var(--clr-primary);
  border: none;
  color: var(--clr-primary-text);
  box-shadow: 1px 1px 4px 0 var(--clr-shadow);
  min-height: 42px;
  display: flex;
  align-items: center;
  &[data-shape='rect'] {
    border-radius: 4px;
  }
  &[data-shape='circle'] {
    border-radius: 50%;
    width: 52px;
    display: flex;
    justify-content: center;
    height: 52px;
  }
`
