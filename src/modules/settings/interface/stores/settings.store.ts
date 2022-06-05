import { Store } from '@pv/di'

@Store()
export class SettingsStore {
  isLoading = false

  setIsLoading(value: boolean) {
    this.isLoading = value
  }
}
