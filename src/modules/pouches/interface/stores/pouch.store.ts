import { Store } from '@pv/di'
import { PouchEntity } from '@pv/core/entities/pouch.entity'
import { LocalStorageItem } from '@pv/interface/services/local-storage-item'
import { t } from '@pv/interface/services/i18n'

@Store()
export class PouchStore {
  private pouchLocalStorage = new LocalStorageItem<string>('pouch')

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
