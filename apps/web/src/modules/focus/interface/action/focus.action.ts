import { Action, Inject } from '@repo/service'

import { FocusStore } from '../stores/focus.store'

// is-focused
const USED_NODES = {
  input: {
    type: {
      file: false,
      radio: false,
      checked: false,
    },
  },
  textarea: true,
}

function canPass(ev: Event): boolean {
  const el = ev.target as HTMLElement
  const nodeName = el.nodeName.toLowerCase()
  // @ts-expect-error
  const flags = USED_NODES[nodeName]

  if (!flags?.type) {
    return !!flags
  }

  // @ts-expect-error
  // eslint-disable-next-line no-prototype-builtins
  if (flags.type.hasOwnProperty(el.type) && flags.type[el.type] === false) {
    return false
  }

  return !!flags
}

@Action()
export class FocusAction {
  constructor(
    private focusStore = Inject(FocusStore),
  ) {}

  handleStartTyping(ev: Event) {
    const isTyping = canPass(ev)
    if (!isTyping) return
    this.focusStore.setIsTyping(true)
  }

  handleStopTyping(ev: Event) {
    const isTyping = canPass(ev)
    if (!isTyping) return
    this.focusStore.setIsTyping(false)
  }
}
