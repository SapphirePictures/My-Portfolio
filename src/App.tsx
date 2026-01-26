import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedWorks from './components/FeaturedWorks'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease-out
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 0.8,
      infinite: false,
      lerp: 0.05, // Very smooth interpolation
    })

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Dark mode scroll detection
    const handleScroll = () => {
      const worksSection = document.getElementById('works')
      const aboutSection = document.getElementById('about')
      
      if (worksSection && aboutSection) {
        const worksTop = worksSection.offsetTop - 200
        const aboutTop = aboutSection.offsetTop - 200
        const scrollPosition = window.scrollY
        
        // Dark mode active between works start and about start
        if (scrollPosition >= worksTop && scrollPosition < aboutTop) {
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

  return (
    <div className="font-helvetica transition-colors duration-700" style={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}>
      <Navbar isDarkMode={isDarkMode} />
      <Hero />
      <FeaturedWorks />
      <Services />
      <About />
      <Contact />
      
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-helvetica text-gray-400">
            © 2025 Wesley Saapphire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
