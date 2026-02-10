import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ContactPage from './pages/ContactPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import WorksPage from './pages/WorksPage.tsx'
import CategoryPage from './pages/CategoryPage.tsx'
import CaseStudyDetail from './pages/CaseStudyDetail.tsx'
import RouteHistoryTracker from './components/RouteHistoryTracker.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteHistoryTracker />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/works/:category" element={<CategoryPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
