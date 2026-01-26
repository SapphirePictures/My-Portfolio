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
          Services
        </h2>
        <p 
          ref={bodyTextRef}
          className="text-3xl md:text-5xl lg:text-6xl font-helvetica text-gray-400 dark:text-gray-500 mb-24 leading-tight font-light"
        >
          {[
            'I help brands connect strategy and design',
            'through a multidisciplinary approach. Each service is crafted',
            'to bring clarity, emotion, and cohesion to how brands express',
            'themselves.'
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="group bg-gray-100 dark:bg-gray-800 p-8 transition-colors duration-700 overflow-hidden"
            >
              <div
                style={{
                  animation: visibleServices[index] ? 'slideUp 0.8s ease-out forwards' : 'none',
                  transform: visibleServices[index] ? 'translateY(0)' : 'translateY(100%)'
                }}
              >
                <h3 className="text-2xl md:text-3xl font-helvetica font-normal text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p
                  className="font-helvetica text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed font-light"
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
