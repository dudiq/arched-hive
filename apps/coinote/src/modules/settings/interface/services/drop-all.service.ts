import { t } from '@pv/interface/services/i18n'
import { CategoriesStore } from '@pv/modules/categories'
import { MessageBoxService } from '@pv/modules/message-box'
import { MoneySpendingStore } from '@pv/modules/money-spending'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { SettingsAdapter } from '../../infra/settings.adapter'

@Service()
export class DropAllService {
  constructor(
    private messageBoxService= Inject(MessageBoxService),
    private settingsAdapter= Inject(SettingsAdapter),
    private categoriesStore= Inject(CategoriesStore),
    private moneySpendingStore= Inject(MoneySpendingStore),
  ) {}

  async dropData() {
    const isConfirmed = await this.messageBoxService.confirm(t('settings.sureDrop'))
    if (!isConfirmed) return

    const result = await this.settingsAdapter.dropData()
    if (isErr(result)) {
      // TODO: add error processing
    }
    this.dropRelatedStores()
  }

  dropRelatedStores() {
    this.categoriesStore.dropCategories()
    this.moneySpendingStore.dropEntities()
  }
}
