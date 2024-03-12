import { useCallback } from 'react'

export function useModalHandleClose() {
  const handleClose = useCallback(() => {
    history.go(-1)
  }, [])
  return {
    handleClose,
  }
}
