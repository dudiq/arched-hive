import { autorun } from 'mobx'
import { vi } from 'vitest'

import { beforeEach, describe, expect, it } from '@repo/unit-test'

import { Container } from '../container'

import * as getStorageModule from './storage/get-storage'
import { ObjectStorage } from './storage/object-storage'
import { LocalStorageItem } from './local-storage-item'

describe('LocalStorageItem', () => {
  beforeEach(() => {
    // Clear container between tests
    Container.clear()
    // Mock getStorage to always return ObjectStorage for consistent testing
    vi.spyOn(getStorageModule, 'getStorage').mockImplementation(
      () => new ObjectStorage(),
    )
  })

  it('should create instance with initial value', () => {
    const item = new LocalStorageItem<string>('test', {
      initialValue: 'initial',
    })

    expect(item.value).toBe('initial')
  })

  it('should throw error when creating duplicate key', () => {
    new LocalStorageItem('test')

    expect(() => new LocalStorageItem('test')).toThrow(
      'Cache key "test" is already in use for "LocalStorageItem"',
    )
  })

  it('should use custom prefix', () => {
    const item = new LocalStorageItem('test', {
      initialValue: 'value',
      prefix: '@custom',
    })

    expect(item.usedKey).toBe('@custom-test')
  })

  it('should set and get value', () => {
    const item = new LocalStorageItem<string>('test')

    item.set('new value')

    expect(item.value).toBe('new value')
  })

  it('should remove value', () => {
    const item = new LocalStorageItem<string>('test', {
      initialValue: 'initial',
    })

    item.set('value')
    item.remove()

    expect(item.value).toBe('initial')
  })

  it('should handle invalid JSON when getting value', () => {
    const storage = new ObjectStorage()
    vi.spyOn(getStorageModule, 'getStorage').mockReturnValue(storage)

    // Set invalid JSON directly in storage
    storage.setItem('@repo:test', 'invalid json')

    const item = new LocalStorageItem<string>('test', {
      initialValue: 'fallback',
    })

    expect(item.value).toBe('fallback')
  })

  it('should handle null values', () => {
    const item = new LocalStorageItem<string | null>('test', {
      initialValue: null,
    })

    expect(item.value).toBeNull()

    item.set(null)
    expect(item.value).toBeNull()
  })

  it('should cleanup on container clear', () => {
    const item = new LocalStorageItem<string>('test')
    const disposeSpy = vi.spyOn(item, 'dispose')

    Container.clear()

    expect(disposeSpy).toHaveBeenCalled()
  })

  it('should be observable', () => {
    const item = new LocalStorageItem<string>('test')
    let callCount = 0

    // Create reaction to track changes
    const dispose = autorun(() => {
      // Access value to track changes
      item.value
      callCount++
    })

    item.set('new value')

    expect(callCount).toBe(2) // Initial + one change
    dispose()
  })
})
