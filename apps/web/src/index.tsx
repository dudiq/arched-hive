import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from '@pv/app/ui/app';

import '@repo/ui-kit/tailwind.base.css'
import './styles/normalize.css'

function start() {
  setTimeout(() => {
    const node = document.getElementById('root')
    if (!node) {
      console.error('Node not found')
      return
    }

    ReactDOM.createRoot(node).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }, 0)
}

start()
