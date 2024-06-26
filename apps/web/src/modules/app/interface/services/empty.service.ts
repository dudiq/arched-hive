import { defineCategoriesAdapter } from '@pv/app/infra/define-categories.adapter'
import { LangStore } from '@pv/language'

import { Inject, Service } from '@repo/service'

import { EmptyStore } from '../stores/empty.store'

import type { CategoriesDefaultEntity } from '@pv/app/core/categories-default.entity'

@Service()
export class EmptyService {
  constructor(
    private emptyStore = Inject(EmptyStore),
    private langStore = Inject(LangStore),
  ) {}

  changeDefaultCategory(selectedCategory: CategoriesDefaultEntity): void {
    this.emptyStore.changeDefaultCategory(selectedCategory)
  }

  async applyDefaultCategory(): Promise<void> {
    const lang = this.emptyStore.selectedDefaultCategories
    this.langStore.changeLanguage(lang)
    const categories = this.emptyStore.defaultCategories
    if (!categories) return
    await defineCategoriesAdapter(categories)
  }
}
