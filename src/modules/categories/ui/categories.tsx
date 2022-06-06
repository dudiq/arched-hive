import { useEffect } from 'preact/compat'
import { observer } from 'mobx-react-lite'
import { ScrollContainer } from '@pv/ui-kit/scroll-container'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'
import { Loader } from '@pv/ui-kit/loader'
import { Swap } from '@pv/ui-kit/swap'
import { Controls } from './controls'
import { TreeList } from './tree-list'

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
          <TreeList />
        </Swap>
      </ScrollContainer>
      <Controls />
    </>
  )
})
