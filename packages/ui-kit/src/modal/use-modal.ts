import { useEffect, useRef, useState } from 'react'

import { MODAL_PARAM_ID } from './constants'
import { useSearchLocation } from './use-search-location'

type Args = {
  isVisible: boolean
  onClose: () => void
}

let count = 1

export function useModal({ isVisible, onClose }: Args) {
  const [isContainerShown, setContainerShown] = useState(isVisible)
  const idRef = useRef<string>('')
  const prevStateRef = useRef(false)
  if (!idRef.current) {
    count++
    idRef.current = String(count)
  }

  const [usedLocation, setLocation] = useSearchLocation()
  const hash = window.location.hash

  const [basePath, searchLocation] = (usedLocation as string).split('?')

  useEffect(() => {
    // on mount
    const queryParams = new URLSearchParams(searchLocation)
    queryParams.set(MODAL_PARAM_ID, idRef.current)
    const newLocation = `${basePath}?${queryParams.toString()}`
    // @ts-expect-error
    setLocation(newLocation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const searchFromHash = hash.split('?')[1] || ''
    const queryParams = new URLSearchParams(searchFromHash)
    const id = queryParams.get(MODAL_PARAM_ID)
    const isShown = id === idRef.current
    const isStateChanged = prevStateRef.current !== isShown
    prevStateRef.current = isShown
    if (!isStateChanged) return
    if (id) {
      setContainerShown(isShown)
      return
    }
    onClose()
  }, [hash, onClose])

  return {
    isContainerShown,
  }
}
