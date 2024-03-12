import { Store } from '@repo/service'

@Store()
export class FocusStore {
  isTyping = false

  setIsTyping(value: boolean) {
    this.isTyping = value
  }
}
