import { Icon } from '../icon'

import { Button } from './button'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'ui-kit / Button',
  component: Button,
}

export const Default: StoryFn<typeof Button> = (args) => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-2 w-36 flex-col">
        <div>
          <Button>default</Button>
        </div>
        <div>
          <Button shape="circle">Ci</Button>
        </div>
        <div>
          <Button shape="circle">
            <Icon name="Plus" />
          </Button>
        </div>
      </div>
    </div>
  )
}

Default.args = {
  children: 'Button title',
}

export default meta
