import { render } from 'preact'
import { HelloUi } from './ui/hello-ui'

export function startRender() {
  const node = document.getElementById('root')
  if (!node) return
  render(<HelloUi />, node)
}
