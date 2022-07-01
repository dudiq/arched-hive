import { styled } from '@linaria/react'
import { css } from '@linaria/core'

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

export const ListCellWrapper = styled.div<{ isCentered?: boolean; isFullWidth?: boolean }>`
  display: flex;
  ${(props) =>
    props.isCentered
      ? css`
          justify-content: center;
        `
      : ''}
  ${(props) =>
    props.isFullWidth
      ? css`
          flex: 1;
        `
      : ''}
`
