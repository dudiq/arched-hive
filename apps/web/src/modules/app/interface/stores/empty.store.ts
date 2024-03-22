import { Store } from '@repo/service'

import { categoriesDefaultEn } from './categories-default-en'
import { categoriesDefaultRu } from './categories-default-ru'

import type { CategoriesDefaultEntity } from '@pv/app/core/categories-default.entity'
import type { CategoryEntity } from '@pv/categories/core/category.entity'

const defaultCategories: Record<CategoriesDefaultEntity, CategoryEntity[]> = {
  en: categoriesDefaultEn,
  ru: categoriesDefaultRu,
}

@Store()
export class EmptyStore {
  selectedDefaultCategories: CategoriesDefaultEntity = 'en'

  changeDefaultCategory(value: CategoriesDefaultEntity): void {
    this.selectedDefaultCategories = value
  }

  get defaultCategories(): CategoryEntity[] {
    return defaultCategories[this.selectedDefaultCategories]
  }
}
