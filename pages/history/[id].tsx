import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'
import * as htmlToImage from 'html-to-image'

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
  const [shareOpen, setShareOpen] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  async function downloadImage() {
    if (!shareRef.current) return

    const dataUrl = await htmlToImage.toPng(shareRef.current, {
      pixelRatio: 1.5,
    })

    const link = document.createElement('a')
    link.download = 'travel-result.png'
    link.href = dataUrl
    link.click()
  }

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
      if (!supabase) {
        setError('Supabase is not configured')
        setLoading(false)
        return
      }

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

          <div style={{ position: 'relative', maxWidth: 260 }}>
            <button
              onClick={() => setShareOpen(!shareOpen)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 999,
                border: 'none',
                background: '#8C6A4A',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {lang === 'th' ? 'แชร์ผลลัพธ์' : 'Share Result'}
            </button>

            {shareOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  borderRadius: 14,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  zIndex: 20,
                }}
              >
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href)
                    setShareOpen(false)
                    alert(lang === 'th' ? 'คัดลอกลิงก์แล้ว' : 'Link copied')
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 10,
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'th' ? 'คัดลอกลิงก์' : 'Copy link'}
                </button>

                <button
                  onClick={async () => {
                    await downloadImage()
                    setShareOpen(false)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 10,
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'th' ? 'บันทึกเป็นรูป' : 'Download image'}
                </button>

                <div
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    top: -9999,
                    left: -9999,
                  }}
                >
                  <div
                    ref={shareRef}
                    style={{
                      width: 800,
                      height: 1400,
                      padding: 140,
                      background:
                        'linear-gradient(160deg, #f5efe6 0%, #e8dfd3 40%, #f9f6f2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'serif',
                      color: '#2d2a26',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 60,
                        textAlign: 'center',
                        maxWidth: 760,
                      }}
                    >
                      <div
                        style={{
                          marginTop: 20,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 22,
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            opacity: 0.6,
                            letterSpacing: 1,
                          }}
                        >
                          {lang === 'th'
                            ? 'จังหวัดที่เหมาะกับคุณที่สุดคือ'
                            : 'The province that fits you best is'}
                        </div>

                        <div
                          style={{
                            fontSize: 64,
                            fontWeight: 500,
                            lineHeight: 1.2,
                          }}
                        >
                          {lang === 'th'
                            ? row.recommended_provinces?.[0]?.name_th
                            : row.recommended_provinces?.[0]?.name_en}
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                            letterSpacing: 4,
                            opacity: 0.45,
                            marginTop: 6,
                          }}
                        >
                          BEST MATCH
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 22,
                          letterSpacing: 6,
                          opacity: 0.7,
                          marginTop: 220,
                        }}
                      >
                        TYPETEAWTHAI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
