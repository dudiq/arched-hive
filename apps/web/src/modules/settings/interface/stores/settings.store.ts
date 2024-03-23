import { Store } from '@repo/service'

@Store()
export class SettingsStore {
  isLoading = false

  setIsLoading(value: boolean) {
    this.isLoading = value
  }
}
