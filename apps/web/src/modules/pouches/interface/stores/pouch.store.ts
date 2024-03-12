import { t } from '@pv/interface/services/i18n'

import { LocalStorageItem, Store } from '@repo/service'

import type {
  PouchEntity,
  PouchId,
} from '@pv/modules/pouches/core/pouch.entity'

@Store()
export class PouchStore {
  private pouchLocalStorage = new LocalStorageItem<PouchId>('pouch')

  isLoading = true

  isModalVisible = false

  pouches: PouchEntity[] = []

  setModalVisible(value: boolean) {
    this.isModalVisible = value
  }

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
