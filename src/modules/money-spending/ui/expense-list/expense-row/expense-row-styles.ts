import { styled } from '@linaria/react'

export const Container = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid var(--clr-5);

  &[data-is-selected='true'] {
    background-color: var(--clr-hover);
  }
`

export const LeftBlock = styled.div`
  flex: 1;
`

export const RightBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  padding-right: 6px;
`

export const Title = styled.div``

export const SubTitle = styled.div`
  color: var(--clr-4);
`

export const Money = styled.div`
  font-size: var(--text-size-big);
`

export const DateTitle = styled.div`
  color: var(--clr-4);
  font-size: var(--text-size-tiny);
`
