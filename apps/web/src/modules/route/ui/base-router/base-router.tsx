import { Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

import { HistoryAdapter } from './history-adapter'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function BaseRouter({ children }: Props) {
  return (
    <Router hook={useHashLocation}>
      <HistoryAdapter />
      {children}
    </Router>
  )
}
