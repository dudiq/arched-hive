import { styled } from '@linaria/react'

export const Dot = styled.span`
  &:after {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    margin-left: -5px;
    position: relative;
    left: 10px;
    margin-bottom: 2px;
    background-color: var(--clr-primary-text);
  }
`
