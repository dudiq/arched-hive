import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'
import { useContainerClick } from '@pv/dom/interface/get-attr-from-element'
import { getMoney } from '@pv/i18n'

import { observer } from '@repo/service'
import { Icon, Swap } from '@repo/ui-kit'

export const AnalyticCategory = observer(() => {
  const { analyticStore, analyticAction } = useAnalyticContext()
  const handleClick = useContainerClick(
    'data-id',
    analyticAction.handleToggleSelectedCategory,
  )

  return (
    <div onClick={handleClick} className="flex flex-col gap-4 px-4">
      {analyticStore.categoryReportView.map((item) => {
        const isSelected = analyticStore.selectedCategoryId === item.node.id
        const icon = isSelected ? 'ALeft' : 'Plus'
        return (
          <div key={item.node.id}>
            <button
              className="w-full flex text-lg text-gray-500 pr-2 border-b border-gray-300 dark:border-gray-800 py-1"
              data-id={item.node.id}
            >
              <div className="flex items-center gap-2">
                <Icon name={icon} />
                {item.node.title}
              </div>
              <div className="ml-auto">{getMoney(item.node.cost)}</div>
            </button>
            <Swap has={!isSelected}>
              <div className="flex flex-col mr-6">
                {item.children.map((child) => {
                  const isSelected =
                    analyticStore.selectedCategoryId === child.id
                  const icon = isSelected ? 'ALeft' : 'Plus'
                  return (
                    <button
                      className="w-full flex ml-4 py-2 border-b border-gray-300 dark:border-gray-800"
                      key={child.id}
                      data-id={child.id}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={icon} />
                        {child.title}
                      </div>
                      <div className="ml-auto">{getMoney(child.cost)}</div>
                    </button>
                  )
                })}
              </div>
            </Swap>
          </div>
        )
      })}
    </div>
  )
})
