import { makeObservable, observable } from 'mobx'

type OptionsType<T> = {
  initialValue: T
}

type Maybe<T> = T | undefined | null

export class LocalStorageItem<T> {
  value: Maybe<T>

  constructor(private readonly key: string, private readonly options?: OptionsType<T>) {
    this.value = this.getValue()
    window.addEventListener('storage', (event) => {
      if (!event.key || event.key === key) {
        this.value = this.getValue()
      }
    })

    makeObservable(this, {
      value: observable,
    })
  }

  set(value: T) {
    this.value = value
    try {
      const storedValue = JSON.stringify({ value })
      window.localStorage.setItem(this.key, storedValue)
    } catch (e) {}
  }

  private getValue(): Maybe<T> {
    const storedValue = window.localStorage.getItem(this.key)
    if (!storedValue) {
      return this.options?.initialValue
    }
    try {
      const result = JSON.parse(storedValue)
      if (!result) return this.options?.initialValue
      return result.value as unknown as Maybe<T>
    } catch (e) {}
  }

  remove() {
    return window.localStorage.removeItem(this.key)
  }
}
