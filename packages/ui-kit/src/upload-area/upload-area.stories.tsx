import { Link } from '../link'

import { UploadArea } from './upload-area'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof UploadArea> = {
  title: 'ui-kit / UploadArea',
  component: UploadArea,
}

export const Default: StoryFn<typeof UploadArea> = (args) => {
  return (
    <div className="flex gap-2">
      <UploadArea {...args}>
        <Link icon="Upload">upload file</Link>
      </UploadArea>
    </div>
  )
}

Default.args = {}

export default meta
