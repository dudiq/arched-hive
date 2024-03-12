import { ThemeStore } from '@pv/theme/interface/stores/theme.store'

import { Action, Inject } from '@repo/service'

@Action()
export class ThemeAction {
  constructor(
    private readonly themeStore = Inject(ThemeStore),
  ) {}

  handleToggleTheme() {
    const theme = this.themeStore.currentTheme
    const newTheme = theme === 'light' ? 'dark' : 'light'
    this.themeStore.changeTheme(newTheme)
  }
}
