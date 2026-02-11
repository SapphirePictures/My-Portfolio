import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Work = {
  id: string
  title: string
  description: string
  image: string
  slug: string
  tags: string[] | null
  category: string
  projectType?: string
}

const getCategoryFromTags = (tags: string[] | null, projectType?: string): string => {
  // Prioritize project_type if it's web_dev
  if (projectType === 'web_dev') {
    return 'Web Design'
  }

  if (!tags) return 'Featured'

  const tagsLower = tags.map((tag) => tag.toLowerCase())
  const categoryKeywords: Record<string, string[]> = {
    'Brand Identity': ['branding', 'brand', 'identity', 'logo', 'visual identity'],
    'UI/UX': ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
    'Web Design': ['web', 'website', 'web design', 'web development', 'digital'],
    'Illustration': ['illustration', 'art', 'drawing', 'artwork'],
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => tagsLower.some((tag) => tag.includes(keyword)))) {
      return category
    }
  }

  return 'Featured'
}

const getCategorySlug = (category: string): string => {
  const slugMap: Record<string, string> = {
    'Brand Identity': 'brand-identity',
    'UI/UX': 'ui-ux',
    'Web Design': 'web-design',
    'Illustration': 'illustration',
  }
  return slugMap[category] || 'brand-identity'
}

const FeaturedWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const manualOffsetRef = useRef(0)
  const lastAutoTargetRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)
  const [works, setWorks] = useState<Work[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  useEffect(() => {
    const loadFeaturedWorks = async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load featured works:', error.message)
      }

      if (data) {
        const mappedWorks: Work[] = data.map((study: any) => ({
          id: study.id,
          title: study.title,
          description: study.featured_summary || study.summary || '',
          image: study.cover_url || '',
          slug: study.slug,
          tags: study.tags || null,
          projectType: study.project_type,
          category: getCategoryFromTags(study.tags, study.project_type),
        }))
        setWorks(mappedWorks)
      }
    }

    void loadFeaturedWorks()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handleChange = () => setIsMobile(mq.matches)
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const container = containerRef.current
    const scrollContainer = scrollContainerRef.current
    if (!container || !scrollContainer || works.length === 0) return

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      let ticking = false

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = container.getBoundingClientRect()
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
              const progress = Math.abs(rect.top) / (rect.height - window.innerHeight)
              const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
              const scrollWidth = scrollContainer.scrollWidth
              const containerWidth = scrollContainer.parentElement?.clientWidth || window.innerWidth
              const maxScroll = scrollWidth - containerWidth
              const target = eased * maxScroll
              lastAutoTargetRef.current = target
              const combined = Math.min(Math.max(target + manualOffsetRef.current, 0), maxScroll)
              scrollContainer.style.transform = `translateX(-${combined}px)`
              if (titleContainerRef.current) {
                titleContainerRef.current.style.transform = `translateX(-${combined * 0.95}px) translateY(120px)`
              }
            }
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // Trigger once on mount to set initial position
      handleScroll()

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isMobile, works])

  const handleMobileScroll = () => {
    if (!isMobile) return
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    const containerWidth = scrollContainer.clientWidth
    const cardWidth = containerWidth * 0.85
    const gap = 24
    const cardPlusGap = cardWidth + gap
    const nearestIndex = Math.round(scrollContainer.scrollLeft / cardPlusGap)
    setCurrentCardIndex(Math.min(nearestIndex, works.length - 1))
  }

  if (works.length === 0) {
    return null
  }

  if (isMobile) {
    return (
      <section id="works" ref={containerRef} className="relative transition-colors duration-700 bg-white text-black dark:bg-black dark:text-white py-16">
        <div className="h-auto flex items-center overflow-hidden bg-transparent">
          <div className="px-5 sm:px-8 w-full h-full flex flex-col justify-center">
            <div className="mb-8 sm:mb-10">
              <h2 className="text-sm md:text-base font-helvetica font-normal text-gray-900 dark:text-gray-100 tracking-wide uppercase">Selected Works</h2>
            </div>

            <div
              ref={scrollContainerRef}
              onScroll={handleMobileScroll}
              className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
              style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory', scrollSnapStop: 'always' }}
            >
              {works.map((work) => (
                <Link
                  key={work.id}
                  to={`/case-studies/${work.slug}`}
                  className="snap-center snap-always flex-shrink-0 w-[85vw] sm:w-[70vw] max-w-sm px-6 py-10 sm:px-8 sm:py-12 flex flex-col gap-4 sm:gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl sm:text-3xl font-helvetica font-bold uppercase leading-snug">{work.title}</h3>
                  </div>

                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{work.description}</p>

                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {work.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/works/${getCategorySlug(getCategoryFromTags([tag]))}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 text-xs font-medium border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto overflow-hidden">
                    <img src={work.image} alt={work.title} className="w-full h-52 sm:h-64 object-cover" loading="lazy" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {works.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentCardIndex
                      ? 'w-8 h-2 bg-gray-900 dark:bg-white'
                      : 'w-2 h-2 bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="works" ref={containerRef} className="relative transition-colors duration-700 bg-white text-black dark:bg-black dark:text-white" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden bg-transparent">
        <div className="hidden lg:flex items-center px-6 py-6 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm md:text-base font-helvetica font-normal uppercase tracking-widest text-gray-900 dark:text-gray-100">
            Selected Works
          </h2>
        </div>
        <div className="relative w-full flex-1 flex items-center">
          <div
            ref={titleContainerRef}
            className="pointer-events-none absolute left-0 top-0 h-full w-full flex gap-8 px-6 z-30"
            style={{ willChange: 'transform' }}
          >
            {works.map((work) => (
              <div key={work.id} className="flex-shrink-0 w-[90vw] md:w-[70vw] h-[70vh] flex items-center" style={{ scrollSnapAlign: 'center' }}>
                <div className="w-1/3 md:w-1/3 flex items-start justify-start relative z-30 overflow-visible h-full">
                  <h3
                    className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-merriweather font-normal leading-tight uppercase transition-colors duration-700 drop-shadow-lg"
                    style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto', willChange: 'transform' }}
                  >
                    {work.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div ref={scrollContainerRef} className="flex gap-8 px-6 transition-transform duration-100 ease-out will-change-transform">
            {works.map((work) => (
              <Link key={work.id} to={`/case-studies/${work.slug}`} className="flex-shrink-0 w-[80vw] md:w-[70vw] h-[70vh] group cursor-pointer" style={{ scrollSnapAlign: 'center' }}>
                <div className="w-full h-full flex flex-col overflow-hidden p-3 sm:p-4 md:p-8 gap-3 sm:gap-4 md:gap-8 transition-colors duration-700">
                  <div className="flex-1 flex overflow-hidden gap-3 sm:gap-4 md:gap-8">
                    <div className="w-1/4 md:w-1/3 flex flex-col justify-center h-full">
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pr-4 hidden md:block">{work.description}</p>
                      
                      {work.tags && work.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pr-4 hidden md:flex">
                          {work.tags.map((tag, index) => (
                            <Link
                              key={index}
                              to={`/works/${getCategorySlug(getCategoryFromTags([tag]))}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 text-xs font-medium border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-3/4 md:w-2/3 flex items-center justify-center relative z-10">
                      <div className="w-full h-full relative overflow-hidden">
                        <img src={work.image} alt={work.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedWorks
