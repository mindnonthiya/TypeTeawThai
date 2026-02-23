import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'

type QuizResultRow = {
  id: string
  created_at: string
  recommended_provinces: any
}

export default function HistoryListPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { t, lang } = useLang()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<QuizResultRow[]>([])

  // 🔥 redirect logic อยู่ใน effect เสมอ
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  // 🔥 load data
  useEffect(() => {
    if (authLoading) return
    if (!user) return

    async function load() {
      if (!supabase) {
        setError('Supabase is not configured')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('id, created_at, recommended_provinces')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setRows((data || []) as QuizResultRow[])
      } catch (e: any) {
        setError(e?.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, authLoading])

  // 🔥 return อยู่ล่างสุดเสมอ
  if (authLoading || loading) {
    return <p className="muted">{t('loading')}</p>
  }

  if (!user) {
    return null
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      
      <h1 className="h1">{t('historyTitle')}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {rows.length === 0 && (
        <p className="muted">
          {lang === 'th' ? 'ยังไม่มีประวัติ' : 'No history yet.'}
        </p>
      )}

      {rows.map((r) => {
        const created = new Date(r.created_at)

        const topProvince =
          Array.isArray(r.recommended_provinces) &&
            r.recommended_provinces.length
            ? lang === 'th'
              ? r.recommended_provinces[0]?.name_th
              : r.recommended_provinces[0]?.name_en
            : '—'

        return (
          <Link key={r.id} href={`/history/${r.id}`} className="card">
            <div style={{ fontWeight: 900 }}>{topProvince}</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {created.toLocaleString()}
            </div>
          </Link>
        )
      })}
    </div>
  )
}