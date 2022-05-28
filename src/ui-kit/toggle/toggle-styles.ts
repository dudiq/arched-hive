import { styled } from '@linaria/react'

export const Container = styled.div<{ name?: string }>`
  padding: 10px 0;
  display: inherit;

  input {
    display: none;
  }

  label {
    cursor: pointer;
    padding-right: 35px;
    position: relative;
    display: block;
  }

  input[type='checkbox'],
  input[type='radio'] {
    position: absolute;
    visibility: hidden !important;
  }

  input[type='checkbox'] + label,
  input[type='radio'] + label {
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      margin-top: -7.5px;
      box-sizing: border-box;
    }

    &:before {
      width: 30px;
      height: 15px;
      right: 0;
      background-color: var(--clr-5);
      border-radius: 15px;
    }

    &:after {
      width: 21px;
      height: 21px;
      right: 14px;
      margin-top: -10px;
      background-color: var(--clr-disable);

      border-radius: 50%;
      transition: all 0.2s ease-out;
      box-shadow: 2px 2px 10px 0 var(--clr-shadow);
    }
  }

  input[type='checkbox']:checked,
  input[type='radio']:checked {
    + label {
      &:after {
        right: -4px;
        background-color: var(--clr-primary);
      }
    }
  }
`
