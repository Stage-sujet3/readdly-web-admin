"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLogin } from "../hooks/useLogin"

type FormErrors = {
  email?: string
  password?: string
  form?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginFormProps = {
  isDark?: boolean
}

export function LoginForm({ isDark = false }: LoginFormProps) {
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
      // SuperTokens impose par défaut un minimum de 8 caractères
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
      // Pour faciliter le debug entre front et back
      // (status, payload d'erreur retourné par la gateway / Supertokens)
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-xl border ${
        isDark ? "bg-[#1f2b4a] border-slate-700" : "bg-white border-slate-100"
      }`}
    >
      {/* Headers */}
      <div className="lg:hidden mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white px-6 py-3 rounded-full shadow-lg mb-4"
        >
          <Shield className="w-6 h-6" />
          <span className="font-bold text-lg">Admin Portal</span>
        </motion.div>
        <h2
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-[#f8f4e6]" : "text-slate-800"
          }`}
        >
          Connexion
        </h2>
        <p className={isDark ? "text-[#e0d8c0]" : "text-slate-600"}>
          Accédez à votre espace d&apos;administration
        </p>
      </div>

      <div className="hidden lg:block mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-[#f8f4e6]" : "text-slate-800"
            }`}
          >
            Connexion Administrateur
          </h2>
          <p className={isDark ? "text-[#e0d8c0]" : "text-slate-600"}>
            Veuillez vous identifier pour continuer
          </p>
        </motion.div>
      </div>

      {errors.form && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label
            htmlFor="email"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-[#e0d8c0]" : "text-slate-700"
            }`}
          >
            Adresse e-mail
          </label>
          <div className="relative">
            <motion.div
              animate={{
                scale: focusedField === "email" ? 1 : 0.95,
                boxShadow:
                  focusedField === "email"
                    ? "0 0 0 3px rgba(99, 102, 241, 0.1)"
                    : "0 0 0 0px rgba(99, 102, 241, 0)",
              }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail
                  className={`w-5 h-5 transition-colors ${
                    focusedField === "email"
                      ? "text-[#5f6ad8]"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all outline-none ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : focusedField === "email"
                    ? "border-[#5f6ad8] bg-white"
                    : "border-slate-200 focus:border-[#5f6ad8]"
                }`}
                style={
                  isDark
                    ? {
                        backgroundColor: "#ffffff",
                        color: "#111827",
                      }
                    : undefined
                }
                placeholder="admin@exemple.com"
              />
            </motion.div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            htmlFor="password"
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-[#e0d8c0]" : "text-slate-700"
            }`}
          >
            Mot de passe
          </label>
          <div className="relative">
            <motion.div
              animate={{
                scale: focusedField === "password" ? 1 : 0.95,
                boxShadow:
                  focusedField === "password"
                    ? "0 0 0 3px rgba(99, 102, 241, 0.1)"
                    : "0 0 0 0px rgba(99, 102, 241, 0)",
              }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock
                  className={`w-5 h-5 transition-colors ${
                    focusedField === "password"
                      ? "text-[#5f6ad8]"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all outline-none ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : focusedField === "password"
                    ? "border-[#5f6ad8] bg-white"
                    : "border-slate-200 focus:border-[#5f6ad8]"
                }`}
                style={
                  isDark
                    ? {
                        backgroundColor: "#ffffff",
                        color: "#111827",
                      }
                    : undefined
                }
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}

