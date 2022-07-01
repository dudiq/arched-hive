import { styled } from '@linaria/react'

export const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
`

export const Row = styled.div`
  display: table;
  width: 100%;
`

export const PadButton = styled.button<{ viewType?: 'apply' | 'secondary'; widthFill?: 'half' }>`
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  width: ${(props) => (props.widthFill === 'half' ? '50%' : '25%')};
  height: 52px;
  background-color: ${(props) => {
    switch (props.viewType) {
      case 'secondary':
        return 'var(--clr-5)'
      case 'apply':
        return 'var(--clr-primary)'
      default:
        return 'var(--clr-3)'
    }
  }};
  color: var(--clr-primary-text);
`
