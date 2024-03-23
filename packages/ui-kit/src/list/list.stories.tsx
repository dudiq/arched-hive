import { List } from './list'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof List> = {
  title: 'ui-kit / List',
  component: List,
}

export default meta

export const Default: StoryFn<typeof List> = () => {
  return (
    <div className="h-56">
      <List>
        <List.Row>
          <List.Cell>cell1</List.Cell>
          <List.Cell>cell2</List.Cell>
        </List.Row>
        <List.Row>
          <List.Cell>cell3</List.Cell>
          <List.Cell>cell4</List.Cell>
        </List.Row>
      </List>
    </div>
  )
}
