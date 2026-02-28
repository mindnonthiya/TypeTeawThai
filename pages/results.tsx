import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'
import * as htmlToImage from 'html-to-image'
import ShareCard from '@/components/ShareCard'
import type { ProfileTrait } from '@/components/ShareCard'

import { IBM_Plex_Sans_Thai } from 'next/font/google'
const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
import {
  computeProfile,
  pickAttractions,
  provinceMatchScore,
  Profile,
} from '@/lib/recommend'

function getTopTrait(profile: Profile): ProfileTrait | null {
  if (!profile) return null
  const sorted = Object.entries(profile).sort((a, b) => b[1] - a[1])
  return (sorted[0]?.[0] as ProfileTrait) || null
}

/* ================= STORY ================= */

function buildStory(profile: Profile, lang: string) {
  const sorted = Object.entries(profile).sort((a, b) => b[1] - a[1])
  const top = sorted[0]?.[0]


  if (lang === 'th') {
    if (top === 'nature')
      return `คุณคือคนที่หัวใจต้องการ “พื้นที่”

พื้นที่ของลมหายใจ
พื้นที่ของความเงียบที่ไม่ว่างเปล่า

คุณไม่ได้เดินทางเพื่อหนีบางอย่าง
คุณเดินทางเพื่อกลับมาเป็นตัวเองอีกครั้ง`

    if (top === 'cafe')
      return `คุณหลงรักรายละเอียดเล็ก ๆ ของชีวิต

แสงแดดบนโต๊ะไม้
กลิ่นกาแฟในบ่ายวันธรรมดา

คุณตามหาโมเมนต์ที่ทำให้ใจช้าลง`

    if (top === 'adventure')
      return `หัวใจของคุณไม่เคยอยู่นิ่ง

คุณรู้สึกมีชีวิตเมื่อได้ลองสิ่งใหม่
เมื่อได้ก้าวออกจากความคุ้นเคย`

    if (top === 'culture')
      return `คุณสนใจเรื่องราวเบื้องหลัง

ทุกเมืองคือหนังสือหนึ่งเล่ม
และคุณคือคนที่อ่านมันอย่างตั้งใจ`

    if (top === 'sea')
      return `ทะเลคือพื้นที่ปลอดภัยของคุณ

เสียงคลื่นซ้ำ ๆ
ทำให้คุณหายใจได้ลึกขึ้น`
  }

  // 🔥 English version กลับมาแล้ว
  if (top === 'nature')
    return `You crave space.

Not the loud kind —
but the quiet kind.

The kind that lets you breathe,
slow down,
and feel like yourself again.`

  if (top === 'cafe')
    return `You fall in love with small details.

Sunlight on wooden tables.
The smell of coffee in the afternoon.

You don’t chase noise.
You chase moments.`

  if (top === 'adventure')
    return `Your heart was never meant to stay still.

You feel alive
when something is new,
when something feels unknown.`

  if (top === 'culture')
    return `You look beyond what’s visible.

Every city is a story.
And you take time to read it.`

  if (top === 'sea')
    return `The ocean feels like home to you.

Waves repeating softly,
reminding you that life has its rhythm.`

  return `These destinations reflect your personality.`
}

/* ================= PAGE ================= */

