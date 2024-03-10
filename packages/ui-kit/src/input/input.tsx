import { useCallback } from 'preact/compat'
import { Container } from './input-styles'

type Props = {
  type?: 'text'
  value?: string
  onChange: (value: string) => void
}

export function Input({ value, type = 'text', onChange }: Props) {
  const handleChange = useCallback(
    (ev: Event) => {
      const target = ev.target as HTMLInputElement
      onChange(target.value)
    },
    [onChange],
  )

  return (
    <Container>
      <input type={type} value={value} onChange={handleChange} />
    </Container>
  )
}
