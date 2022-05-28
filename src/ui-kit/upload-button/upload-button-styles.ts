import { styled } from '@linaria/react'

export const Container = styled.div`
  display: flex;
`

export const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
`

export const Input = styled.input`
  position: absolute;
  cursor: pointer;
  width: 2000%;
  height: 1000%;
  top: 0;
  left: 0;
  opacity: 0.0001;
`
