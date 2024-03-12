import { Routes } from '@pv/route/interface/routes'
import { HistoryService } from '@pv/history/interface/history.service'

import { Action, Inject } from '@repo/service'

import { CategoriesService } from '../services/categories.service'
import { CategoriesStore } from '../stores/categories.store'

@Action()
export class CategoriesAction {
  constructor(
    private categoriesService = Inject(CategoriesService),
    private categoriesStore = Inject(CategoriesStore),
    private readonly historyService = Inject(HistoryService),
  ) {}

  handleAddCategory() {
    this.categoriesService.addCategory()
  }

  handleEditCategory() {
    this.categoriesService.editCategory()
  }

  handleRemoveCategory() {
    this.categoriesService.removeCategory()
  }

  async handleInitialLoadCategoryList() {
    if (!this.categoriesStore.isEmptyCategories) return

    await this.categoriesService.loadCategories()

    if (this.categoriesStore.isEmptyCategories) {
      this.historyService.push(Routes.empty)
    }
  }

  toggleSelectedCategoryId(categoryId: string) {
    const nextCatId = this.categoriesStore.selectedCategoryId === categoryId ? '' : categoryId

    this.categoriesStore.setSelectedCategoryId(nextCatId)
  }
}
