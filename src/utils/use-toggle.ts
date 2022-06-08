import { useCallback, useMemo, useState } from 'preact/compat'

export function useToggle(defaultState = false) {
  const [isOpen, setOpenState] = useState(defaultState)

  const handleOpen = useCallback(() => {
    setOpenState(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpenState(false)
  }, [])

  const handleToggle = useCallback(() => {
    setOpenState((oldValue) => !oldValue)
  }, [])

  return useMemo(() => {
    return {
      isOpen,
      handleOpen,
      handleClose,
      handleToggle,
    }
  }, [handleClose, handleOpen, handleToggle, isOpen])
}
