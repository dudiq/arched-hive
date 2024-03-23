import { useState } from 'react'

import { Button } from '../button'

import { Modal } from './modal'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof Modal> = {
  title: 'ui-kit / Modal',
  component: Modal,
}

export default meta

export const Default: StoryFn<typeof Modal> = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="h-56">
      <div className="flex gap-4">
        <Button onClick={() => setOpen((val) => !val)}>open modal</Button>
      </div>

      <Modal isOpen={isOpen}>
        <Modal.Header title="modal title" onClose={() => setOpen(false)} />
        <Modal.Body>this is body</Modal.Body>
        <Modal.Footer>footer</Modal.Footer>
      </Modal>
    </div>
  )
}
