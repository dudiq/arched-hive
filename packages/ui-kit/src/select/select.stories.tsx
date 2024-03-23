import { useState } from 'react'

import { Select } from './select'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Select> = {
  title: 'ui-kit / Select',
  component: Select,
}

export const Default: StoryFn<typeof Select> = () => {
  const [state, setState] = useState('1')
  return (
    <div className="flex gap-2">
      <Select
        options={[
          { value: '1', label: 'first' },
          { value: '2', label: 'second' },
        ]}
        value={state}
        onChange={setState}
      />
    </div>
  )
}

Default.args = {}

export default meta
