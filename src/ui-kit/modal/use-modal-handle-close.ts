import { useCallback } from 'preact/compat'

export function useModalHandleClose() {
  const handleClose = useCallback(() => {
    history.go(-1)
  }, [])
  return {
    handleClose,
  }
}
