import { Store } from '@pv/di'

@Store()
export class FocusStore {
  isTyping = false

  setIsTyping(value: boolean) {
    this.isTyping = value
  }
}
