import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Navbar from '../components/Navbar'
import ScrollToTop from '../components/ScrollToTop'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    howHeard: '',
    message: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    } as any)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for reaching out! I will get back to you soon.')
    setFormData({ name: '', email: '', jobTitle: '', howHeard: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <ScrollToTop />
      <Navbar isDarkMode={false} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column - Copy */}
          <div className="space-y-8">
            <div>
              <h3 className="text-blue-600 dark:text-blue-400 font-helvetica text-sm uppercase tracking-wider mb-4">
                Let's Talk
              </h3>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-merriweather font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Got a project? Let's bring your vision to life through thoughtful design.
              </h1>
              <p className="text-xl text-gray-900 dark:text-white font-helvetica leading-relaxed">
                Based in Nigeria, collaborating worldwide.
              </p>
            </div>

            <div className="pt-8">
              <p className="text-gray-600 dark:text-gray-400 font-helvetica mb-2">
                Prefer email?
              </p>
              <a
                href="mailto:sapphirepictures1@gmail.com"
                className="text-gray-400 dark:text-gray-500 font-helvetica text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                sapphirepictures1@gmail.com
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-helvetica text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="your name"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-helvetica text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobTitle" className="block font-helvetica text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Job title <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="your role or title"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="howHeard" className="block font-helvetica text-sm text-gray-700 dark:text-gray-300 mb-2">
                  How did you hear about me? <span className="text-gray-400">(optional)</span>
                </label>
                <select
                  id="howHeard"
                  name="howHeard"
                  value={formData.howHeard}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white appearance-none cursor-pointer"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">select one...</option>
                  <option value="search">Search Engine</option>
                  <option value="social">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="portfolio">Portfolio Site</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-helvetica text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="tell me a bit about your project or idea..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-helvetica resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 font-helvetica">
                By submitting, you agree to be contacted for project-related inquiries.
              </p>

              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-helvetica font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-helvetica text-gray-400">
            © 2025 Wesley Sapphire Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
