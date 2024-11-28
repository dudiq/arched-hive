import { ObjectStorage } from './object-storage'
import { WindowStorage } from './window-storage'

import type { StorageInterface } from './storage-interface'

export function getStorage(): StorageInterface {
  if (typeof window === 'undefined') {
    return new ObjectStorage()
  }
  return new WindowStorage()
}
