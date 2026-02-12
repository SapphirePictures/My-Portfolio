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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form validation
  const validateForm = (data: typeof formData) => {
    const errors: Record<string, string> = {}

    if (!data.name.trim()) {
      errors.name = 'Name is required'
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters'
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (data.jobTitle.length > 100) {
      errors.jobTitle = 'Job title must be less than 100 characters'
    }

    if (!data.message.trim()) {
      errors.message = 'Message is required'
    } else if (data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters'
    } else if (data.message.length > 5000) {
      errors.message = 'Message must be less than 5000 characters'
    }

    return { isValid: Object.keys(errors).length === 0, errors }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    // Validate form
    const { isValid, errors } = validateForm(formData)
    if (!isValid) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://formspree.io/f/mvzbzpza', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          jobTitle: formData.jobTitle,
          howHeard: formData.howHeard,
          message: formData.message,
        })
      })

      if (response.ok) {
        alert('Thank you for reaching out! I will get back to you soon.')
        setFormData({ name: '', email: '', jobTitle: '', howHeard: '', message: '' })
        setFormErrors({})
      } else {
        setFormErrors({ submit: 'Something went wrong. Please try again or email me directly.' })
      }
    } catch (error) {
      setFormErrors({ submit: 'Something went wrong. Please try again or email me directly.' })
    } finally {
      setIsSubmitting(false)
    }
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
                Ready to collaborate?
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-helvetica leading-relaxed">
                Based in Nigeria, working globally. Available for brand design, UI/UX projects, and creative direction.
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
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                      formErrors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 font-helvetica">{formErrors.name}</p>
                  )}
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
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                      formErrors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1 font-helvetica">{formErrors.email}</p>
                  )}
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
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all font-helvetica text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                    formErrors.jobTitle
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                  }`}
                />
                {formErrors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1 font-helvetica">{formErrors.jobTitle}</p>
                )}
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
                  rows={6}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all font-helvetica resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                    formErrors.message
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                  }`}
                />
                {formErrors.message && (
                  <p className="text-red-500 text-sm mt-1 font-helvetica">{formErrors.message}</p>
                )}
                <p className="text-gray-400 text-xs mt-1 font-helvetica">
                  {formData.message.length}/5000 characters
                </p>
              </div>

              {formErrors.submit && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-400 font-helvetica text-sm">{formErrors.submit}</p>
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 font-helvetica">
                By submitting, you agree to be contacted for project-related inquiries.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-helvetica font-medium text-lg transition-colors duration-200"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
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
