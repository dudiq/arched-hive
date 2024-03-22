import { useState } from 'react'

import { Input } from './input'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Input> = {
  title: 'ui-kit / Input',
  component: Input,
}

export const Default: StoryFn<typeof Input> = () => {
  const [value, setValue] = useState('')
  return (
    <div className="flex gap-2">
      <Input value={value} onChange={setValue} />
    </div>
  )
}

Default.args = {}

export default meta
