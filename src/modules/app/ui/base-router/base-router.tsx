import { Router } from 'wouter-preact'
import { ComponentChildren } from 'preact'
import { useHashLocation } from './use-hash-location'
import { HistoryAdapter } from './history-adapter'

type Props = {
  children: ComponentChildren
}

// @ts-ignore
const baseUrl = import.meta.env.VITE_BASE_URL.slice(0, -1)

export function BaseRouter({ children }: Props) {
  return (
    <Router base={baseUrl} hook={useHashLocation}>
      <HistoryAdapter />
      {children}
    </Router>
  )
}
