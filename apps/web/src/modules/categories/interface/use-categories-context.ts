import { useInject } from '@pv/service/interface/use-inject'

import { CategoriesAction } from './actions/categories.action'
import { CategoriesStore } from './stores/categories.store'

export function useCategoriesContext() {
  return useInject({
    categoriesAction: CategoriesAction,
    categoriesStore: CategoriesStore,
  })
}
