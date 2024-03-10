import { Select } from '@repo/ui-kit/select'
import { useDateRangeSelect } from './use-date-range-select'
import {observer} from "@repo/service";

export const DateRangeSelect = observer(() => {
  const { reportView, options, onChange } = useDateRangeSelect()

  return <Select onChange={onChange} options={options} value={reportView} />
})
