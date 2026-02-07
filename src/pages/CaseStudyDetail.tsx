import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Lenis from 'lenis'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import ScrollToTop from '../components/ScrollToTop'

type ContentBlock = {
  id: string
  type: 'text' | 'image'
  text?: string
  caption?: string
  url?: string
}

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
  content: ContentBlock[] | null
  created_at: string
}

const getCategoryFromTags = (tags: string[] | null): string | null => {
  if (!tags) return null

  const tagsLower = tags.map((tag) => tag.toLowerCase())
  const categoryKeywords: Record<string, string[]> = {
    'brand-identity': ['branding', 'brand', 'identity', 'logo', 'visual identity'],
    'ui-ux': ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
    'web-design': ['web', 'website', 'web design', 'web development', 'digital'],
    'illustration': ['illustration', 'art', 'drawing', 'artwork'],
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => tagsLower.some((tag) => tag.includes(keyword) || keyword.includes(tag)))) {
      return category
    }
  }

  return null
}

export default function CaseStudyDetail() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [categoryStudies, setCategoryStudies] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const loadCaseStudy = async () => {
      if (!slug) return

      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        const study = data as CaseStudy
        setCaseStudy(study)

        // Load all studies in the same category
        const category = getCategoryFromTags(study.tags)
        if (category) {
          const { data: allStudies } = await supabase
            .from('case_studies')
            .select('*')
            .order('created_at', { ascending: false })

          if (allStudies) {
            const filtered = (allStudies as CaseStudy[]).filter((s) => {
              const studyCategory = getCategoryFromTags(s.tags)
              return studyCategory === category
            })
            setCategoryStudies(filtered)
          }
        }
      }

      setIsLoading(false)
    }

    void loadCaseStudy()
  }, [slug])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Case Study Not Found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      <Navbar isDarkMode={false} />
      {/* Header */}
      <header className="border-b border-gray-200 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => {
              // Determine the category from tags and navigate to it
              const category = getCategoryFromTags(caseStudy.tags)
              if (category) {
                navigate(`/works/${category}`)
              } else {
                navigate('/works')
              }
            }}
            className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block"
          >
            ← Back to Category
          </button>
          <h1 className="text-6xl font-bold mb-6">{caseStudy.title}</h1>
          {caseStudy.summary && <p className="text-2xl text-gray-600 leading-relaxed">{caseStudy.summary}</p>}

          {/* Meta */}
          <div className="mt-8 flex flex-wrap gap-8 text-base text-gray-600">
            {caseStudy.year && (
              <div>
                <span className="font-semibold text-gray-900">Year</span>
                <p>{caseStudy.year}</p>
              </div>
            )}
            {caseStudy.role && (
              <div>
                <span className="font-semibold text-gray-900">Role</span>
                <p>{caseStudy.role}</p>
              </div>
            )}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Tags</span>
                <p>{caseStudy.tags.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {caseStudy.cover_url && (
        <div className="w-full overflow-hidden">
          <img
            src={caseStudy.cover_url}
            alt={caseStudy.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Gallery */}
      {caseStudy.gallery_urls && caseStudy.gallery_urls.length > 0 && (
        <section className="max-w-[90rem] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {caseStudy.gallery_urls.map((url, index) => (
              <div key={index} className="rounded-lg overflow-hidden bg-gray-200">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Blocks */}
      {caseStudy.content && caseStudy.content.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="space-y-16">
            {(caseStudy.content as ContentBlock[]).map((block, index) => (
              <div key={block.id}>
                {block.type === 'text' ? (
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">{block.text}</p>
                  </div>
                ) : (
                  <div>
                    <div className="rounded overflow-hidden bg-gray-200 mb-4">
                      {block.url && (
                        <img src={block.url} alt={block.caption || `Block ${index}`} className="w-full h-auto" />
                      )}
                    </div>
                    {block.caption && <p className="text-center text-gray-600 text-lg">{block.caption}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Navigation to prev/next projects */}
          {categoryStudies.length > 1 && (
            <div className="mb-12">
              <div className="flex items-center justify-between gap-4">
                {(() => {
                  const currentIndex = categoryStudies.findIndex((s) => s.slug === slug)
                  const prevStudy = currentIndex > 0 ? categoryStudies[currentIndex - 1] : null
                  const nextStudy = currentIndex < categoryStudies.length - 1 ? categoryStudies[currentIndex + 1] : null

                  return (
                    <>
                      {prevStudy ? (
                        <Link
                          to={`/case-studies/${prevStudy.slug}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Previous Project</span>
                        </Link>
                      ) : (
                        <div />
                      )}
                      <span className="text-gray-500 text-sm">
                        {currentIndex + 1} of {categoryStudies.length}
                      </span>
                      {nextStudy ? (
                        <Link
                          to={`/case-studies/${nextStudy.slug}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <span>Next Project</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <div />
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          )}


        </div>
      </footer>
      <ScrollToTop />
    </article>
  )
}
