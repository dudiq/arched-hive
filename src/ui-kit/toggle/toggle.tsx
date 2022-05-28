import { useMemo } from 'preact/compat'
import { Container } from './toggle-styles'

let swId = 1

type Props = {
  name?: string
  checked: boolean
}

export function Toggle({ name, checked }: Props) {
  const elId = useMemo(() => {
    swId++
    return name || `sw-${swId}`
  }, [name])

  return (
    <Container name={name}>
      <input type="checkbox" id={elId} name={elId} checked={checked} disabled />
      <label htmlFor={elId} />
    </Container>
  )
}

export default Toggle
