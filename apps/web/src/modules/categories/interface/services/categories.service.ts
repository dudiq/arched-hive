import { t } from '@pv/i18n'
import { guid } from '@pv/app/interface/guid'
import { MessageBoxService } from '@pv/message-box'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import { CategoriesAdapter } from '../../infra/categories.adapter'
import { CategoriesStore } from '../../interface/stores/categories.store'

import type { CategoryEntity } from '@pv/categories/core/category.entity'

@Service()
export class CategoriesService {
  constructor(
    private messageBoxService = Inject(MessageBoxService),
    private categoriesAdapter = Inject(CategoriesAdapter),
    private categoriesStore = Inject(CategoriesStore),
  ) {}

  async removeCategory() {
    const category = this.categoriesStore.selectedCategory
    if (!category) return

    const isConfirmed = await this.messageBoxService.confirm(t('category.confirmRemove'))
    if (!isConfirmed) return

    const result = await this.categoriesAdapter.removeCategory(category.id)
    if (isErr(result)) {
      // TODO: add error processing
      return
    }
    this.categoriesStore.setSelectedCategoryId('')
    await this.loadCategories()
  }

  async editCategory() {
    const category = this.categoriesStore.selectedCategory
    if (!category) return

    const { isApplied, data: newTitle } = await this.messageBoxService.prompt(
      t('category.edit'),
      category.title,
    )
    if (!isApplied) return

    const result = await this.categoriesAdapter.updateCategoryTitle(category.id, newTitle)
    if (isErr(result)) {
      // TODO: add error processing
      return
    }
    await this.loadCategories()
  }

  async addCategory() {
    const parentCategoryId = this.categoriesStore.selectedCategoryId
    const { isApplied, data: categoryName } = await this.messageBoxService.prompt(
      parentCategoryId ? t('category.addSubNew') : t('category.addNew'),
    )
    if (!isApplied) return

    const node: CategoryEntity = {
      id: guid(),
      catId: parentCategoryId,
      title: categoryName,
    }

    const addResult = await this.categoriesAdapter.addCategory(node)
    if (isErr(addResult)) {
      // TODO: add error processing
      return
    }
    await this.loadCategories()
  }

  async loadCategories() {
    this.categoriesStore.state.start()
    const result = await this.categoriesAdapter.getCategories()
    this.categoriesStore.state.setResult(result)
    this.categoriesStore.state.finish()
  }
}
