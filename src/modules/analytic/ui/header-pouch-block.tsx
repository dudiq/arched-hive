import { PouchBlock } from '@pv/modules/pouches'
import { observer } from 'mobx-react-lite'
import { useAnalyticContext } from '@pv/modules/analytic/interface/use-analytic-context'

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
