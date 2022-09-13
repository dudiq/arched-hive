import { styled } from '@linaria/react'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Content = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
`

export const TotalMoneyRow = styled.div`
  margin: 10px 0;
  font-size: var(--text-size-big);
  display: flex;
  & > *:last-child {
    margin-left: auto;
  }
`
