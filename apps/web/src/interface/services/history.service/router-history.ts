import { Service } from '@repo/service'

type HistoryCb = (
  to: string,
  options?: { replace?: boolean | undefined } | undefined,
) => void

@Service()
export class RouterHistory {
  private historyInstance: null | HistoryCb = null

  setHistory(history: HistoryCb) {
    if (this.historyInstance !== history) {
      this.historyInstance = history
    }
  }

  get history() {
    return this.historyInstance
  }
}
