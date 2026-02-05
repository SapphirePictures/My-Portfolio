import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lenis from 'lenis'
import { supabase } from '../lib/supabaseClient'

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

const categories: Record<string, { name: string; keywords: string[] }> = {
  'brand-identity': {
    name: 'Brand Identity',
    keywords: ['branding', 'brand', 'identity', 'logo', 'visual identity'],
  },
  'ui-ux': {
    name: 'UI/UX',
    keywords: ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
  },
  'web-design': {
    name: 'Web Design',
    keywords: ['web', 'website', 'web design', 'web development', 'digital'],
  },
  'illustration': {
    name: 'Illustration',
    keywords: ['illustration', 'art', 'drawing', 'artwork'],
  },
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryInfo = category ? categories[category] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category])

  useEffect(() => {
    const loadCategoryStudies = async () => {
      if (!categoryInfo) return

      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        const allStudies = (data as CaseStudy[]) ?? []
        
        // Filter studies by category keywords
        const filtered = allStudies.filter((study) => {
          if (!study.tags || study.tags.length === 0) return false
          const tagsLower = study.tags.map((tag) => tag.toLowerCase())
          return categoryInfo.keywords.some((keyword) =>
            tagsLower.some((tag) => tag.includes(keyword) || keyword.includes(tag))
          )
        })

        setStudies(filtered)
      }

      setIsLoading(false)
    }

    void loadCategoryStudies()
  }, [category])

  useEffect(() => {
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

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <Link to="/works" className="text-blue-600 hover:underline">
          ← Back to works
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Loading {categoryInfo.name}...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Failed to load projects: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/works" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block">
            ← Back to Works
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{categoryInfo.name}</h1>
          <p className="text-xl text-gray-600">
            {studies.length} {studies.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {studies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No projects in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studies.map((study) => (
              <Link
                key={study.id}
                to={`/case-studies/${study.slug}`}
                className="group cursor-pointer"
              >
                <div className="mb-4 overflow-hidden rounded bg-gray-200">
                  {study.cover_url ? (
                    <img
                      src={study.cover_url}
                      alt={study.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-64 w-full bg-gray-300 flex items-center justify-center text-gray-500">
                      No cover image
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:underline">
                    {study.title}
                  </h3>
                  {study.summary && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{study.summary}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      {study.year && <span>{study.year}</span>}
                      {study.year && study.role && <span className="mx-2">•</span>}
                      {study.role && <span>{study.role}</span>}
                    </div>
                  </div>

                  {study.tags && study.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {study.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
