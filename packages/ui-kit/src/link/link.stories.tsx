import { Link } from './link'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Link> = {
  title: 'ui-kit / Link',
  component: Link,
}

export const Default: StoryFn<typeof Link> = (args) => {
  return (
    <div className="flex gap-2">
      <Link icon="Plus">this is link with icon</Link>
    </div>
  )
}

Default.args = {}

export default meta
