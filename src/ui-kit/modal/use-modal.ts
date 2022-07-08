import { useEffect, useRef, useState } from 'preact/compat'
import { guid } from '@pv/utils/guid'
import { useSearchLocation } from '@pv/interface/use-search-location'

type Args = {
  isVisible: boolean
  onClose: () => void
}

const PARAM_ID = 'modal'

export function useModal({ isVisible, onClose }: Args) {
  const [isContainerShown, setContainerShown] = useState(isVisible)
  const idRef = useRef<string>('')
  if (!idRef.current) {
    idRef.current = guid()
  }

  const [location, setLocation, hashLocation] = useSearchLocation()

  useEffect(() => {
    // on mount
    const queryParams = new URLSearchParams(window.location.search)
    queryParams.set(PARAM_ID, idRef.current)
    // @ts-ignore
    setLocation(`${location}?${queryParams.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get(PARAM_ID)
    if (id) {
      setContainerShown(id === idRef.current)
      return
    }
    onClose()
  }, [hashLocation, onClose])

  return {
    isContainerShown,
  }
}
