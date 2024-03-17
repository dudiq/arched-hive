import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { useContainerClick } from '@pv/dom/interface/get-attr-from-element'
import { getMoney } from '@pv/i18n'

import { observer } from '@repo/service'

export const AnalyticCategory = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()
  const handleClick = useContainerClick(
    'data-id',
    analyticAction.handleToggleSelectedCategory,
  )

  return (
    <div onClick={handleClick}>
      {analyticStore.categoryReportView.map((item) => {
        return (
          <div key={item.node.id}>
            <div data-id={item.node.id}>
              <div>{item.node.title}</div>
              <div>{getMoney(item.node.cost)}</div>
            </div>
            {item.children.map((child) => {
              return (
                <div key={child.id} data-id={child.id}>
                  <div>{child.title}</div>
                  <div>{getMoney(child.cost)}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
})
