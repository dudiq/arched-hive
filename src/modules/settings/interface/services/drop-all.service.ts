import { Inject, Service } from '@pv/di'
import { MessageBoxService } from '@pv/modules/message-box'
import { t } from '@pv/interface/services/i18n'
import { CategoriesStore } from '@pv/modules/categories'
import { MoneySpendingStore } from '@pv/modules/money-spending'
import { SettingsAdapter } from '../../infra/settings.adapter'

@Service()
export class DropAllService {
  constructor(
    @Inject()
    private messageBoxService: MessageBoxService,
    @Inject()
    private settingsAdapter: SettingsAdapter,
    @Inject()
    private categoriesStore: CategoriesStore,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
  ) {}

  async dropData() {
    const isConfirmed = await this.messageBoxService.confirm(t('settings.sureDrop'))
    if (!isConfirmed) return

    const result = await this.settingsAdapter.dropData()
    if (result.isErr()) {
      //TODO: add error processing
    }
  }

  dropRelatedStores() {
    this.categoriesStore.dropCategories()
    this.moneySpendingStore.dropEntities()
  }
}
