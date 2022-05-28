import { render } from 'preact'
import { App } from './app'

export function startRender() {
  const node = document.getElementById('root')
  if (!node) return
  render(<App />, node)
}
