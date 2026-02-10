import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedWorks from './components/FeaturedWorks'
import Services from './components/Services'
import About from './components/About'
import ContactCTA from './components/ContactCTA'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const handleFooterClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (clickTimer) {
      clearTimeout(clickTimer)
    }

    if (newCount === 3) {
      setClickCount(0)
      navigate('/admin')
    } else {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 1000)
      setClickTimer(timer)
    }
  }

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic ease-out
    } as any)

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Dark mode scroll detection
    const handleScroll = () => {
      const worksSection = document.getElementById('works')
      const servicesSection = document.getElementById('services')
      
      if (worksSection && servicesSection) {
        const worksTop = worksSection.offsetTop - 200
        const servicesTop = servicesSection.offsetTop - 200
        const scrollPosition = window.scrollY
        
        // Dark mode active only between works start and services start
        if (scrollPosition >= worksTop && scrollPosition < servicesTop) {
          setIsDarkMode(true)
        } else {
          setIsDarkMode(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Don't check initial position - let it be false by default
    // handleScroll()

    // Cleanup
    return () => {
      lenis.destroy()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Toggle dark class on html element for Tailwind dark mode
    console.log('Dark mode changed to:', isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (!location.hash) return

    const id = location.hash.replace('#', '')
    const target = document.getElementById(id)
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.hash])

  return (
    <div className="font-helvetica transition-colors duration-700" style={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}>
      <Navbar isDarkMode={isDarkMode} />
      <Hero />
      <FeaturedWorks />
      <Services />
      <About />
      <ContactCTA />
      
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p 
            onClick={handleFooterClick}
            className="font-helvetica text-gray-400 cursor-pointer select-none"
          >
            © 2025 Wesley Sapphire Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
