import { observer } from 'mobx-react-lite'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'
import { getMoney } from '@pv/interface/services/i18n'
import { useCallback } from 'react'
import { getAttrFromElement } from '@pv/interface/get-attr-from-element'
import {
  CategoryCost,
  CategoryItem,
  CategoryTitle,
  ChildCategoryItem,
  Container,
} from './analytic-category-styles'

export const AnalyticCategory = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()
  const handleClick = useCallback(
    (e) => {
      const categoryId = getAttrFromElement(e.target as HTMLElement, 'data-id')
      if (!categoryId) return
      analyticAction.handleToggleSelectedCategory(categoryId)
    },
    [analyticAction],
  )

  return (
    <Container onClick={handleClick}>
      {analyticStore.categoryReportView.map((item) => {
        return (
          <div key={item.node.id}>
            <CategoryItem data-id={item.node.id}>
              <CategoryTitle>{item.node.title}</CategoryTitle>
              <CategoryCost>{getMoney(item.node.cost)}</CategoryCost>
            </CategoryItem>
            {item.children.map((child) => {
              return (
                <ChildCategoryItem key={child.id} data-id={child.id}>
                  <CategoryTitle>{child.title}</CategoryTitle>
                  <CategoryCost>{getMoney(child.cost)}</CategoryCost>
                </ChildCategoryItem>
              )
            })}
          </div>
        )
      })}
    </Container>
  )
})
