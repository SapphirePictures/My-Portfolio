import { useEffect, useRef, useState } from 'react'

interface Work {
  id: number
  type: 'image' | 'video'
  src: string
  title: string
  category: string
}

const FeaturedWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const works: Work[] = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      title: 'Brand Identity Design',
      category: 'Branding',
    },
    {
      id: 2,
      type: 'video',
      src: 'https://videos.pexels.com/video-files/3130284/3130284-sd_640_360_30fps.mp4',
      title: 'Motion Graphics',
      category: 'Animation',
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      title: 'Web Development',
      category: 'Development',
    },
    // Removed 'Product Showcase' work item
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      title: 'UI/UX Design',
      category: 'Design',
    },
  ]

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const titleContainer = titleContainerRef.current;
    if (!container || !scrollContainer || !titleContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const containerRect = container.getBoundingClientRect();
          if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
            const progress = Math.abs(containerRect.top) / (containerRect.height - window.innerHeight);
            const easedProgress = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            const scrollWidth = scrollContainer.scrollWidth;
            const containerWidth = scrollContainer.parentElement?.clientWidth || window.innerWidth;
            const maxScroll = scrollWidth - containerWidth;
            const targetScroll = easedProgress * maxScroll;
            // Images scroll at normal speed
            scrollContainer.style.transform = `translateX(-${targetScroll}px)`;
            // Titles scroll at 0.95x speed and are shifted further down
            titleContainer.style.transform = `translateX(-${targetScroll * 0.95}px) translateY(120px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Add useEffect for parallax effect
  useEffect(() => {
    // Parallax for titles
    const handleParallax = () => {
      document.querySelectorAll('[data-title-id]')?.forEach((el, idx) => {
        const card = el.closest('.group');
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Only animate if in viewport
        if (cardRect.top < windowHeight && cardRect.bottom > 0) {
          // Parallax: move slower than scroll (0.7x)
          const offset = cardRect.top * 0.3;
          (el as HTMLElement).style.transform = `translateY(${offset}px)`;
        }
      });
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative transition-colors duration-700"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-transparent">
        <div className="relative w-full h-full flex items-center">
          {/* Title Parallax Row */}
          <div
            ref={titleContainerRef}
            className="pointer-events-none absolute left-0 top-0 h-full w-full flex gap-8 px-6 z-30"
            style={{ willChange: 'transform' }}
          >
            {works.map((work) => (
              <div
                key={work.id}
                className="flex-shrink-0 w-[80vw] md:w-[70vw] h-[70vh] flex items-center"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="w-1/3 flex items-start justify-start relative z-30 overflow-visible h-full">
                  <h3
                    className="text-3xl md:text-5xl lg:text-6xl font-merriweather font-normal text-black dark:text-white leading-tight uppercase transition-colors duration-700 drop-shadow-lg"
                    style={{
                      position: 'relative',
                      zIndex: 30,
                      pointerEvents: 'auto',
                      willChange: 'transform',
                    }}
                  >
                    {work.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          {/* Image/Video Cards Row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 px-6 transition-transform duration-100 ease-out will-change-transform"
          >
            {works.map((work) => (
              <div
                key={work.id}
                className="flex-shrink-0 w-[80vw] md:w-[70vw] h-[70vh] group cursor-pointer"
                style={{ scrollSnapAlign: 'center' }}
                onMouseEnter={() => setHoveredId(work.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="w-full h-full bg-gray-100 dark:bg-black flex overflow-hidden p-6 md:p-8 gap-6 md:gap-8 transition-colors duration-700">
                  {/* Left side - Title (hidden, now in overlay above) */}
                  <div className="w-1/3 flex items-start justify-start relative z-10 overflow-visible h-full">
                    {/* Empty for spacing */}
                  </div>
                  {/* Right side - Image/Video */}
                  <div className="w-2/3 flex items-center justify-center relative z-10">
                    <div className="w-full h-full relative overflow-hidden bg-white">
                      {work.type === 'image' ? (
                        <img
                          src={work.src}
                          alt={work.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <video
                          src={work.src}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          autoPlay={hoveredId === work.id}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedWorks
