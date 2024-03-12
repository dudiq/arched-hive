import './categories.langs'

import { useEffect } from 'react'
import { useCategoriesContext } from '@pv/modules/categories/interface/use-categories-context'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Swap } from '@repo/ui-kit'

import { Controls } from './controls'
import { TreeListWrapper } from './tree-list-wrapper'

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
