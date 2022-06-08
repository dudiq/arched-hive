import { Action, Inject } from '@pv/di'
import { FocusStore } from '@pv/modules/focus/interface/stores/focus.store'

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
  const nodeName = el.nodeName.toLowerCase() as string
  // @ts-ignore
  const flags = USED_NODES[nodeName]

  if (!(flags && flags.type)) {
    return !!flags
  }

  // @ts-ignore
  // eslint-disable-next-line no-prototype-builtins
  if (flags.type.hasOwnProperty(el.type) && flags.type[el.type] === false) {
    return false
  }

  return !!flags
}

@Action()
export class FocusAction {
  constructor(
    @Inject()
    private focusStore: FocusStore,
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
