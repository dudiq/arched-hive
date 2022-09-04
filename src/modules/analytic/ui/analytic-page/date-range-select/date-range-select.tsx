import { Select } from '@pv/ui-kit/select'
import { observer } from 'mobx-react-lite'
import { useDateRangeSelect } from './use-date-range-select'

export const DateRangeSelect = observer(() => {
  const { reportView, options, onChange } = useDateRangeSelect()

  return (
    <div>
      <Select onChange={onChange} options={options} value={reportView} />
    </div>
  )
})
