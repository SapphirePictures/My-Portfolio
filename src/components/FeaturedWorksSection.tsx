import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type CaseStudy = {
  id: string
  title: string
  slug: string
  summary: string | null
  featured_summary: string | null
  year: string | null
  role: string | null
  tags: string[] | null
  cover_url: string | null
  gallery_urls: string[] | null
  content: unknown | null
  is_featured: boolean
  created_at: string
}

const getCategoryFromTags = (tags: string[] | null): string => {
  if (!tags) return 'Featured'

  const tagsLower = tags.map((tag) => tag.toLowerCase())
  const categoryKeywords: Record<string, string[]> = {
    'Brand Identity': ['branding', 'brand', 'identity', 'logo', 'visual identity'],
    'UI/UX': ['ui', 'ux', 'interface', 'design', 'user experience', 'interaction'],
    'Web Design': ['web', 'website', 'web design', 'web development', 'digital'],
    'Illustration': ['illustration', 'art', 'drawing', 'artwork'],
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => tagsLower.some((tag) => tag.includes(keyword)))) {
      return category
    }
  }

  return 'Featured'
}

export default function FeaturedWorksSection() {
  const [featuredStudies, setFeaturedStudies] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedStudies = async () => {
      setIsLoading(true)

      const { data } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })

      setFeaturedStudies((data as CaseStudy[]) ?? [])
      setIsLoading(false)
    }

    void loadFeaturedStudies()
  }, [])

  if (isLoading || featuredStudies.length === 0) {
    return null
  }

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-20">
          {featuredStudies.map((study, idx) => {
            const category = getCategoryFromTags(study.tags)
            const isEven = idx % 2 === 0

            return (
              <Link
                key={study.id}
                to={`/case-studies/${study.slug}`}
                className="group block"
              >
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                    isEven ? 'md:grid-flow-col' : 'md:grid-flow-col-dense'
                  }`}
                >
                  {/* Content Side */}
                  <div className={`flex flex-col justify-center ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
                      {category}
                    </h2>
                    <div className="space-y-4">
                      <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                        {study.featured_summary || study.summary}
                      </p>
                      {study.year || study.role ? (
                        <div className="flex gap-4 text-sm text-gray-500 pt-4">
                          {study.year && <span>{study.year}</span>}
                          {study.role && <span>{study.role}</span>}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className={`overflow-hidden ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    {study.cover_url && (
                      <img
                        src={study.cover_url}
                        alt={study.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
