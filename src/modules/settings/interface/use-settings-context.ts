import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { ImportAction } from './actions/import.action'

export const { useModuleContext: useSettingsContext } = hookContextFactory({
  importAction: ImportAction,
})
