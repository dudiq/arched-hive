import { Service } from '@pv/di'

type HistoryCb = (to: string, options?: { replace?: boolean | undefined } | undefined) => void

@Service()
export class RouterHistory {
  private historyInstance: null | HistoryCb = null

  setHistory(history: HistoryCb) {
    if (this.historyInstance !== history) {
      this.historyInstance = history
      setTimeout(() => {
        history('/settings')
      }, 5000)
    }
  }

  get history() {
    return this.historyInstance
  }
}
