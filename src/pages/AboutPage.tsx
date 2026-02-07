import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from '../components/Navbar'
import ScrollToTop from '../components/ScrollToTop'

const AboutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease-out
    } as any)

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar isDarkMode={false} />
      
      {/* Hero Banner */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-900 dark:to-black flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,_68,_68,_.2)_25%,rgba(68,_68,_68,_.2)_50%,transparent_50%,transparent_75%,rgba(68,_68,_68,_.2)_75%,rgba(68,_68,_68,_.2))] bg-[length:60px_60px]"></div>
        </div>

        <div className="relative z-10 text-center px-6 md:px-12">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-helvetica font-bold text-white mb-6 uppercase tracking-tight">
            Wesley Ojedapo
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-helvetica max-w-3xl mx-auto">
            Visual Designer. Brand Strategist. Creative Problem Solver.
          </p>
        </div>
      </section>
      {/* About Details Section */}
      <section className="bg-white dark:bg-black py-20 px-6 md:px-12">
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
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-xl rounded-none font-helvetica hover:bg-blue-700 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
        </div>
      </section>
      <ScrollToTop />
    </div>
  )
}

export default AboutPage
