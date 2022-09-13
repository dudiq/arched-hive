import { Inject, Service } from '@pv/di'
import { CategoriesDefaultEntity } from '@pv/modules/app/core/categories-default.entity'
import { LangStore } from '@pv/modules/language'
import { AppAdapter } from '@pv/modules/app/infra/app.adapter'
import { isErr } from '@pv/modules/result'
import { EmptyStore } from '../stores/empty.store'

@Service()
export class EmptyService {
  constructor(
    @Inject()
    private emptyStore: EmptyStore,
    @Inject()
    private langStore: LangStore,
    @Inject()
    private appAdapter: AppAdapter,
  ) {}

  changeDefaultCategory(selectedCategory: CategoriesDefaultEntity) {
    this.emptyStore.changeDefaultCategory(selectedCategory)
  }

  async applyDefaultCategory() {
    const lang = this.emptyStore.selectedDefaultCategories
    this.langStore.changeLanguage(lang)
    const categories = this.emptyStore.defaultCategories
    if (!categories) return
    const result = await this.appAdapter.defineCategories(categories)
    if (isErr(result)) {
      //TODO: add error processing
      return
    }
  }
}
