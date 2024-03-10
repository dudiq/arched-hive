import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from '@pv/modules/app/ui/app';

function start() {
  new Promise<void>((resolve) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    resolve()
  })
}

start()

