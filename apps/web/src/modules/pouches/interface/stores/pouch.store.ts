import { t } from '@pv/i18n'

import { LocalStorageItem, Store } from '@repo/service'

import type { PouchEntity, PouchId } from '@pv/pouches/core/pouch.entity'

@Store()
export class PouchStore {
  private pouchLocalStorage = new LocalStorageItem<PouchId>('pouch')

  isLoading = true

  pouches: PouchEntity[] = []

  get currentPouch() {
    const pouchId = this.pouchLocalStorage.value
    if (!pouchId) return undefined
    return this.pouches.find(({ id }) => pouchId === id)
  }

  get currentPouchId() {
    const pouch = this.currentPouch
    return pouch?.id || null
  }

  get currentPouchName() {
    return this.currentPouch?.name || t('export.pouchMain')
  }

  setCurrentPouch(id: PouchId) {
    this.pouchLocalStorage.set(id)
  }

  setIsLoading(value: boolean) {
    this.isLoading = value
  }

  setPouches(value: PouchEntity[]) {
    this.pouches = value
  }

  dropEntities() {
    this.setPouches([])
  }
}
