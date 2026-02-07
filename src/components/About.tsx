import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

const About = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const nameRef = useRef<HTMLHeadingElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !nameRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(section)

    let rafId = 0
    const onScroll = () => {
      if (!section || !nameRef.current) return
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight
      const progress = clamp(1 - rect.top / viewportH, -1, 2)
      const offset = clamp(progress * 80, -120, 120)
      nameRef.current.style.transform = `translateY(${offset}px)`
    }

    const loop = () => {
      onScroll()
      rafId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative bg-white dark:bg-black overflow-hidden px-6 py-16 flex items-center justify-center">
      {/* Content layer - faint background covers all elements */}
      <div className="relative z-10 w-full max-w-7xl bg-gray-100 dark:bg-gray-900 px-8 md:px-12 py-12 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
          {/* Left: Title */}
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-helvetica font-bold text-blue-600 dark:text-blue-500 leading-tight tracking-tight max-w-sm flex-shrink-0"
          >
            Hi, I'm Wesley
          </h2>

          {/* Middle: Description with constrained width */}
          <p className="font-helvetica text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xs flex-shrink-0">
            Visual designer crafting bold brand identities and clean interfaces for modern businesses.
          </p>

          {/* Right: CTA button - blue outlined */}
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 text-base rounded-lg font-helvetica hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all flex-shrink-0 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  )
}

export default About
