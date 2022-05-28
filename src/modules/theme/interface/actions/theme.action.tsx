import { Action, Inject } from '@pv/di'
import { ThemeStore } from '@pv/modules/theme/interface/stores/theme.store'

@Action()
export class ThemeAction {
  constructor(
    @Inject()
    private readonly themeStore: ThemeStore,
  ) {}

  handleToggleTheme() {
    const theme = this.themeStore.currentTheme
    const newTheme = theme === 'light' ? 'dark' : 'light'
    this.themeStore.changeTheme(newTheme)
  }
}
