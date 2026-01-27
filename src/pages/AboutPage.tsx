import { useEffect, useRef, useState } from 'react'

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

const AboutPage = () => {
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
      const progress = clamp(1 - rect.top / viewportH, -1, 2) // a range that keeps moving across scroll
      // Map progress to a vertical translation. Repeat feel via continuous linkage to scroll.
      const offset = clamp(progress * 80, -120, 120) // px
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
    <section ref={sectionRef} className="relative min-h-screen bg-white dark:bg-black overflow-hidden">
      {/* Background Title */}
      <div className="absolute inset-x-0 top-6 pointer-events-none select-none">
        <h1
          className="text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[10vw] font-garnet text-blue-600 dark:text-blue-500 leading-none tracking-tighter uppercase whitespace-nowrap"
          style={{ lineHeight: 0.85 }}
        >
          ABOUT ME
        </h1>
      </div>

      {/* Content layer */}
      <div className="relative z-10 px-6 md:px-8 lg:px-12 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Floating Name */}
          <div className="md:col-span-6">
            <h2
              ref={nameRef}
              className="text-blue-600 dark:text-blue-500 text-5xl md:text-6xl lg:text-7xl font-helvetica font-bold uppercase tracking-tight"
              style={{ transform: 'translateY(0px)', transition: isInView ? 'transform 0.1s linear' : 'none' }}
            >
              WESLEY OJEDAPO
            </h2>
          </div>

          {/* Portrait Image */}
          <div className="md:col-span-6 flex justify-center md:justify-end">
            <img
              src="/assets/about/portrait.png"
              alt="Portrait of Wesley"
              className="w-[85%] md:w-[100%] max-w-[900px] object-contain"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))' }}
            />
          </div>
        </div>

        {/* CTA Button bottom-right */}
        <div className="relative mt-12">
          <div className="flex justify-end">
            <a
              href="#about-details"
              className="inline-flex items-center justify-center px-8 py-6 bg-blue-600 text-white text-2xl rounded-none font-helvetica hover:bg-blue-700 transition-colors"
            >
              Get to know Me
            </a>
          </div>
        </div>
      </div>

      {/* Details anchor for CTA target (optional placeholder) */}
      <div id="about-details" className="relative z-10 px-6 md:px-8 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-helvetica">
            I craft brand identities, clean interfaces, and expressive visuals for modern businesses. This page will include more about my background, approach, and values. (We can expand this with your copy.)
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
