import { Link } from 'react-router-dom'

const ContactCTA = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-merriweather font-bold text-gray-900 dark:text-white mb-6">
          Let's create something remarkable together
        </h2>
        <p className="text-xl font-helvetica text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Have a project in mind? I'd love to hear about it and explore how we can bring your vision to life.
        </p>
        <Link
          to="/contact"
          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-helvetica font-medium text-lg hover:bg-blue-700 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  )
}

export default ContactCTA
