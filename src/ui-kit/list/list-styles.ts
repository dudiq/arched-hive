import { styled } from '@linaria/react'

export const ListContainer = styled.div``

export const ListRow = styled.div`
  display: flex;
  min-height: 50px;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: var(--clr-hover);
  }
`

export const ListCellWrapper = styled.div`
  display: flex;
  &[data-is-centered] {
    justify-content: center;
  }
  &[data-is-fullwidth] {
    flex: 1;
  }
`
