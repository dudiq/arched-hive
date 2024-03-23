import { Router } from 'wouter'

import { HistoryAdapter } from './history-adapter'
import { useCustomHashLocation } from './use-custom-hash-location'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// @ts-expect-error
const baseUrl = import.meta.env.BASE_URL.slice(0, -1)

export function BaseRouter({ children }: Props) {
  return (
    <Router base={baseUrl} hook={useCustomHashLocation}>
      <HistoryAdapter />
      {children}
    </Router>
  )
}