export default function ResultsPage() {
  const router = useRouter()
  const { user, isGuest, loading: authLoading } = useAuth()
  const { lang } = useLang()

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [shareOpen, setShareOpen] = useState(false)

  const hasInserted = useRef(false)
  const shareRef = useRef<HTMLDivElement>(null)


  async function downloadImage() {
    if (!shareRef.current) return

    await document.fonts.ready
    await new Promise(res => setTimeout(res, 100))

    const dataUrl = await htmlToImage.toPng(shareRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    })

    const link = document.createElement('a')
    link.download = 'travel-result.png'
    link.href = dataUrl
    link.click()
  }


  const payload = useMemo(() => {
    if (!router.isReady) return null
    const regionId = router.query.regionId
    const selected = router.query.selected
    const answers = router.query.answers

    if (!selected || !answers) return null

    return {
      regionId: regionId ? Number(regionId) : null, // 👈 แก้ตรงนี้
      selectedOptionIds: JSON.parse(selected as string),
      answers: JSON.parse(answers as string),
    }
  }, [
    router.isReady,
    router.query.regionId,
    router.query.selected,
    router.query.answers,
  ])

  useEffect(() => {
    if (!router.isReady) return
    if (!authLoading && !user && !isGuest) {
      router.replace(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
    }
  }, [authLoading, user, isGuest, router.isReady])

  useEffect(() => {
    async function run() {
      if (!payload || (!user && !isGuest)) return
      if (!supabase) {
        setLoading(false)
        return
      }

      setLoading(true)   // ✅ เริ่มโหลดตรงนี้

      try {
        const { data: oData, error: oErr } = await supabase
          .from('quiz_options')
          .select('*')
          .in('id', payload.selectedOptionIds)

        if (oErr) throw oErr

        const prof = computeProfile(
          (oData || []).map((o: any) => ({
            nature: o.nature_score || 0,
            cafe: o.cafe_score || 0,
            adventure: o.adventure_score || 0,
            culture: o.culture_score || 0,
            sea: o.sea_score || 0,
          }))
        )

        setProfile(prof)

        let provinceQuery = supabase.from('provinces').select('*')

        if (payload.regionId) {
          provinceQuery = provinceQuery.eq('region_id', payload.regionId)
        }

        const { data: pData, error: pErr } = await provinceQuery

        if (pErr) throw pErr

        const rankedAll = (pData || [])
          .map((p: any) => ({
            ...p,
            matchScore: provinceMatchScore(prof, p),
          }))
          .sort((a, b) => {
            const diff = b.matchScore - a.matchScore
            if (diff !== 0) return diff

            // แทนที่ random ด้วย id
            return a.id - b.id
          })

        const topScore = rankedAll[0]?.matchScore || 0
        const ranked = rankedAll.slice(0, 3)

        const provinceIds = ranked.map((p: any) => p.id)

        const { data: allAttractions, error: aErr } = await supabase
          .from('province_attractions')
          .select('*')
          .in('province_id', provinceIds)

        if (aErr) throw aErr

        const out = ranked.map((prov: any) => ({
          province: prov,
          locations: pickAttractions(
            prof,
            (allAttractions || []).filter(
              (a: any) => a.province_id === prov.id
            ),
            3
          ),
        }))

        setItems(out)

        if (!hasInserted.current && !router.query.saved) {
          hasInserted.current = true

          const resultPayload = {
            recommended_provinces: ranked.map((p: any) => ({
              id: p.id,
              name_th: p.name_th,
              name_en: p.name_en,
            })),
            recommended_locations: out.flatMap((it: any) =>
              it.locations.map((loc: any) => ({
                id: loc.id,
                name_th: loc.name_th,
                name_en: loc.name_en,
                description: loc.description,
              }))
            ),
          }

          if (user) {
            await supabase.from('quiz_results').insert({
              user_id: user.id,
              ...resultPayload,
            })
          } else {
            const key = 'ttt_guest_results'
            const existing = JSON.parse(window.localStorage.getItem(key) || '[]')
            existing.unshift({
              id: `guest-${Date.now()}`,
              created_at: new Date().toISOString(),
              ...resultPayload,
            })
            window.localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)))
          }

          router.replace(
            {
              pathname: router.pathname,
              query: { ...router.query, saved: '1' },
            },
            undefined,
            { shallow: true }
          )
        }

      } catch (err) {
        console.error(err)


      } finally {
        setLoading(false)  // ✅ ปิด loading เสมอ
      }
    }

    if ((user || isGuest) && payload) run()
  }, [user, isGuest, payload])

  if (authLoading)
    return <p style={{ textAlign: 'center', marginTop: 120 }}>Checking login...</p>

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 120 }}>Preparing your result...</p>

  if (!user && !isGuest) return null

  // ✅ ใส่ตรงนี้
  if (!payload) {
    return (
      <p style={{ textAlign: 'center', marginTop: 120 }}>
        {lang === 'th'
          ? 'ไม่พบข้อมูลผลลัพธ์ กรุณาทำแบบทดสอบใหม่'
          : 'Result not found. Please retake the quiz.'}
      </p>
    )
  }

  const topProvince = items[0]?.province

  return (
    <div style={{ background: '#f6f3ee', minHeight: '100vh', padding: '70px 20px' }}>

      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 36 }}>
          {lang === 'th'
            ? 'จุดหมายที่ใช่สำหรับคุณ'
            : 'your perfect destination'}
        </h1>

        {profile && (
          <>
            <div
              style={{
                whiteSpace: 'pre-line',
                lineHeight: 1.9,
                marginBottom: 40,
              }}
            >
              {buildStory(profile, lang)}
            </div>

            {topProvince && (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 70,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.6,
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}
                >
                  {lang === 'th'
                    ? 'สถานที่ที่เหมาะกับคุณที่สุด'
                    : 'Your best match'}
                </div>

                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {lang === 'th'
                    ? topProvince.name_th
                    : topProvince.name_en}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    fontSize: 15,
                    opacity: 0.75,
                    lineHeight: 1.7,
                    maxWidth: 480,
                    marginInline: 'auto',
                  }}
                >
                  {lang === 'th'
                    ? 'ที่นี่อาจไม่ใช่แค่จังหวัดหนึ่งบนแผนที่ แต่เป็นพื้นที่ที่จังหวะของมันสอดคล้องกับหัวใจคุณมากที่สุด'
                    : 'This is not just a location — it is a place that resonates deeply with who you are.'}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, idx) => (
          <div
            key={it.province.id}
            style={{
              background: '#fff',
              padding: 22,
              borderRadius: 16,
              border: '1px solid #ebe7df',
            }}
          >
            <h2 style={{ fontSize: 18, marginBottom: 14, fontWeight: 600 }}>
              {idx + 1}.{' '}
              {lang === 'th'
                ? it.province.name_th
                : it.province.name_en}
            </h2>

            {it.locations.map((loc: any) => (
              <div key={loc.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 500 }}>
                  {lang === 'th'
                    ? loc.name_th
                    : loc.name_en}
                </div>
                <div style={{ opacity: 0.6, fontSize: 13 }}>
                  {loc.description ||
                    (lang === 'th'
                      ? 'สถานที่ที่ควรค่าแก่การไปสัมผัสด้วยตัวเอง'
                      : 'A place worth experiencing.')}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            flex: '1 1 180px',
            padding: 12,
            borderRadius: 999,
            border: '1px solid #222',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {lang === 'th' ? 'ทำแบบทดสอบใหม่' : 'Retake Quiz'}
        </button>

        <div style={{ position: 'relative', flex: '1 1 180px' }}>
          <button
            className="primary"
            onClick={() => setShareOpen(!shareOpen)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 999,
            }}
          >
            {lang === 'th' ? 'แชร์ผลลัพธ์' : 'Share Result'}
          </button>

          {shareOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '110%',
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
              {/* 🔥 HIDDEN SHARE CARD (for export only) */}
              <div
                style={{
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                  top: -9999,
                  left: -9999,
                }}
              >
                {/* 🔥 HIDDEN SHARE CARD (for export only) */}
                <div
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    top: -9999,
                    left: -9999,
                  }}
                >
                  <div ref={shareRef}>
                    {profile && (
                      <ShareCard
                        story={buildStory(profile, lang)}
                        topProvince={topProvince}
                        lang={lang}
                        trait={getTopTrait(profile)}
                        className={ibmThai.className}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
