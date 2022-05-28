import { ComponentType } from 'preact'

export type RouteEntity = {
  route: {
    path?: string
    exact?: boolean
  }
  documentTitle: string
  component: ComponentType<unknown>
  withHeader?: boolean
  withNavigation?: boolean
}
