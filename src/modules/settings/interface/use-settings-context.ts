import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { SettingsAction } from './actions/settings.action'
import { SettingsStore } from './stores/settings.store'

export const { useModuleContext: useSettingsContext } = hookContextFactory({
  settingsAction: SettingsAction,
  settingsStore: SettingsStore,
})
