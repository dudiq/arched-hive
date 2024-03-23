import './categories.langs'

import { useEffect } from 'react'
import { useCategoriesContext } from '@pv/categories/interface/use-categories-context'
import { Footer } from '@pv/footer/ui'
import { Header } from '@pv/header/ui'
import { t } from '@pv/i18n'
import { Layout } from '@pv/layout/ui'

import { observer } from '@repo/service'
import { Loader, ScrollContainer, Swap } from '@repo/ui-kit'

import { Controls } from './controls'
import { TreeListWrapper } from './tree-list-wrapper'

export const CategoriesPage = observer(() => {
  const { categoriesAction, categoriesStore } = useCategoriesContext()

  useEffect(() => {
    categoriesAction.handleInitialLoadCategoryList()
  }, [categoriesAction])

  return (
    <Layout
      headerSlot={<Header title={t('pages.category')} />}
      footerSlot={<Footer />}
    >
      <ScrollContainer>
        <Swap is={categoriesStore.isLoading} isSlot={<Loader />}>
          <TreeListWrapper />
        </Swap>
      </ScrollContainer>
      <Controls />
    </Layout>
  )
})
