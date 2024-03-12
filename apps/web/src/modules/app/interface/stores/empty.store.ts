import { Store } from '@repo/service'

import { categoriesDefaultEn } from './categories-default-en'
import { categoriesDefaultRu } from './categories-default-ru'

import type { CategoriesDefaultEntity } from '@pv/app/core/categories-default.entity'

const defaultCategories: Record<CategoriesDefaultEntity, any> = {
  en: categoriesDefaultEn,
  ru: categoriesDefaultRu,
}

@Store()
export class EmptyStore {
  selectedDefaultCategories: CategoriesDefaultEntity = 'en'

  changeDefaultCategory(value: CategoriesDefaultEntity) {
    this.selectedDefaultCategories = value
  }

  get defaultCategories() {
    return defaultCategories[this.selectedDefaultCategories]
  }
}
