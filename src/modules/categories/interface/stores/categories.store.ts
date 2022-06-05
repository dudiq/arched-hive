import { Store } from '@pv/di'
import { CategoryEntity } from '@pv/core/entities/category.entity'

type FilterCbType = (value: CategoryEntity) => boolean

type TreeListType = { item: CategoryEntity; isRoot?: boolean }[]

@Store()
export class CategoriesStore {
  filter?: FilterCbType

  selectedCategoryId = ''

  isLoading = true

  categoryList: CategoryEntity[] = []

  setIsLoading(value: boolean) {
    this.isLoading = value
  }

  setSelectedCategoryId(value: string) {
    this.selectedCategoryId = value
  }

  setCategoryList(value: CategoryEntity[]) {
    this.categoryList = value
  }

  setFilter(callback: FilterCbType) {
    this.filter = callback
  }

  private checkFilter(item: CategoryEntity): boolean {
    if (!this.filter) return true
    return this.filter(item)
  }

  private get maps() {
    const rootMap: Record<
      string,
      {
        parent: CategoryEntity
        children: string[]
      }
    > = {}
    const categoryMap: Record<string, CategoryEntity> = {}

    this.categoryList.forEach((item) => {
      categoryMap[item.id] = item
      const isRoot = !item.catId
      const createId = item.catId ? item.catId : item.id
      const parent = (rootMap[createId] = rootMap[createId] || {
        children: [],
      })
      if (isRoot) return
      if (!this.checkFilter(item)) return
      parent.children.push(item.id)
    })

    return {
      rootMap,
      categoryMap,
    }
  }

  get isEmptyCategories() {
    return this.categoryList.length === 0
  }

  get selectedCategory(): CategoryEntity | undefined {
    return this.categoryList.find((category) => category.id === this.selectedCategoryId)
  }

  get categoryTree() {
    const { categoryMap, rootMap } = this.maps
    const filteredKeys = Object.keys(rootMap).filter((key) => {
      const item = categoryMap[key]
      if (!item) return false
      return this.checkFilter(item)
    })

    const result = filteredKeys.reduce<TreeListType>((acc, key) => {
      const item = categoryMap[key]
      const rootEl = rootMap[key]
      acc.push({
        item,
        isRoot: true,
      })
      rootEl.children.forEach((id) => {
        const node = categoryMap[id]
        acc.push({
          item: node,
        })
      })
      return acc
    }, [])

    return result
  }
}
