import { styled } from '@linaria/react'
import { css, cx } from '@linaria/core'
import { ButtonShape, ButtonVariant } from './types'

const variantClass = (variant?: ButtonVariant) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: var(--clr-3);
        color: var(--clr-1);
      `
    case 'flat':
      return css`
        background-color: transparent;
        box-shadow: none;
      `
    default:
      return ''
  }
}

const shapeClass = (shape?: ButtonShape) => {
  switch (shape) {
    case 'circle':
      return css`
        border-radius: 50%;
        width: 52px;
        display: flex;
        justify-content: center;
        height: 52px;
      `
    case 'rect':
      return css`
        border-radius: 4px;
      `
    default:
      return ''
  }
}

export const extendedClasses = ({
  variant,
  shape,
}: {
  variant?: ButtonVariant
  shape?: ButtonShape
}) => {
  return cx(variantClass(variant), shapeClass(shape))
}

export const Container = styled.button<{ variant?: ButtonVariant; shape?: ButtonShape }>`
  padding: 0 10px;
  border: none;
  box-shadow: 1px 1px 4px 0 var(--clr-shadow);
  min-height: 42px;
  display: inline-flex;
  align-items: center;

  background-color: var(--clr-primary);
  color: var(--clr-primary-text);

  transition: all 0.2s ease;
  ${(props) => variantClass(props.variant)};

  &:hover,
  &:active {
    box-shadow: 2px 2px 6px 0 var(--clr-shadow);
  }
  &:disabled {
    opacity: 0.4;
  }
`

export const Wrapper = styled.div<{ hasIcon?: boolean }>`
  display: flex;
  ${(props) => {
    if (!props.hasIcon) return ''
    return css`
      padding-left: 6px;
    `
  }}
`
