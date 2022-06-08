import { Inject, Service } from '@pv/di'
import { MessageBoxService } from '@pv/modules/message-box'
import { t } from '@pv/interface/services/i18n'
import { guid } from '@pv/utils/guid'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { CategoriesAdapter } from '../../infra/categories.adapter'
import { CategoriesStore } from '../../interface/stores/categories.store'

@Service()
export class CategoriesService {
  constructor(
    @Inject()
    private messageBoxService: MessageBoxService,
    @Inject()
    private categoriesAdapter: CategoriesAdapter,
    @Inject()
    private categoriesStore: CategoriesStore,
  ) {}

  async removeCategory() {
    const category = this.categoriesStore.selectedCategory
    if (!category) return

    const isConfirmed = await this.messageBoxService.confirm(t('category.confirmRemove'))
    if (!isConfirmed) return

    const result = await this.categoriesAdapter.removeCategory(category.id)
    if (result.isErr()) {
      //TODO: add error processing
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
    if (result.isErr()) {
      //TODO: add error processing
      return
    }
    await this.loadCategories()
  }

  async addCategory() {
    const { isApplied, data: categoryName } = await this.messageBoxService.prompt(
      t('category.addNew'),
    )
    if (!isApplied) return

    const node: CategoryEntity = {
      id: guid(),
      catId: this.categoriesStore.selectedCategoryId,
      title: categoryName,
    }

    const addResult = await this.categoriesAdapter.addCategory(node)
    if (addResult.isErr()) {
      //TODO: add error processing
      return
    }
    await this.loadCategories()
  }

  async loadCategories() {
    const result = await this.categoriesAdapter.getCategories()
    if (result.isErr()) {
      //TODO: add error processing
      return
    }
    const categories = result.getValue()
    this.categoriesStore.setCategoryList(categories)
  }
}
