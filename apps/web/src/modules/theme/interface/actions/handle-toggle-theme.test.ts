import { ThemeStore } from '@pv/theme'

import { Container, Inject } from '@repo/service'
import { beforeEach, describe, expect, it } from '@repo/unit-test'

import { handleToggleTheme } from './handle-toggle-theme'

describe('toggle-theme', () => {
  beforeEach(() => {
    Container.clear()
  })

  it('should toggle theme', () => {
    const themeStore = Inject(ThemeStore)

    expect(themeStore.currentTheme).toBe('light')

    handleToggleTheme()

    expect(themeStore.currentTheme).toBe('dark')
  })

  it('should stay light as default', () => {
    const themeStore = Inject(ThemeStore)

    expect(themeStore.currentTheme).toBe('light')
  })
})
