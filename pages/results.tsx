import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'
import {
  computeProfile,
  pickAttractions,
  provinceMatchScore,
  Profile,
} from '@/lib/recommend'

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
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLang()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [items, setItems] = useState<any[]>([])

  const hasInserted = useRef(false)

  const payload = useMemo(() => {
    if (!router.isReady) return null
    const { regionId, selected, answers } = router.query
    if (!regionId || !selected || !answers) return null
    return {
      regionId: Number(regionId),
      selectedOptionIds: JSON.parse(selected as string),
      answers: JSON.parse(answers as string),
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    hasInserted.current = false
  }, [payload])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/')
  }, [authLoading, user])

  useEffect(() => {
    async function run() {
      if (!payload || !user) return

      const { data: oData } = await supabase
        .from('quiz_options')
        .select('*')
        .in('id', payload.selectedOptionIds)

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

      const { data: pData } = await supabase
        .from('provinces')
        .select('*')
        .eq('region_id', payload.regionId)

      const rankedAll = (pData || [])
        .map((p: any) => ({
          ...p,
          matchScore: provinceMatchScore(prof, p),
        }))
        .sort((a: any, b: any) => b.matchScore - a.matchScore)

      const topScore = rankedAll[0]?.matchScore || 0
      const ranked = rankedAll
        .filter((p: any) => p.matchScore >= topScore * 0.85)
        .slice(0, 3)

      const provinceIds = ranked.map((p: any) => p.id)

      const { data: allAttractions } = await supabase
        .from('province_attractions')
        .select('*')
        .in('province_id', provinceIds)

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
      setLoading(false)

      if (hasInserted.current) return
      hasInserted.current = true

      await supabase.from('quiz_results').insert({
        user_id: user.id,
        recommended_provinces: ranked,
      })
    }

    if (user && payload) run()
  }, [user, payload])

  if (authLoading || loading)
    return <p style={{ textAlign: 'center', marginTop: 120 }}>Loading...</p>
  if (!user) return null

  const topProvince = items[0]?.province

  return (
    <div style={{ background: '#f6f3ee', minHeight: '100vh', padding: '70px 20px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 36 }}>
          {lang === 'th'
            ? 'จุดหมายที่ใช่สำหรับคุณ'
            : 'This is your perfect destination'}
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

          <button
            onClick={async () => {
              const url = window.location.href
              if (navigator.share) {
                await navigator.share({
                  title: 'My Travel Result',
                  url,
                })
              } else {
                await navigator.clipboard.writeText(url)
                alert(lang === 'th' ? 'คัดลอกลิงก์แล้ว' : 'Link copied')
              }
            }}
            style={{
              flex: '1 1 180px',
              padding: 12,
              borderRadius: 999,
              border: 'none',
              background: '#2d2a26',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {lang === 'th' ? 'แชร์ผลลัพธ์' : 'Share Result'}
          </button>
        </div>
      </div>
    </div>
  )
} 