import { Icon } from '../icon'

export function Loader() {
  return (
    <div className="flex items-center justify-center h-10 w-10 animate-spin">
      <Icon name="Load" size="normal" />
    </div>
  )
}

export function BlockLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-10">
      <Loader />
    </div>
  )
}
