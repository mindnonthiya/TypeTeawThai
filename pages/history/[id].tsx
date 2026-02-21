import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'

type QuizResultRow = {
  id: string
  created_at: string
  recommended_provinces: any
  recommended_locations: any
}

export default function HistoryDetailPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { t, lang } = useLang()
  const { id } = router.query

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [row, setRow] = useState<QuizResultRow | null>(null)

  useEffect(() => {
    if (!router.isReady) return
    if (authLoading) return

    if (!user) {
      router.replace('/')
      return
    }

    if (!id || Array.isArray(id)) {
      setLoading(false)
      return
    }

    async function load() {
      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('id, created_at, recommended_provinces, recommended_locations')
          .eq('id', id)
          .eq('user_id', user!.id)
          .single()

        if (error) throw error

        setRow(data as QuizResultRow)
      } catch (e: any) {
        setError(e?.message || 'Failed to load detail')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router.isReady, id, user, authLoading, router])

  if (authLoading || loading)
    return <p className="muted">{t('loading')}</p>

  if (!row && !error)
    return <p className="muted">No data found.</p>

  return (
    <div className="grid" style={{ gap: 14 }}>
      <button onClick={() => router.back()}>{t('back')}</button>

      {error && (
        <div className="toast danger">
          <div style={{ color: 'var(--danger)' }}>{error}</div>
        </div>
      )}

      {row && (
        <>
          <div className="muted">
            {new Date(row.created_at).toLocaleString()}
          </div>

          <div className="card">
            <div className="h2">{t('recommendedProvinces')}</div>
            <ol>
              {(Array.isArray(row.recommended_provinces)
                ? row.recommended_provinces
                : []
              ).map((p: any, idx: number) => (
                <li key={idx}>
                  <strong>
                    {lang === 'th' ? p?.name_th : p?.name_en}
                  </strong>
                </li>
              ))}
            </ol>
          </div>

          <div className="card">
            <div className="h2">{t('recommendedLocations')}</div>
            <ul>
              {(Array.isArray(row.recommended_locations)
                ? row.recommended_locations
                : []
              ).map((loc: any, idx: number) => (
                <li key={idx}>
                  <strong>
                    {lang === 'th' ? loc?.name_th : loc?.name_en}
                  </strong>
                  {loc?.description && (
                    <div className="muted">{loc.description}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}