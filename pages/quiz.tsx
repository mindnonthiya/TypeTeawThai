import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { supabase } from '@/utils/supabase/client'
import ProgressBar from '@/components/ProgressBar'

type QRow = {
  id: number
  question_no: number
  question_th: string
  question_en: string
}

type ORow = {
  id: number
  question_id: number
  option_label: string
  option_th: string
  option_en: string
}

type Question = QRow & { options: ORow[] }

const questionImages: Record<number, string> = {
  1: '/images/q1.png',
  2: '/images/q2.png',
  3: '/images/q3.png',
  4: '/images/q4.png',
  5: '/images/q5.png',
  6: '/images/q6.png',
  7: '/images/q7.png',
  8: '/images/q8.png',
  9: '/images/q9.png',
  10: '/images/q10.png',
  11: '/images/q11.png',
  12: '/images/q12.png',
}

export default function QuizPage() {
  const router = useRouter()
  const regionIdParam = router.query.regionId
  const regionId =
    typeof regionIdParam === "string"
      ? Number(regionIdParam)
      : undefined

  const { user, isGuest, loading: authLoading } = useAuth()
  const { t, lang } = useLang() // ✅ เพิ่ม lang ตรงนี้

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  // 🔐 redirect ถ้าไม่ได้ login และไม่ได้เข้าแบบ guest
  useEffect(() => {
    if (!authLoading && !user && !isGuest) router.replace(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
  }, [authLoading, user, isGuest, router])

  // 📦 โหลดคำถามจาก Supabase
  useEffect(() => {
    if (!router.isReady || (!user && !isGuest)) return

    async function load() {
      if (!supabase) {
        setError('Supabase is not configured')
        setLoading(false)
        return
      }

      try {
        const { data: qData, error: qErr } = await supabase
          .from('quiz_questions')
          .select('id, question_no, question_th, question_en')
          .order('question_no')

        if (qErr) throw qErr

        const qIds = qData?.map((q) => q.id) || []

        const { data: oData, error: oErr } = await supabase
          .from('quiz_options')
          .select('id, question_id, option_label, option_th, option_en')
          .in('question_id', qIds)
          .order('option_label')

        if (oErr) throw oErr

        const map = new Map<number, Question>()

        qData?.forEach((q) => {
          map.set(q.id, { ...q, options: [] })
        })

        oData?.forEach((o) => {
          map.get(o.question_id)?.options.push(o)
        })

        setQuestions(Array.from(map.values()))
      } catch (e: any) {
        setError(e?.message || 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router.isReady, user, isGuest])

  const nextQuestion = () => {
    if (selected === null) return

    const current = questions[step]
    const updated = { ...answers, [current.id]: selected }
    setAnswers(updated)

    if (step < questions.length - 1) {
      setStep(step + 1)
      setSelected(null)
    } else {
      const optionIds = Object.values(updated)

      router.push({
        pathname: "/results",
        query: {
          regionId: regionId ?? "", // ✅ ถ้าไม่มี ให้เป็น empty
          selected: JSON.stringify(optionIds),
          answers: JSON.stringify(updated),
        },
      })
    }
  }

  const prevQuestion = () => {
    if (step > 0) {
      setStep(step - 1)
      setSelected(null)
    }
  }

  if (authLoading || loading)
    return <p className="muted">{t('loading')}</p>

  if (!user && !isGuest) return null

  if (error)
    return (
      <div className="toast danger">
        <div style={{ color: 'var(--danger)' }}>{error}</div>
      </div>
    )

  if (!questions.length)
    return <p className="muted">No questions found.</p>

  const current = questions[step]
  const imageSrc =
    questionImages[current.question_no] || '/images/default.png'

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F6F1E8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 16px"
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>

        <div className="mb-10">
          <ProgressBar step={step} total={questions.length} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Question */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "28px",
              color: "#374151",
              lineHeight: "1.6"
            }}
          >
            {lang === "th" ? current.question_th : current.question_en}
          </h2>

          {/* Image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <img
              src={imageSrc}
              alt="question"
              style={{
                width: "360px",
                height: "280px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Choices */}
          <div style={{ marginTop: "10px" }}>
            {current.options.map((opt) => {
              const isActive = selected === opt.id

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    marginBottom: "4px",
                    textAlign: "left",
                    borderRadius: "14px",
                    border: isActive
                      ? "2px solid #8C6A4A"
                      : "1px solid #D1D5DB",
                    backgroundColor: isActive ? "#F3ECE4" : "#FFFFFF",
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {lang === "th" ? opt.option_th : opt.option_en}
                </button>
              )
            })}
          </div>

          {/* Bottom Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "36px"
            }}
          >
            <button
              onClick={prevQuestion}
              disabled={step === 0}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                backgroundColor: "#E5E7EB",
                border: "none",
                opacity: step === 0 ? 0.4 : 1,
                cursor: "pointer"
              }}
            >
              {lang === "th" ? "ย้อนกลับ" : "Back"}
            </button>

            <button
              className="primary"
              onClick={nextQuestion}
              disabled={selected === null}
            >
              {step === questions.length - 1
                ? (lang === "th" ? "ดูผลลัพธ์" : "View Result")
                : (lang === "th" ? "ถัดไป" : "Next")}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}