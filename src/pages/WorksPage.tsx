import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import ScrollToTop from '../components/ScrollToTop'

type CaseStudy = {
  id: string
  title: string
  slug: string
  summary: string | null
  year: string | null
  role: string | null
  tags: string[] | null
  cover_url: string | null
  gallery_urls: string[] | null
  content: unknown | null
  created_at: string
}

// type CategoryGroup = {
//   name: string
//   color: string
//   studies: CaseStudy[]
// }

const categories = [
  {
    slug: 'brand-identity',
    name: 'Brand Identity',
    description: 'Visual identities, logos, and branding projects',
    color: 'bg-blue-500',
  },
  {
    slug: 'ui-ux',
    name: 'UI/UX',
    description: 'User interface and experience design',
    color: 'bg-purple-500',
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    description: 'Website and digital design projects',
    color: 'bg-green-500',
  },
  {
    slug: 'illustration',
    name: 'Illustration',
    description: 'Artwork, drawings, and illustrations',
    color: 'bg-pink-500',
  },
]

export default function WorksPage() {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadCategoryImages = async () => {
      const { data } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        const images: Record<string, string> = {}
        const categoryKeywords: Record<string, string[]> = {
          'brand-identity': ['branding', 'brand', 'identity', 'logo', 'visual identity'],
          'ui-ux': ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
          'web-design': ['web', 'website', 'web design', 'web development', 'digital'],
          'illustration': ['illustration', 'art', 'drawing', 'artwork'],
        }

        Object.entries(categoryKeywords).forEach(([catSlug, keywords]) => {
          if (!images[catSlug]) {
            const study = (data as CaseStudy[]).find((s) => {
              if (!s.tags) return false
              const tagsLower = s.tags.map((tag) => tag.toLowerCase())
              return keywords.some((keyword) =>
                tagsLower.some((tag) => tag.includes(keyword) || keyword.includes(tag))
              )
            })
            if (study?.cover_url) {
              images[catSlug] = study.cover_url
            }
          }
        })

        setCategoryImages(images)
      }
    }

    void loadCategoryImages()
  }, [])

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic ease-out
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
    <div className="min-h-screen bg-white">
      <Navbar isDarkMode={false} />
      {/* Header */}
      <header className="border-b border-gray-200 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A collection of projects across different disciplines.
          </p>
        </div>
      </header>

      {/* Categories */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/works/${category.slug}`}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-12 hover:shadow-2xl transition-all duration-300 min-h-96 flex flex-col justify-end"
            >
              {/* Background Image */}
              {categoryImages[category.slug] && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={categoryImages[category.slug]}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                </div>
              )}
              <div className={`absolute inset-0 ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-3">
                  {category.name}
                </h2>
                <p className="text-gray-300 text-lg">
                  {category.description}
                </p>
                
                <div className="mt-8 flex items-center text-white">
                  <span className="text-sm font-medium">View Projects</span>
                  <svg 
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <ScrollToTop />
    </div>
  )
}
