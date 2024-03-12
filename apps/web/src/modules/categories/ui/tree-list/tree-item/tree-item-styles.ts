import { styled } from '@linaria/react'
import { css, cx } from '@linaria/core'

export const extendedClasses = ({ isActive, isRoot }: { isActive?: boolean; isRoot?: boolean }) => {
  return cx(
    isRoot
      ? css`
          margin-left: 0;
        `
      : css`
          margin-left: 10px;
        `,
    isActive
      ? css`
          background-color: var(--clr-hover);
        `
      : '',
  )
}

export const TreeItemContainer = styled.div`
  padding: 10px;

  border-top: 1px solid var(--clr-5);

  :first-child {
    border-top: none;
  }
`
