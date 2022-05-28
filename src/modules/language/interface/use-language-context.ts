import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { LanguageAction } from './actions/language.action'
import { LangStore } from './stores/lang.store'

export const { useModuleContext: useLanguageContext } = hookContextFactory({
  langAction: LanguageAction,
  langStore: LangStore,
})
