import { styled } from '@linaria/react'

export const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

export const ContentWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  -webkit-overflow-scrolling: touch; //ios bug
`
export const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`
export const Header = styled.div``
export const Footer = styled.div``
