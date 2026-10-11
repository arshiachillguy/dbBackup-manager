import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationsProvider } from './lib/NotificationsProvider'
import { PreferencesProvider } from './lib/PreferencesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </PreferencesProvider>
  </StrictMode>,
)
