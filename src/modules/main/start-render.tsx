import { render } from 'preact'
import { Main } from './ui/main'

export function startRender() {
  const node = document.getElementById('root')
  if (!node) return
  render(<Main />, node)
}
