import { Store } from '@pv/di'
import { LocalStorageItem } from '@pv/interface/services/local-storage-item'
import { ThemeEntity } from '@pv/modules/theme/entities/theme.entity'

const DEFAULT_VALUE = 'light'

@Store()
export class ThemeStore {
  private themeStorage = new LocalStorageItem<ThemeEntity>('@theme', {
    initialValue: DEFAULT_VALUE,
  })

  get currentTheme() {
    return this.themeStorage.value || DEFAULT_VALUE
  }

  changeTheme(value: ThemeEntity) {
    this.themeStorage.set(value)
  }
}
