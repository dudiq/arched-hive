import { Router } from 'wouter'
// import { useHashLocation } from './use-hash-location'
import { useHashLocation } from 'wouter/use-hash-location'

import { HistoryAdapter } from './history-adapter'

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// @ts-expect-error
const baseUrl = import.meta.env.BASE_URL.slice(0, -1)

console.log('baseUrl', baseUrl)

export function BaseRouter({ children }: Props) {
  return (
    <Router base={baseUrl} hook={useHashLocation}>
      <HistoryAdapter />
      {children}
    </Router>
  )
}
