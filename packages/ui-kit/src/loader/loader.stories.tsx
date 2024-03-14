import { Loader } from './loader'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Loader> = {
  title: 'ui-kit / Loader',
  component: Loader,
}

export const Default: StoryFn<typeof Loader> = (args) => {
  return (
    <div className="flex gap-2">
      <Loader />
    </div>
  )
}

Default.args = {}

export default meta
