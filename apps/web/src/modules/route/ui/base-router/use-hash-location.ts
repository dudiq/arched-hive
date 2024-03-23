// ---------------- hash support ------------------------

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
import { useCallback, useEffect, useRef, useState } from 'react'

import type { BaseLocationHook } from 'wouter'

const currentLocation = (base: string, path = window.location.hash.replace('#', '')) =>
  !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || '/' : `~${path}`

const base = ''

export const useHashLocation: BaseLocationHook = () => {
  const [{ path }, setState] = useState({ path: currentLocation(base), search: '' })
  const prevHash = useRef(path)

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => {
      const baseHash = currentLocation(base)
      if (prevHash.current !== baseHash) {
        prevHash.current = baseHash
        const [newLoc, newSearch] = baseHash.split('?')
        setState({
          path: newLoc,
          search: newSearch,
        })
      }
    }

    // subscribe to hash changes
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base])

  const navigate = useCallback(
    (to: string) => {
      window.location.hash = to[0] === '~' ? to.slice(1) : base + to
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [base],
  )

  return [path, navigate]
}
