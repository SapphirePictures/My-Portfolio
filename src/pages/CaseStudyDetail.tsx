import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Lenis from 'lenis'
import { supabase } from '../lib/supabaseClient'

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

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setCaseStudy(data as CaseStudy)
      }

      setIsLoading(false)
    }

    void loadCaseStudy()
  }, [slug])

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
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-5xl font-bold mb-4">{caseStudy.title}</h1>
          {caseStudy.summary && <p className="text-xl text-gray-600">{caseStudy.summary}</p>}

          {/* Meta */}
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-600">
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
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{block.text}</p>
                  </div>
                ) : (
                  <div>
                    <div className="rounded overflow-hidden bg-gray-200 mb-4">
                      {block.url && (
                        <img src={block.url} alt={block.caption || `Block ${index}`} className="w-full h-auto" />
                      )}
                    </div>
                    {block.caption && <p className="text-center text-gray-600 text-sm">{block.caption}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to portfolio
          </Link>
        </div>
      </footer>
    </article>
  )
}
