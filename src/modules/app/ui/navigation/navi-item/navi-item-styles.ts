import { styled } from '@linaria/react'

export const Container = styled.button`
  height: 50px;
  cursor: pointer;
  font-size: var(--text-size-tiny);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  opacity: var(--opacity-disabled);
  transition: opacity 0.2s ease;
  background-color: transparent;
  border: none;
  color: var(--clr-1);
  &:hover {
    opacity: var(--opacity-default);
  }
  &[data-is-matched] {
    opacity: 1;
  }
`

export const Title = styled.div`
  margin-top: 4px;
`
