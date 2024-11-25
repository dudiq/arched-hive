import { EmptyService } from '@pv/app/interface/services/empty.service'
import { HistoryService } from '@pv/history/interface/history.service'
import { LangStore } from '@pv/language'
import { Routes } from '@pv/route/interface/routes'

import { Action, Inject } from '@repo/service'

import type { CategoriesDefaultEntity } from '@pv/app/core/categories-default.entity'

@Action()
export class EmptyAction {
  constructor(
    private readonly historyService = Inject(HistoryService),
    private readonly emptyService = Inject(EmptyService),
    private readonly langStore = Inject(LangStore),
  ) {}

  handleChangeCategory(selectedCategory: CategoriesDefaultEntity) {
    this.langStore.changeLanguage(selectedCategory)
    this.emptyService.changeDefaultCategory(selectedCategory)
  }

  async handleApplyCategory() {
    await this.emptyService.applyDefaultCategory()
    this.historyService.push(Routes.categories)
  }

  handleOpenSettings() {
    this.historyService.push(Routes.settings)
  }
}
