import { useMemo } from "react"
import { useRouter } from "next/router"
import LoginModal from "@/components/loginmodal"

export default function LoginPage() {
  const router = useRouter()

  const returnTo = useMemo(() => {
    const raw = router.query.returnTo
    return typeof raw === "string" && raw.startsWith("/") ? raw : "/"
  }, [router.query.returnTo])

  return (
    <LoginModal
      onClose={() => {
        router.replace(returnTo)
      }}
    />
  )
}
