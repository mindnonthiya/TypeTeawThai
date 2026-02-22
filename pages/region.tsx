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
  
  return (
    <>
      <div className="wrapper">
        <div className="content">

          <p className="subtitle">
            {lang === "th" ? "เริ่มต้นการเดินทาง" : "Begin your journey"}
          </p>

          <h1 className="title">
            {lang === "th"
              ? "ค้นหาจังหวัดที่เหมาะกับตัวคุณ"
              : "Discover the province that matches you"}
          </h1>

          <p className="story">
            {lang === "th"
              ? "เลือกภูมิภาคที่คุณสนใจ หรือทำแบบทดสอบทั้งหมดเพื่อค้นหาจังหวัดที่เข้ากับคุณมากที่สุด"
              : "Choose a region you’re interested in, or take the full quiz to discover your best match."}
          </p>

          {error && <div className="error">{error}</div>}

          {/* SECTION 1 */}
          <div className="section">
            <h2 className="sectionTitle">
              {lang === "th" ? "เลือกภูมิภาค" : "Choose a region"}
            </h2>

            <div className="regionList">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => selectRegion(region.id)}
                  className="outlineButton"
                >
                  {lang === "th"
                    ? region.name_th || "-"
                    : region.name_en || "-"}
                </button>
              ))}
            </div>
          </div>

          <div className="divider">
            <span>{lang === "th" ? "หรือ" : "OR"}</span>
          </div>

          {/* SECTION 2 */}
          <div className="section">
            <h2 className="sectionTitle">
              {lang === "th"
                ? "ทำแบบทดสอบโดยไม่เลือกภูมิภาค"
                : "Start without selecting a region"}
            </h2>

            <button
              onClick={() => router.push("/quiz")}
              className="outlineButton"
            >
              {lang === "th"
                ? "เริ่มทำแบบทดสอบ"
                : "Start quiz"}
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F6F1E8;
          padding: 80px 24px;
        }

        .content {
          max-width: 560px;
          width: 100%;
          text-align: center;
        }

        .subtitle {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 18px;
        }

        .title {
          font-size: 22px;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .story {
          font-size: 15px;
          line-height: 1.9;
          opacity: 0.75;
          margin-bottom: 50px;
        }

        .sectionTitle {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 24px;
        }

        .regionList {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .outlineButton {
          width: 260px;        /* ความยาวเท่ากันทุกปุ่ม */
          border: 1px solid rgba(0,0,0,0.25);
          background: transparent;
          padding: 12px 8px;
          border-radius: 28px; /* วงรีแบบนุ่ม ๆ */
          font-size: 15px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .outlineButton:hover {
          border-color: black;
          transform: translateY(-2px);
          background: rgba(0,0,0,0.03);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 40px 0;
          font-size: 12px;
          letter-spacing: 3px;
          opacity: 0.6;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.15);
        }

        .divider span {
          padding: 0 15px;
        }

        .error {
          font-size: 13px;
          margin-bottom: 20px;
          color: #b44;
        }
      `}</style>
    </>
  )
}