import { login, me } from "@/services/auth.service"

export function useLogin() {
  const submit = async (data: { email: string; password: string }) => {
    // 1) Login
    const response = await login(data)

    // Si la connexion a échoué (ex: mauvais mot de passe)
    if (response.data?.status !== "OK") {
      const errorMsg = response.data?.status === "WRONG_CREDENTIALS_ERROR"
        ? "Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe."
        : "Échec de la connexion. Veuillez réessayer."
      
      const error = new Error(errorMsg) as any
      error.response = {
        status: 400,
        data: { message: errorMsg }
      }
      throw error
    }

    // Attendre un court instant que la session soit bien propagée/reconnue par le gateway
    await new Promise((resolve) => setTimeout(resolve, 300))

    // 2) Récupérer l'utilisateur courant
    const meResponse = await me()
    return meResponse.data
  }

  return { submit }
}