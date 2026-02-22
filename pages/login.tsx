import { useRouter } from "next/router"
import LoginModal from "@/components/loginmodal"

export default function LoginPage() {
  const router = useRouter()

  return (
    <LoginModal
      onClose={() => {
        if (window.history.length > 1) {
          router.back()
        } else {
          router.replace("/")
        }
      }}
    />
  )
}