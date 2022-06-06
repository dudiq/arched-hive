import { Action, Inject } from '@pv/di'
import { HistoryService } from '@pv/interface/services/history.service'
import { Routes } from '@pv/contants/routes'
import { CategoriesService } from '../services/categories.service'
import { CategoriesStore } from '../stores/categories.store'

@Action()
export class CategoriesAction {
  constructor(
    @Inject()
    private categoriesService: CategoriesService,
    @Inject()
    private categoriesStore: CategoriesStore,
    @Inject()
    private readonly historyService: HistoryService,
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

    this.categoriesStore.setIsLoading(true)
    await this.categoriesService.loadCategories()
    this.categoriesStore.setIsLoading(false)

    if (this.categoriesStore.isEmptyCategories) {
      this.historyService.push(Routes.empty)
    }
  }

  toggleSelectedCategoryId(categoryId: string) {
    const nextCatId = this.categoriesStore.selectedCategoryId === categoryId ? '' : categoryId

    this.categoriesStore.setSelectedCategoryId(nextCatId)
  }
}
