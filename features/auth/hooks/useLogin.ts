import { login, me } from "@/services/auth.service"

export function useLogin() {
  const submit = async (data: { email: string; password: string }) => {
    // 1) Login
    await login(data)

    // 2) Récupérer l'utilisateur courant
    const response = await me()
    return response.data
  }

  return { submit }
}