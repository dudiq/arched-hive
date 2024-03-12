import { ComponentType } from 'preact'

export type RouteEntity = {
  route: {
    path?: string
    exact?: boolean
  }
  header?: {
    title: () => string
    component?: ComponentType<unknown>
  }
  component: ComponentType<unknown>
  withHeader?: boolean
  withNavigation?: boolean
}
