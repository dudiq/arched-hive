import { LocalStorageItem, Store } from '@repo/service'

import type { ThemeEntity } from '@pv/modules/theme/entities/theme.entity'

const DEFAULT_VALUE = 'light'

@Store()
export class ThemeStore {
  private themeStorage = new LocalStorageItem<ThemeEntity>('theme', {
    initialValue: DEFAULT_VALUE,
  })

  get currentTheme(): ThemeEntity {
    return this.themeStorage.value || DEFAULT_VALUE
  }

  changeTheme(value: ThemeEntity): void {
    this.themeStorage.set(value)
  }
}
