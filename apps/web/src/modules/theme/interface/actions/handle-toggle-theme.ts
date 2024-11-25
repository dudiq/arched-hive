import { ThemeStore } from '@pv/theme/interface/stores/theme.store'

import { Inject } from '@repo/service'

export function handleToggleTheme() {
  const themeStore = Inject(ThemeStore)
  const theme = themeStore.currentTheme
  const newTheme = theme === 'light' ? 'dark' : 'light'
  themeStore.changeTheme(newTheme)
}
