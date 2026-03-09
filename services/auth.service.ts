import { api } from "./api"

export type LoginPayload = {
  email: string
  password: string
}

// Supertokens attend { formFields: [{ id, value }, ...] }
export const login = (data: LoginPayload) =>
  api.post("/auth/signin", {
    formFields: [
      { id: "email", value: data.email },
      { id: "password", value: data.password },
    ],
  })

// Récupérer l'utilisateur courant via /auth/me
export const me = () => api.get("/auth/me")

// Déconnexion via /auth/logout
export const logout = () => api.post("/auth/logout")
