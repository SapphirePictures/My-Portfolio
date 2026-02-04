import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  is_featured: boolean
  created_at: string
}

export default function CaseStudiesGallery() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCaseStudies = async () => {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCaseStudies((data as CaseStudy[]) ?? [])
      }

      setIsLoading(false)
    }

    void loadCaseStudies()
  }, [])

  if (isLoading) {
    return (
      <section id="case-studies" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading case studies...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="case-studies" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">Failed to load case studies: {error}</div>
        </div>
      </section>
    )
  }

  if (caseStudies.length === 0) {
    return null
  }

  return (
    <section id="case-studies" className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h2>
        <p className="text-gray-600 mb-16 max-w-2xl">
          Detailed looks at projects I've worked on, from concept to execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
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
                <h3 className="text-xl font-semibold mb-2 group-hover:underline">{study.title}</h3>
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
                    {study.tags.slice(0, 3).map((tag, index) => (
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
      </div>
    </section>
  )
}
