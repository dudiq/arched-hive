import { styled } from '@linaria/react'
import { css, cx } from '@linaria/core'

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

export const extendedClasses = ({
  isFullwidth,
  isCentered,
}: {
  isCentered?: boolean
  isFullwidth?: boolean
}) => {
  return cx(
    isCentered
      ? css`
          justify-content: center;
        `
      : '',
    isFullwidth
      ? css`
          flex: 1;
        `
      : '',
  )
}

export const ListCellWrapper = styled.div`
  display: flex;
`
