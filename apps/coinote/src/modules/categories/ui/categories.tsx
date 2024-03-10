import { useEffect } from 'preact/compat'
import { observer } from '@repo/service'
import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { Loader } from '@pv/ui-kit/loader'
import { Swap } from '@pv/ui-kit/swap'
import { Controls } from './controls'
import { TreeListWrapper } from './tree-list-wrapper'

import './categories.langs'

export const Categories = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()

  useEffect(() => {
    categoriesAction.handleInitialLoadCategoryList()
  }, [categoriesAction])

  return (
    <>
      <ScrollContainer>
        <Swap is={categoriesStore.isLoading} isSlot={<Loader />}>
          <TreeListWrapper />
        </Swap>
      </ScrollContainer>
      <Controls />
    </>
  )
})
