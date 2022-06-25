import { styled } from '@linaria/react'

export const Container = styled.div`
  width: 200px;
  border-bottom: 0;
  display: inline-block;
  position: relative;
  padding: 8px 0;
  padding-bottom: 10px;

  input {
    color: var(--clr-primary-text);
    font-size: var(--text-size-normal);
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    border-radius: 0; //ios fix
    border-bottom-color: var(--clr-5);

    &:focus {
      outline: none;
      border-bottom-color: var(--clr-1);
    }
  }

  input[readonly] {
    opacity: var(--opacity-overflow);
  }
`
