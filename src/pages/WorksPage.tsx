import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

type CategoryGroup = {
  name: string
  color: string
  studies: CaseStudy[]
}

const categories = {
  'Brand Identity': {
    name: 'Brand Identity',
    color: 'bg-blue-50',
    keywords: ['branding', 'brand', 'identity', 'logo', 'visual identity'],
  },
  'UI/UX': {
    name: 'UI/UX',
    color: 'bg-purple-50',
    keywords: ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
  },
  'Web Design': {
    name: 'Web Design',
    color: 'bg-green-50',
    keywords: ['web', 'website', 'web design', 'web development', 'digital'],
  },
  'Illustration': {
    name: 'Illustration',
    color: 'bg-pink-50',
    keywords: ['illustration', 'art', 'drawing', 'artwork'],
  },
}

const categorizeStudy = (study: CaseStudy): string[] => {
  if (!study.tags || study.tags.length === 0) return []

  const tagsLower = study.tags.map((tag) => tag.toLowerCase())
  const foundCategories: string[] = []

  for (const [categoryKey, categoryData] of Object.entries(categories)) {
    if (
      categoryData.keywords.some((keyword) =>
        tagsLower.some((tag) => tag.includes(keyword) || keyword.includes(tag))
      )
    ) {
      foundCategories.push(categoryKey)
    }
  }

  return foundCategories.length > 0 ? foundCategories : []
}

export default function WorksPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [groupedStudies, setGroupedStudies] = useState<Record<string, CaseStudy[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCaseStudies = async () => {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        const studies = (data as CaseStudy[]) ?? []
        setCaseStudies(studies)

        // Group studies by category
        const grouped: Record<string, CaseStudy[]> = {}
        Object.keys(categories).forEach((cat) => {
          grouped[cat] = []
        })

        studies.forEach((study) => {
          const assignedCategories = categorizeStudy(study)
          if (assignedCategories.length > 0) {
            assignedCategories.forEach((cat) => {
              grouped[cat].push(study)
            })
          }
        })

        setGroupedStudies(grouped)
      }

      setIsLoading(false)
    }

    void loadCaseStudies()
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Loading works...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Failed to load works: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A collection of projects across different disciplines.
          </p>
        </div>
      </header>

      {/* Categories */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {Object.entries(categories).map(([key, categoryInfo]) => {
          const studies = groupedStudies[key] ?? []

          if (studies.length === 0) return null

          return (
            <section key={key} className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">{categoryInfo.name}</h2>

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
            </section>
          )
        })}

        {Object.values(groupedStudies).every((studies) => studies.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-600">No works yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
