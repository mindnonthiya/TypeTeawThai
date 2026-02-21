import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import LoginModal from "@/components/loginmodal"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/")
    }
  }, [loading, user, router])

  return (
    <LoginModal onClose={() => router.replace("/")} />
  )
}