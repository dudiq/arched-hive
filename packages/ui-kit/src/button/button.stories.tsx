import { Button } from './button'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'ui-kit / Button',
  component: Button,
}

export const Default: StoryFn<typeof Button> = (args) => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-2 flex-col w-36">
        <Button>default</Button>
        <Button shape="circle">circle</Button>
      </div>
    </div>
  )
}

Default.args = {
  children: 'Button title',
}

export default meta
