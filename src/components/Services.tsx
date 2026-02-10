import { useEffect, useRef, useState } from 'react'

const Services = () => {
  const bodyTextRef = useRef<HTMLParagraphElement>(null)
  const [bodyTextVisible, setBodyTextVisible] = useState(false)
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleServices, setVisibleServices] = useState<boolean[]>([])

  const services = [
    {
      title: 'Creative Consultancy',
      description: 'Guiding brand vision and creative direction to ensure clarity before execution.',
    },
    {
      title: 'Art Direction',
      description: 'Defining the look, mood, and emotional coherence across campaigns and branded content.',
    },
    {
      title: 'Brand Guidelines',
      description: 'Defining the rules that keep a brand consistent from typography and color systems to motion, tone, and digital behavior.',
    },
    {
      title: 'Web Development',
      description: 'Building robust, scalable applications with modern technologies and best practices.',
    },
  ]

  const skills = [
    'Visual Design',
    'Brand Design',
    'UI/UX Design',
    'Figma & Adobe Suite',
    'Web Design',
    'Illustration',
    'Brand Strategy',
    'Design Systems',
  ]

  useEffect(() => {
    setVisibleServices(new Array(services.length).fill(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (bodyTextRef.current && !bodyTextVisible) {
        const rect = bodyTextRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        if (rect.top < windowHeight * 0.8) {
          setBodyTextVisible(true)
        }
      }

      serviceRefs.current.forEach((ref, index) => {
        if (ref && !visibleServices[index]) {
          const rect = ref.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          if (rect.top < windowHeight * 0.8) {
            setVisibleServices(prev => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [bodyTextVisible, visibleServices])

  return (
    <section id="services" className="py-32 px-6 bg-transparent transition-colors duration-700">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm md:text-base font-helvetica font-normal text-gray-900 dark:text-gray-100 mb-12 tracking-wide uppercase">
          Skills
        </h2>
        <p 
          ref={bodyTextRef}
          className="text-3xl md:text-5xl lg:text-6xl font-helvetica text-gray-400 dark:text-gray-500 mb-24 leading-tight font-light"
        >
          {[
            'Expertise across a range of disciplines',
            'combined with strategic thinking to deliver',
            'cohesive creative solutions that elevate',
            'your brand.'
          ].map((line, index) => (
            <span
              key={index}
              className="block overflow-hidden"
            >
              <span
                className="block"
                style={{
                  animation: bodyTextVisible ? `slideUp 0.8s ease-out ${index * 0.15}s forwards` : 'none',
                  transform: bodyTextVisible ? 'translateY(0)' : 'translateY(100%)'
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg font-helvetica text-gray-700 dark:text-gray-300 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-700"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
