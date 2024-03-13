import { useCallback } from 'react'

// import { Container } from './input-styles'
import type { ChangeEvent } from 'react'

type Props = {
  type?: 'text'
  value?: string
  onChange: (value: string) => void
}

export function Input({ value, type = 'text', onChange }: Props) {
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const target = ev.target
      onChange(target.value)
    },
    [onChange],
  )

  return (
    <div>
      <input type={type} value={value} onChange={handleChange} />
    </div>
  )
}
