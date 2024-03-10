import { styled } from '@linaria/react'

export const Row = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  color: var(--clr-1);
  flex: 1;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  min-height: 42px;
`

export const IconWrapper = styled.div`
  margin: 4px 10px;
  min-width: 20px;
`

export const TitleWrapper = styled.div`
  cursor: pointer;
  margin-right: 10px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ActionWrapper = styled.div`
  margin-left: auto;
`
