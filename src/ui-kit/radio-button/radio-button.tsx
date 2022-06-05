import { useCallback } from 'preact/compat'
import { ComponentChildren } from 'preact'
import { Container } from './radio-button-styles'

type Props = {
  isChecked?: boolean
  name: string
  value: string
  onChange: (value: string) => void
  children: ComponentChildren
}

export function RadioButton({ isChecked, name, value, children, onChange }: Props) {
  const handleChange = useCallback(
    (ev: any) => {
      const value = ev.target.value
      onChange(value)
    },
    [onChange],
  )

  return (
    <Container>
      <label>
        <input value={value} name={name} checked={isChecked} type="radio" onChange={handleChange} />
        <span />
        {children}
      </label>
    </Container>
  )
}
