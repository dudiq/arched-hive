import { useEffect } from 'react'
import { useThemeContext } from '@pv/modules/theme'

import { getClassName, getClearedClass } from './classes'

const THEME_PREFIX = 'theme-'
const ANIMATE_CLASS = 'theme-animate'
const CHANGE_TIMEOUT = 1200

export function useTheme() {
  const { themeStore } = useThemeContext()

  useEffect(() => {
    const themeValue = themeStore.currentTheme
    const root = document.getElementsByTagName('html')[0]
    const oldTheme = themeValue === 'light' ? 'dark' : 'light'
    const cleanupClasses = getClearedClass(root.className, ANIMATE_CLASS)

    const newThemeClassNames = getClassName(
      cleanupClasses,
      `${THEME_PREFIX}${oldTheme}`,
      `${THEME_PREFIX}${themeValue}`,
    )
    root.className = getClassName(newThemeClassNames, ANIMATE_CLASS, ANIMATE_CLASS)

    const timerId = window.setTimeout(() => {
      root.className = newThemeClassNames
    }, CHANGE_TIMEOUT)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [themeStore.currentTheme])
}
