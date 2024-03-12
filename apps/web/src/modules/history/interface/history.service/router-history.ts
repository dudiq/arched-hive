import { Service } from '@repo/service'

type HistoryCb = (
  to: string,
  options?: { replace?: boolean | undefined } | undefined,
) => void

@Service()
export class RouterHistory {
  private instance: undefined | HistoryCb = undefined

  setHistory(history: HistoryCb) {
    this.instance = history
  }

  history(...args: Parameters<HistoryCb>): void {
    if (!this.instance) return
    return this.instance(...args)
  }
}
