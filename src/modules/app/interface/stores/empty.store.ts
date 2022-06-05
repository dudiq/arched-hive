import { Store } from '@pv/di'
import { CategoriesDefaultEntity } from '@pv/modules/app/core/categories-default.entity'
import { categoriesDefaultEn } from './categories-default-en'
import { categoriesDefaultRu } from './categories-default-ru'

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
