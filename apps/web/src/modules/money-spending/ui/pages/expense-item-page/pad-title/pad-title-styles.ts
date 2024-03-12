import { styled } from '@linaria/react'

export const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
  text-align: right;
  border: 1px solid var(--clr-5);
`

export const TotalCost = styled.div`
  opacity: var(--opacity-disabled);
  font-size: var(--text-size-tiny);
  height: 18px;
  padding: 0 4px;
`

export const CurrentCost = styled.div`
  font-size: var(--text-size-big);
  padding: 0 4px;
`

export const CostView = styled.div`
  height: 18px;
  padding: 0 4px;
  opacity: var(--opacity-disabled);
  font-size: var(--text-size-tiny);
`
