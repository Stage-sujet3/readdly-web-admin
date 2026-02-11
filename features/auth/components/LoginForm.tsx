"use client"

import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useLoginForm } from "../hooks/useLoginForm"

type LoginFormProps = {
  isDark?: boolean
}

export function LoginForm({ isDark = false }: LoginFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    errors,
    focusedField,
    setFocusedField,
    handleSubmit,
    toggleShowPassword,
  } = useLoginForm()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-xl border ${
        isDark
          ? "bg-[var(--color-surface-dark)] border-slate-700"
          : "bg-[var(--color-surface-light)] border-slate-100"
      }`}
    >
      {/* Headers */}
      <div className="lg:hidden mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-6 py-3 rounded-full shadow-lg mb-4"
        >
          <Shield className="w-6 h-6" />
          <span className="font-bold text-lg">Admin Portal</span>
        </motion.div>
        <h2
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-[var(--color-text-light)]" : "text-slate-800"
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
              isDark ? "text-[var(--color-text-light)]" : "text-slate-800"
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
                      ? "text-[var(--color-primary)]"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(value) => setEmail(value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="admin@exemple.com"
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all outline-none ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : focusedField === "email"
                    ? "border-[var(--color-primary)] bg-white"
                    : "border-slate-200 focus:border-[var(--color-primary)]"
                }`}
                style={
                  isDark
                    ? {
                        backgroundColor: "#ffffff",
                        color: "#111827",
                      }
                    : undefined
                }
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
                      ? "text-[var(--color-primary)]"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(value) => setPassword(value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all outline-none ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : focusedField === "password"
                    ? "border-[var(--color-primary)] bg-white"
                    : "border-slate-200 focus:border-[var(--color-primary)]"
                }`}
                style={
                  isDark
                    ? {
                        backgroundColor: "#ffffff",
                        color: "#111827",
                      }
                    : undefined
                }
              />
              <button
                type="button"
                onClick={toggleShowPassword}
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
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
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  )
}
