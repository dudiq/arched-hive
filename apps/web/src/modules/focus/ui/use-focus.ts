import { useEffect } from 'react'

import { useFocusContext } from '../interface/use-focus-context'

export function useFocus() {
  const { focusAction } = useFocusContext()
  useEffect(() => {
    document.body.addEventListener('focus', focusAction.handleStartTyping, true)
    document.body.addEventListener('blur', focusAction.handleStopTyping, true)
    return () => {
      document.body.removeEventListener('focus', focusAction.handleStartTyping, true)
      document.body.removeEventListener('blur', focusAction.handleStopTyping, true)
    }
  }, [focusAction.handleStartTyping, focusAction.handleStopTyping])
}
