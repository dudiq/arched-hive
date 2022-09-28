import { styled } from '@linaria/react'

export const Container = styled.div`
  padding: 0 8px;
  margin-right: 8px;
  display: flex;
  flex-direction: column;
`

export const CategoryItem = styled.div`
  display: flex;
  margin: 6px 0;
  margin-top: 12px;
`

export const CategoryTitle = styled.div`
  user-select: none;
  text-decoration: underline;
  cursor: pointer;
`

export const CategoryCost = styled.div`
  margin-left: auto;
`

export const ChildCategoryItem = styled.div`
  display: flex;
  margin: 6px 0;
  margin-left: 10px;
  font-size: var(--text-size-small);
  color: var(--clr-4);
`
