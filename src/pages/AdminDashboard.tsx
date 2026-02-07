import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type ContentBlock = {
  id: string
  type: 'text' | 'image'
  text?: string
  caption?: string
  file?: File | null
  url?: string
}

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
  content: ContentBlock[] | null
  is_featured: boolean
  created_at: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const bucketName = 'case-studies'

export default function AdminDashboard() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [featuredSummary, setFeaturedSummary] = useState('')
  const [year, setYear] = useState('')
  const [role, setRole] = useState('')
  const [tags, setTags] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const isSupabaseReady = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return Boolean(url && key)
  }, [])

  useEffect(() => {
    void loadCaseStudies()
  }, [])

  const loadCaseStudies = async () => {
    setIsLoading(true)
    setError(null)

    if (!isSupabaseReady) {
      setIsLoading(false)
      return
    }

    const { data, error: fetchError } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setCaseStudies((data as CaseStudy[]) ?? [])
    }

    setIsLoading(false)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(slugify(value))
    }
  }

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setCoverPreview(null)
    }
  }

  const handleGalleryChange = (files: File[]) => {
    setGalleryFiles(files)
    const previews: string[] = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result as string)
        if (previews.length === files.length) {
          setGalleryPreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMoveGalleryImage = (fromIndex: number, toIndex: number) => {
    setGalleryFiles((prev) => {
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, movedFile)
      return newFiles
    })
    setGalleryPreviews((prev) => {
      const newPreviews = [...prev]
      const [movedPreview] = newPreviews.splice(fromIndex, 1)
      newPreviews.splice(toIndex, 0, movedPreview)
      return newPreviews
    })
  }

  const handleAddBlock = (type: 'text' | 'image') => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        text: '',
        caption: '',
        file: null,
      },
    ])
  }

  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...updates } : block)))
    
    // If updating an image file, generate preview
    if (updates.file && updates.file instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBlocks((prev) =>
          prev.map((block) =>
            block.id === id ? { ...block, url: reader.result as string } : block
          )
        )
      }
      reader.readAsDataURL(updates.file)
    }
  }

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const uploadFile = async (file: File, path: string) => {
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, file, {
      upsert: true,
    })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path)

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file.')
    }

    return data.publicUrl
  }

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setSummary('')
    setFeaturedSummary('')
    setYear('')
    setRole('')
    setTags('')
    setCoverFile(null)
    setCoverPreview(null)
    setGalleryFiles([])
    setGalleryPreviews([])
    setBlocks([])
    setEditingId(null)
  }

  const handleEdit = (study: CaseStudy) => {
    setEditingId(study.id)
    setTitle(study.title)
    setSlug(study.slug)
    setSummary(study.summary || '')
    setFeaturedSummary(study.featured_summary || '')
    setYear(study.year || '')
    setRole(study.role || '')
    setTags(study.tags?.join(', ') || '')
    setCoverPreview(study.cover_url)
    setGalleryPreviews(study.gallery_urls || [])
    setBlocks((study.content as ContentBlock[]) || [])
    setError(null)
    setSuccess(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    resetForm()
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!isSupabaseReady) {
      setError('Supabase environment variables are missing.')
      return
    }

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingId) {
        // Update existing case study
        const updates: any = {
          title,
          slug: slug || slugify(title),
          summary: summary || null,
          featured_summary: featuredSummary || null,
          year: year || null,
          role: role || null,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }

        // Upload new cover if changed
        if (coverFile) {
          const coverUrl = await uploadFile(coverFile, `${editingId}/cover-${coverFile.name}`)
          updates.cover_url = coverUrl
        } else if (!coverPreview) {
          // Cover was removed
          updates.cover_url = null
        }

        // Always update gallery images (handles additions and deletions)
        const galleryUrls: string[] = []
        if (galleryFiles.length > 0) {
          for (const file of galleryFiles) {
            const url = await uploadFile(file, `${editingId}/gallery-${file.name}`)
            galleryUrls.push(url)
          }
        } else {
          // Use existing previews (URLs from database)
          galleryUrls.push(...galleryPreviews.filter(p => !p.startsWith('data:')))
        }
        updates.gallery_urls = galleryUrls

        // Process content blocks
        const content: ContentBlock[] = []
        for (const block of blocks) {
          if (block.type === 'image' && block.file) {
            const url = await uploadFile(block.file, `${editingId}/block-${block.file.name}`)
            content.push({ ...block, url, file: undefined })
          } else {
            content.push({ ...block, file: undefined })
          }
        }
        updates.content = content

        const { error: updateError } = await supabase
          .from('case_studies')
          .update(updates)
          .eq('id', editingId)

        if (updateError) {
          throw new Error(updateError.message)
        }

        setSuccess('Case study updated successfully.')
      } else {
        // Create new case study
        const id = crypto.randomUUID()
        const basePath = `${id}`

        let coverUrl: string | null = null
        if (coverFile) {
          coverUrl = await uploadFile(coverFile, `${basePath}/cover-${coverFile.name}`)
        }

        const galleryUrls: string[] = []
        for (const file of galleryFiles) {
          const url = await uploadFile(file, `${basePath}/gallery-${file.name}`)
          galleryUrls.push(url)
        }

        const content: ContentBlock[] = []
        for (const block of blocks) {
          if (block.type === 'image' && block.file) {
            const url = await uploadFile(block.file, `${basePath}/block-${block.file.name}`)
            content.push({ ...block, url, file: undefined })
          } else {
            content.push({ ...block, file: undefined })
          }
        }

        const { error: insertError } = await supabase.from('case_studies').insert({
          id,
          title,
          slug: slug || slugify(title),
          summary: summary || null,
          featured_summary: featuredSummary || null,
          year: year || null,
          role: role || null,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          cover_url: coverUrl,
          gallery_urls: galleryUrls,
          content,
          is_featured: false,
        })

        if (insertError) {
          // eslint-disable-next-line no-console
          console.error('Insert error:', insertError)
          throw new Error(insertError.message)
        }

        setSuccess('Case study uploaded successfully.')
      }

      resetForm()
      await loadCaseStudies()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    setSuccess(null)

    const { error: deleteError } = await supabase.from('case_studies').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setSuccess('Case study deleted.')
    await loadCaseStudies()
  }

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    setError(null)
    setSuccess(null)

    const { error: updateError } = await supabase
      .from('case_studies')
      .update({ is_featured: !currentValue })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(`Case study ${!currentValue ? 'added to' : 'removed from'} featured works.`)
    await loadCaseStudies()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-white/60">
            Upload Behance-style case studies with cover images, galleries, and content blocks.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Case Study' : 'New Case Study'}</h2>
              <p className="text-sm text-white/60">
                Make sure you have a public storage bucket named <span className="text-white">{bucketName}</span>.
              </p>
            </div>

            {!isSupabaseReady && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                Title
                <input
                  value={title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                  placeholder="Project title"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Slug
                <input
                  value={slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                  placeholder="project-title"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm">
              Summary
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                className="min-h-[120px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                placeholder="Short overview of the project"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              Featured Summary (Homepage)
              <textarea
                value={featuredSummary}
                onChange={(event) => setFeaturedSummary(event.target.value)}
                className="min-h-[120px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                placeholder="Short summary used on the homepage featured works"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm">
                Year
                <input
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                  placeholder="2025"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Role
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                  placeholder="Design, Art Direction"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Tags (comma separated)
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                  placeholder="Branding, Illustration"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleCoverChange(event.target.files?.[0] ?? null)}
                  className="text-sm text-white/70"
                />
                {coverPreview && (
                  <div className="relative mt-2">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleCoverChange(null)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Gallery Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleGalleryChange(Array.from(event.target.files ?? []))}
                  className="text-sm text-white/70"
                />
                {galleryPreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery ${index + 1}`}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <div className="absolute right-1 top-1 flex gap-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(index, index - 1)}
                              className="rounded bg-black/70 px-1.5 py-0.5 text-xs text-white hover:bg-black"
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          {index < galleryPreviews.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(index, index + 1)}
                              className="rounded bg-black/70 px-1.5 py-0.5 text-xs text-white hover:bg-black"
                              title="Move right"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="rounded bg-red-500/90 px-1.5 py-0.5 text-xs text-white hover:bg-red-600"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Content Blocks</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('text')}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs hover:border-white/40"
                  >
                    Add Text
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('image')}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs hover:border-white/40"
                  >
                    Add Image
                  </button>
                </div>
              </div>

              {blocks.length === 0 && (
                <p className="text-sm text-white/50">Add blocks to tell the project story.</p>
              )}

              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Block {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </div>

                    {block.type === 'text' ? (
                      <label className="mt-3 flex flex-col gap-2 text-sm">
                        Text
                        <textarea
                          value={block.text ?? ''}
                          onChange={(event) => handleUpdateBlock(block.id, { text: event.target.value })}
                          className="min-h-[100px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                          placeholder="Tell the story..."
                        />
                      </label>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="flex flex-col gap-2 text-sm">
                            Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                handleUpdateBlock(block.id, {
                                  file: event.target.files?.[0] ?? null,
                                })
                              }
                              className="text-sm text-white/70"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm">
                            Caption
                            <input
                              value={block.caption ?? ''}
                              onChange={(event) => handleUpdateBlock(block.id, { caption: event.target.value })}
                              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30"
                              placeholder="Optional caption"
                            />
                          </label>
                        </div>
                        {block.url && (
                          <div className="relative">
                            <img
                              src={block.url}
                              alt={block.caption || 'Block image'}
                              className="h-40 w-full rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateBlock(block.id, { file: null, url: undefined })}
                              className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                            >
                              Replace
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold tracking-wide hover:bg-white/90 disabled:opacity-60"
            >
              {isSubmitting ? 'Uploading...' : editingId ? 'Update Case Study' : 'Publish Case Study'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full rounded-xl bg-transparent border border-white/20 text-white py-3 text-sm font-semibold tracking-wide hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Existing Case Studies</h2>
            {isLoading && <p className="text-sm text-white/60">Loading...</p>}
            {!isLoading && caseStudies.length === 0 && (
              <p className="text-sm text-white/60">No case studies yet.</p>
            )}


            <div className="space-y-4">
              {caseStudies.map((study) => (
                <div key={study.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold">{study.title}</p>
                      <p className="text-xs text-white/50">/{study.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(study)}
                        className="text-xs text-blue-300 hover:text-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(study.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {study.cover_url && (
                    <img
                      src={study.cover_url}
                      alt={study.title}
                      className="mb-3 h-32 w-full rounded object-cover"
                    />
                  )}
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={study.is_featured}
                      onChange={() => handleToggleFeatured(study.id, study.is_featured)}
                      className="w-4 h-4"
                    />
                    <span className={study.is_featured ? 'text-green-400' : 'text-white/60'}>
                      {study.is_featured ? '✓ Featured' : 'Not featured'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Setup Checklist</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Create a Supabase project and add the URL/key to your .env file.</li>
              <li>Create a public storage bucket named <span className="text-white">{bucketName}</span>.</li>
              <li>Create a <span className="text-white">case_studies</span> table with fields for title, slug, summary, year, role, tags, cover_url, gallery_urls, content.</li>
              <li>Adjust Row Level Security policies once you add authentication.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
