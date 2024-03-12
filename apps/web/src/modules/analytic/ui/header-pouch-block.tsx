import { PouchBlock } from '@pv/pouches'
import { observer } from '@repo/service'
import { useAnalyticContext } from '@pv/analytic/interface/use-analytic-context'

export const HeaderPouchBlock = observer(() => {
  const { analyticAction } = useAnalyticContext()

  return (
    <PouchBlock
      onSelect={() => {
        analyticAction.reloadAnalytic()
      }}
    />
  )
})
