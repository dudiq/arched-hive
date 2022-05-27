import { render } from 'preact'
import { Routing } from './ui/routing'

export function startRender() {
  const node = document.getElementById('root')
  if (!node) return
  render(<Routing />, node)
}
