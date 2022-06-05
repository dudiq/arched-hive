import { Action, Inject } from '@pv/di'
import { EmptyService } from '@pv/modules/app/interface/services/empty.service'
import { CategoriesDefaultEntity } from '@pv/modules/app/core/categories-default.entity'
import { HistoryService } from '@pv/interface/services/history.service'
import { Routes } from '@pv/contants/routes'

@Action()
export class EmptyAction {
  constructor(
    @Inject()
    private readonly historyService: HistoryService,
    @Inject()
    private readonly emptyService: EmptyService,
  ) {}

  handleChangeCategory(selectedCategory: string) {
    this.emptyService.changeDefaultCategory(selectedCategory as CategoriesDefaultEntity)
  }

  async handleApplyCategory() {
    await this.emptyService.applyDefaultCategory()
    this.historyService.push(Routes.categories)
  }

  handleOpenSettings() {
    this.historyService.push(Routes.settings)
  }
}
