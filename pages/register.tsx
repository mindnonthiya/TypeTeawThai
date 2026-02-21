import { useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { useLang } from "@/contexts/LanguageContext"

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()
    const { lang } = useLang()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function doRegister() {
        setBusy(true)
        setError(null)

        try {
            await signUp(email, password)
            router.push("/")
        } catch (e: any) {
            setError(e?.message || "Register failed")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="page">
            <div className="card">
                <h1>{lang === "th" ? "สมัครสมาชิก" : "Register"}</h1>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <button onClick={doRegister} disabled={busy}>
                    {busy ? "..." : lang === "th" ? "สมัครสมาชิก" : "Register"}
                </button>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
          background: #e8dccd;
          padding: 48px;
          border-radius: 24px;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        input {
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #cfd6df;
        }

        button {
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: #111;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .error {
          color: red;
          font-size: 14px;
        }
      `}</style>
        </div>
    )
}