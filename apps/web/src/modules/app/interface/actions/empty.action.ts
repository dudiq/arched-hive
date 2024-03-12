import { Routes } from '@pv/constants/routes'
import { HistoryService } from '@pv/interface/services/history.service'
import { EmptyService } from '@pv/modules/app/interface/services/empty.service'

import { Action, Inject } from '@repo/service'

import type { CategoriesDefaultEntity } from '@pv/modules/app/core/categories-default.entity'

@Action()
export class EmptyAction {
  constructor(
    private readonly historyService = Inject(HistoryService),
    private readonly emptyService = Inject(EmptyService),
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
