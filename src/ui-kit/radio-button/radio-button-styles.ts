import { styled } from '@linaria/react'

export const Container = styled.div`
  label {
    display: flex;
    padding: 6px 0;
  }
  input[type='radio'] {
    opacity: 0.0001;
    width: 0;
    height: 0;
    &:checked + span:before {
      color: var(--clr-primary);
      border-color: var(--clr-primary);
    }
    &:checked + span:after {
      transform: scale(1);
    }
  }

  span {
    display: inline-block;
    position: relative;
    padding: 0 0 0 22px;
    margin-bottom: 0;
    cursor: pointer;
    vertical-align: bottom;
    &:before,
    &:after {
      position: absolute;
      content: '';
      border-radius: 50%;
      transition: all 0.2s ease;
      transition-property: transform, border-color;
    }
    &:before {
      left: 0;
      top: 0;
      width: 14px;
      height: 14px;
      border: 2px solid;
      border-color: var(--clr-primary);
    }
    &:after {
      top: 5px;
      left: 5px;
      width: 8px;
      height: 8px;
      transform: scale(0);
      background-color: var(--clr-primary);
    }
  }
`
