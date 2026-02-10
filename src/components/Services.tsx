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
    { 
      name: 'Visual Design', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
    },
    { 
      name: 'Brand Design', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
    },
    { 
      name: 'UI/UX Design', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
    },
    { 
      name: 'Figma & Adobe Suite', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" /></svg>
    },
    { 
      name: 'Web Design', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
    },
    { 
      name: 'Illustration', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
    },
    { 
      name: 'Brand Strategy', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
    },
    { 
      name: 'Design Systems', 
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
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
              className="bg-gray-50 dark:bg-gray-900/30 px-4 py-6 rounded-lg font-helvetica border border-gray-200 dark:border-gray-800/50 flex flex-col items-center gap-3"
            >
              <div className="text-blue-500 dark:text-blue-400">
                {skill.icon}
              </div>
              <span className="text-sm text-center text-blue-600 dark:text-blue-400 font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
