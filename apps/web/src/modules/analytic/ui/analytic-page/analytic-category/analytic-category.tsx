import { useContainerClick } from '@pv/interface/get-attr-from-element'
import { getMoney } from '@pv/interface/services/i18n'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'

import { observer } from '@repo/service'

import {
  CategoryCost,
  CategoryItem,
  CategoryTitle,
  ChildCategoryItem,
  Container,
} from './analytic-category-styles'

export const AnalyticCategory = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()
  const handleClick = useContainerClick(
    'data-id',
    analyticAction.handleToggleSelectedCategory,
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
