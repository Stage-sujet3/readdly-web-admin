"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLogin } from "./useLogin"

export type FormErrors = {
  email?: string
  password?: string
  form?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useLoginForm() {
  const router = useRouter()
  const { submit } = useLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validate = () => {
    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = "L'adresse e-mail est requise"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide"
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) return

    try {
      setIsLoading(true)
      await submit({ email, password })
      router.push("/dashboard")
    } catch (error: any) {
      if (error?.response) {
        // eslint-disable-next-line no-console
        console.error("Erreur /auth/signin:", error.response.status, error.response.data)
      }
      setErrors({
        form:
          error?.response?.data?.message ??
          "Échec de la connexion. Vérifiez vos identifiants et réessayez.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => setShowPassword((prev) => !prev)

  return {
    // state
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    errors,
    focusedField,
    setFocusedField,
    // actions
    handleSubmit,
    toggleShowPassword,
  }
}
