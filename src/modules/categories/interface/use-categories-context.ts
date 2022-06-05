import { hookContextFactory } from '@pv/interface/services/hook-context-factory'
import { CategoriesAction } from './actions/categories.action'
import { CategoriesStore } from './stores/categories.store'

export const { useModuleContext: useCategoriesContext } = hookContextFactory({
  categoriesAction: CategoriesAction,
  categoriesStore: CategoriesStore,
})
