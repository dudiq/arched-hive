import { styled } from '@linaria/react'

export const Container = styled.button`
  padding: 0 10px;
  border: none;
  box-shadow: 1px 1px 4px 0 var(--clr-shadow);
  min-height: 42px;
  display: inline-flex;
  align-items: center;

  background-color: var(--clr-primary);
  color: var(--clr-primary-text);

  transition: all 0.2s ease;

  &[data-variant='secondary'] {
    background-color: var(--clr-3);
    color: var(--clr-1);
  }

  &[data-variant='flat'] {
    background-color: transparent;
    box-shadow: none;
  }

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

  &:hover,
  &:active {
    box-shadow: 2px 2px 6px 0 var(--clr-shadow);
  }
`

export const Wrapper = styled.div`
  display: flex;
  &[data-has-icon='true'] {
    padding-left: 6px;
  }
`
