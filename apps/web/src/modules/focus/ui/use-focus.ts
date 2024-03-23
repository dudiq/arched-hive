import { useEffect } from 'react'
import { useInject } from '@pv/app/interface/use-inject'

import { FocusAction } from '../interface/action/focus.action'

export function useFocus() {
  const { focusAction } = useInject({
    focusAction: FocusAction,
  })

  useEffect(() => {
    document.body.addEventListener('focus', focusAction.handleStartTyping, true)
    document.body.addEventListener('blur', focusAction.handleStopTyping, true)
    return () => {
      document.body.removeEventListener(
        'focus',
        focusAction.handleStartTyping,
        true,
      )
      document.body.removeEventListener(
        'blur',
        focusAction.handleStopTyping,
        true,
      )
    }
  }, [focusAction.handleStartTyping, focusAction.handleStopTyping])
}
