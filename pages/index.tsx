import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"
import type { NextPageWithLayout } from "./_app"

const Home: NextPageWithLayout = () => {
  const router = useRouter()
  const { loading } = useAuth()
  const { t } = useLang()

  if (loading) return null

  return (
    <>
      <div className="wrapper">
        <div className="container">

          <div className="intro">
            <p className="smallItalic">{t("homeIntro1")}</p>
            <p className="title">{t("homeIntro2")}</p>
            <p className="title">{t("homeIntro3")}</p>
            <p className="small">{t("homeIntro4")}</p>
          </div>

          <div className="divider"></div>

          <div className="reflection">
            <p>{t("homeReflection1")}</p>
            <p>{t("homeReflection2")}</p>
            <p>{t("homeReflection3")}</p>
            <p>{t("homeReflection4")}</p>
          </div>

          <div className="ending">
            <p className="small">{t("homeEnding1")}</p>
            <p>
              {t("homeEnding2")}<br />
              {t("homeEnding3")}
            </p>
            <p className="highlight">
              {t("homeEnding4")}
            </p>
          </div>

          <div className="buttonSection">
            <button
              onClick={() => router.push("/region")}
              className="startButton"
            >
              {t("start")}
            </button>

            <p className="terms">
              {t("homeTerms")}
            </p>
          </div>

        </div>
      </div>

      <style jsx>{`
        .wrapper {
          min-height: 100vh;
          background-color: #F5EFE6;
          color: #4B382F;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .container {
          max-width: 520px;
          width: 100%;
          text-align: center;
        }

        .intro {
          margin-bottom: 40px;
        }

        .smallItalic {
          font-size: 14px;
          color: #6B5448;
          font-style: italic;
          margin-bottom: 10px;
        }

        .title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 10px;
        }

        .small {
          font-size: 14px;
          color: #6B5448;
          margin-top: 15px;
        }

        .divider {
          width: 110px;
          height: 1px;
          background-color: #D7CFC4;
          margin: 30px auto;
        }

        .reflection {
          font-size: 14px;
          color: #6B5448;
          line-height: 1.8;
          margin-bottom: 40px;
        }

        .ending {
          margin-bottom: 40px;
          line-height: 1.8;
        }

        .highlight {
          font-size: 18px;
          font-weight: 500;
          margin-top: 10px;
        }

        .buttonSection {
          margin-top: 30px;
        }

        .startButton {width: 260px; /* ความยาวเท่ากันทุกปุ่ม */ border: 1px solid rgba(0,0,0,0.25); background: transparent; padding: 12px 8px; border-radius: 28px; /* วงรีแบบนุ่ม ๆ */ font-size: 15px; cursor: pointer; transition: all 0.25s ease;
}

.startButton:hover {border-color: black; transform: translateY(-2px); background: rgba(0,0,0,0.03);
}

.startButton:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

        .terms {
          font-size: 12px;
          color: #6B5448;
          margin-top: 15px;
          opacity: 0.6;
        }
      `}</style>
    </>
  )
}

export default Home
