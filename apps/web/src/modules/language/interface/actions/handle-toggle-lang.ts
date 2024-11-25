import { Inject } from '@repo/service'

import { LangStore } from '../stores/lang.store'

export function handleToggleLanguage(): void {
  const langStore = Inject(LangStore)
  const currentLang = langStore.currentLanguage
  const newLang = currentLang === 'ru' ? 'en' : 'ru'
  langStore.changeLanguage(newLang)
}
