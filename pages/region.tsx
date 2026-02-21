import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"
import { supabase } from "@/utils/supabase/client"

type Region = {
  id: number
  name_th: string | null
  name_en: string | null
}

export default function SelectRegion() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLang()

  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    async function loadRegions() {
      try {
        const { data, error } = await supabase
          .from("regions")
          .select("id, name_th, name_en")
          .order("id")

        if (error) throw error
        setRegions(data || [])
      } catch (err: any) {
        setError(err?.message || "Failed to load regions")
      } finally {
        setLoading(false)
      }
    }

    if (user) loadRegions()
  }, [user])

  const selectRegion = (regionId: number) => {
    router.push({
      pathname: "/quiz",
      query: { regionId },
    })
  }

  if (authLoading || loading) return null
  if (!user) return null

  return (
    <>
      <div className="wrapper">
        <div className="card">

          <p className="subtitle">
            {lang === "th" ? "เริ่มต้นการเดินทาง" : "Begin your journey"}
          </p>

          <h1 className="title">
            {lang === "th"
              ? "เลือกภูมิภาคที่คุณสนใจ"
              : "Select a region that interests you"}
          </h1>

          {error && <div className="error">{error}</div>}

          <div className="regionList">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => selectRegion(region.id)}
                className="regionButton"
              >
                {lang === "th"
                  ? region.name_th || "-"
                  : region.name_en || "-"}
              </button>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        .wrapper {
          min-height: 100vh;
          background: linear-gradient(to bottom, #F6F1E8, #EFE6DA);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .card {
          width: 100%;
          max-width: 520px;
          background: white;
          padding: 48px 36px;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          text-align: center;
        }

        .subtitle {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #8C6A4A;
          margin-bottom: 12px;
        }

        .title {
          font-size: 22px;
          font-weight: 500;
          color: #5C4033;
          margin-bottom: 32px;
        }

        .error {
          color: #c0392b;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .regionList {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .regionButton {
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #E8D8C3;
          font-size: 15px;
          color: #5C4033;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .regionButton:hover {
          transform: translateY(-3px);
          background: #DCC5AB;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        .regionButton:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  )
}