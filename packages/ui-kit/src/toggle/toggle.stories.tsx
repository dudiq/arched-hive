import { useState } from 'react'

import { Toggle } from './toggle'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Toggle> = {
  title: 'ui-kit / Toggle',
  component: Toggle,
}

export const Default: StoryFn<typeof Toggle> = () => {
  const [state, setState] = useState(false)
  return (
    <div className="flex gap-2">
      <a
        className="underline cursor-pointer flex items-center gap-2"
        onClick={() => {
          setState((value) => !value)
        }}
      >
        <Toggle checked={state} />
        <div className="text-sm text-gray-900 dark:text-gray-300">click me</div>
      </a>
    </div>
  )
}

Default.args = {}

export default meta
