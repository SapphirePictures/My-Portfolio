import { useEffect, useRef, useState } from 'react'

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
    <section id="about" ref={sectionRef} className="relative min-h-screen bg-white dark:bg-black overflow-hidden px-6">
      {/* Background Title */}
      <div className="absolute inset-x-0 top-6 pointer-events-none select-none z-0">
        <h1
          className="text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[10vw] font-helvetica font-extralight text-blue-600 dark:text-blue-500 leading-none uppercase whitespace-nowrap tracking-[0.02em]"
          style={{ lineHeight: 0.85 }}
        >
          ABOUT ME
        </h1>
      </div>

      {/* Content layer */}
      <div className="relative z-10 px-0 md:px-2 lg:px-6 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto relative">
          {/* Floating Name on the left */}
          <div className="md:w-1/2">
            <h2
              ref={nameRef}
              className="text-blue-600 dark:text-blue-500 text-5xl md:text-6xl lg:text-7xl font-helvetica font-bold uppercase tracking-tight"
              style={{ transform: 'translateY(0px)', transition: isInView ? 'transform 0.1s linear' : 'none' }}
            >
              WESLEY OJEDAPO
            </h2>

            {/* CTA below the name on the left */}
            <div className="mt-96">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-12 py-7 bg-blue-600 text-white text-3xl rounded-none font-helvetica hover:bg-blue-700 transition-colors"
              >
                Get to know Me
              </a>
            </div>

            {/* Short description */}
            <div className="absolute top-96 left-0 w-96">
              <p className="font-helvetica text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Visual designer crafting bold brand identities and clean interfaces for modern businesses.
              </p>
            </div>
          </div>

          {/* Portrait Image overlayed above the big title - large contained div */}
          <div className="md:absolute md:right-0 md:top-6 lg:top-12 z-20 w-full md:w-auto" style={{ height: '120vh' }}>
            <div className="relative h-full w-full flex items-center justify-end">
              <img
                src="/assets/about/PNG.png"
                alt="Portrait of Wesley"
                className="h-full w-auto object-contain scale-125"
                style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.25))', maxHeight: '120vh' }}
              />
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}

export default About
