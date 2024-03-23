import { makeAutoObservable } from 'mobx'

export class Toggle {
  isOpen = false

  handleOpen = () => {
    this.isOpen = true
  }

  handleClose = () => {
    this.isOpen = false
  }

  handleToggle = () => {
    if (this.isOpen) {
      this.handleClose()
      return
    }
    this.handleOpen()
  }

  constructor() {
    makeAutoObservable(this)
  }
}
