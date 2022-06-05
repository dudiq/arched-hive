import { Service } from '@pv/di'

const windowConfirm = window.confirm
const windowPrompt = window.prompt
const windowAlert = window.alert

@Service()
export class MessageBoxService {
  async confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (windowConfirm(message)) return resolve(true)
      return resolve(false)
    })
  }

  async prompt(
    message: string,
    defaultValue?: string,
  ): Promise<{ data: string; isApplied: boolean }> {
    return new Promise((resolve) => {
      const data = windowPrompt(message, defaultValue) as unknown as string | null
      if (data) return resolve({ data, isApplied: true })
      resolve({ isApplied: false, data: '' })
    })
  }

  async alert(message: string): Promise<void> {
    return new Promise((resolve) => {
      windowAlert(message)
      return resolve()
    })
  }
}
