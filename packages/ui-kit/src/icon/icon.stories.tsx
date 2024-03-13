import { useState } from 'react'

import { Input } from '../input'

import { Icon } from './icon'
import * as assets from './icon-assets'

import type { Meta, StoryFn } from '@storybook/react'
import type { IconName } from './icon'

const meta: Meta = {
  title: 'ui-kit / Icon',
  component: Icon,
}

const Icons = ({
  filter,
  containerSize,
}: {
  filter: string
  containerSize: number
}) => {
  const lowerFilter = filter.toLowerCase()
  return (
    <div className="flex flex-wrap">
      {Object.keys(assets).map((key) => {
        const isPassed = !filter
          ? true
          : key.toLowerCase().includes(lowerFilter)
        if (!isPassed) return null
        return (
          <div
            key={key}
            className="m-px border flex items-center justify-center border-primary-700"
            style={{
              width: `${containerSize}px`,
              height: `${containerSize}px`,
            }}
            title={key}
          >
            <Icon name={key as IconName} />
          </div>
        )
      })}
    </div>
  )
}

export const Default: StoryFn<typeof Icon> = () => {
  const [value, setValue] = useState('')
  return (
    <div className="flex-col flex gap-6">
      <Input value={value} onChange={setValue} />
      <div className="flex text-gray-400">
        <Icons containerSize={24} filter={value} />
      </div>
      <div className="flex text-gray-400">
        <Icons containerSize={52} filter={value} />
      </div>
    </div>
  )
}

export default meta
