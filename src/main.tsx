import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AboutPage from './pages/AboutPage.tsx'

const isAbout = window.location.pathname.startsWith('/about')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAbout ? <AboutPage /> : <App />}
  </StrictMode>,
)
