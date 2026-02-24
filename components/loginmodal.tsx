import { useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"

type Props = {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const router = useRouter()
  const { signIn, signUp, continueAsGuest } = useAuth()
  const { lang } = useLang()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      if (mode === "login") {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }

      router.push("/") // redirect ที่เดียว
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setBusy(false)
    }
  }

  const handleSkip = () => {
    continueAsGuest()
    router.push('/region')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        

        <h1 className="card-title">
          {mode === "login"
            ? lang === "th" ? "เข้าสู่ระบบ" : "Login"
            : lang === "th" ? "สมัครสมาชิก" : "Register"}
        </h1>

        <p className="subtitle">
          {mode === "login"
            ? lang === "th"
              ? "ค้นพบจุดหมายที่ใช่สำหรับคุณ"
              : "Discover your perfect destination"
            : lang === "th"
              ? "สร้างบัญชีใหม่เพื่อเริ่มต้น"
              : "Create an account to get started"}
        </p>

        <label>{lang === "th" ? "อีเมล" : "Email"}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>{lang === "th" ? "รหัสผ่าน" : "Password"}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          className="main-btn"
          disabled={busy}
        >
          {busy
            ? "..."
            : mode === "login"
              ? lang === "th" ? "เข้าสู่ระบบ" : "Login"
              : lang === "th" ? "สมัครสมาชิก" : "Register"}
        </button>

        <p className="switch">
          {mode === "login"
            ? lang === "th" ? "ยังไม่มีบัญชี?" : "No account?"
            : lang === "th" ? "มีบัญชีแล้ว?" : "Already have an account?"}{" "}
          <span
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login"
              ? lang === "th" ? "ลงทะเบียน" : "Register"
              : lang === "th" ? "เข้าสู่ระบบ" : "Login"}
          </span>
        </p>

        <button
          type="button"
          className="skip-btn"
          onClick={handleSkip}
        >
          {lang === "th" ? "ข้ามการสมัครและเริ่มแบบทดสอบ" : "Skip registration and start quiz"}
        </button>
      </form>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          padding: 16px;
        }

        .modal-card {
          background: #efe5d8;
          padding: 28px 22px;
          border-radius: 20px;
          width: 100%;
          max-width: 360px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 14px;
          border: none;
          background: none;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.7;
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
        }

        input {
          padding: 11px;
          border-radius: 10px;
          border: none;
          background: #d7dee7;
          font-size: 13px;
        }

        .main-btn {
          margin-top: 10px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: #dea88bff;
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }

        .main-btn:disabled {
          opacity: 0.6;
        }

        .switch {
          text-align: center;
          font-size: 12px;
          margin-top: 8px;
        }

        .switch span {
          color: #a45c2f;
          font-weight: 600;
          cursor: pointer;
        }

        .error {
          color: #c0392b;
          font-size: 11px;
        }

        .skip-btn {
          border: none;
          background: transparent;
          color: #6b5448;
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
          margin-top: -2px;
        }
      `}</style>
    </div>
  )
}