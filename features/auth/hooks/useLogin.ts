import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
function login(data : any) {
  return api.post("/auth/login", data)
}

export function useLogin() {
  const submit = async (data : any) => {
    await login(data)
  }

  return { submit }
}