import {useInject} from '@pv/app/interface/use-inject';

import { LanguageAction } from './actions/language.action'
import { LangStore } from './stores/lang.store'

export function useLanguageContext() {
  return useInject({
    langAction: LanguageAction,
    langStore: LangStore,
  })
}
