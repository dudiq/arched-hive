import { styled } from '@linaria/react'

export const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
`

export const Row = styled.div`
  display: table;
  width: 100%;
`

export const PadButton = styled.button`
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  width: 25%;
  height: 52px;
  //border: 1px solid var(--clr-2);
  background-color: var(--clr-3);
  color: var(--clr-primary-text);
  &[data-width='half'] {
    width: 50%;
  }
  &[data-type='apply'] {
    background-color: var(--clr-primary);
  }
  &[data-type='secondary'] {
    background-color: var(--clr-5);
  }
`
