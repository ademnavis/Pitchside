import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ✅ Import PWA register function
import { registerSW } from 'virtual:pwa-register'

// ✅ Register service worker with auto update handling
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New version available. Refreshing...')
    updateSW(true) // force update
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)