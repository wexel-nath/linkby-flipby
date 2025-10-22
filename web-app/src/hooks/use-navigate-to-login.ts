import { useNavigate } from "react-router-dom"

export function useNavigateToLogin() {
  const navigate = useNavigate()

  return (targetPath?: string) => {
    if (targetPath) {
      navigate("/login?target=" + encodeURIComponent(targetPath))
    }

    navigate("/login")
  }
}
