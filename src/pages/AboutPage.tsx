import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

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
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar isDarkMode={false} />
      <section ref={sectionRef} className="relative min-h-screen bg-white dark:bg-black overflow-hidden">
        {/* Content layer */}
        <div className="relative z-10 px-6 md:px-8 lg:px-12 pt-24 md:pt-28">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Name */}
            <div>
              <h2
                ref={nameRef}
                className="text-blue-600 dark:text-blue-500 text-5xl md:text-6xl lg:text-7xl font-helvetica font-bold uppercase tracking-tight"
                style={{ transform: 'translateY(0px)', transition: isInView ? 'transform 0.1s linear' : 'none' }}
              >
                WESLEY OJEDAPO
              </h2>
            </div>

            {/* Portrait Image */}
            <div className="flex justify-center md:justify-end -mr-20 md:-mr-40 lg:-mr-56">
              <img
                src="/assets/about/PNG.png"
                alt="Portrait of Wesley"
                className="w-full md:w-full md:max-w-5xl h-auto object-contain"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))' }}
              />
            </div>
          </div>
        </div>

        {/* Details section */}
        <div id="about-details" className="relative z-10 px-6 md:px-8 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-helvetica font-bold text-blue-600 dark:text-blue-500 mb-8">About Wesley</h3>
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-helvetica">
              <p>
                I'm Wesley Ojedapo, a visual designer specializing in bold brand identities and clean, modern interfaces. 
                My work bridges the gap between artistic expression and functional design, creating experiences that resonate 
                with audiences and drive business success.
              </p>
              <p>
                With a foundation in graphic design and a passion for visual storytelling, I've developed a unique approach 
                that combines creative innovation with strategic thinking. Whether it's crafting a complete brand identity 
                or designing intuitive user interfaces, I focus on creating work that is both aesthetically compelling and 
                purposefully designed.
              </p>
              <p>
                My process is collaborative and iterative, working closely with clients to understand their vision and 
                translate it into visual solutions that exceed expectations. I believe great design is not just about 
                making things look good—it's about solving problems, communicating messages, and creating meaningful connections.
              </p>
              <p>
                When I'm not designing, you can find me exploring new creative techniques, staying current with design trends, 
                and continuously refining my craft to deliver the best possible results for every project.
              </p>
            </div>
            
            <div className="mt-12">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-xl rounded-none font-helvetica hover:bg-blue-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
