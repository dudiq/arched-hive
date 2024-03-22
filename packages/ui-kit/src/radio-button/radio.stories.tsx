import { useState } from 'react'

import { RadioButton } from './radio-button'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof RadioButton> = {
  title: 'ui-kit / RadioButton',
  component: RadioButton,
}

export const Default: StoryFn<typeof RadioButton> = () => {
  const [state, setState] = useState('first')
  return (
    <div className="flex gap-2 flex-col">
      <RadioButton
        name="check"
        value="first"
        checkValue={state}
        onChange={setState}
      >
        first
      </RadioButton>
      <RadioButton
        name="check"
        value="second"
        checkValue={state}
        onChange={setState}
      >
        second
      </RadioButton>
    </div>
  )
}

Default.args = {}

export default meta
