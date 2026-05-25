"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, CheckCircle2, AlertCircle, Moon, Sun } from "lucide-react"
import { LoginForm } from "@/features/auth/components/LoginForm"

export default function AdminAuthPage() {
  const [isDark, setIsDark] = useState(false)

  const bgClass = isDark
    ? "bg-gradient-to-br from-[#1a2a4a] to-[#2a3a5a]"
    : "bg-gradient-to-br from-[#edeffa] to-[#e6e9f8]"

  // Couleur d'accent identique en light et dark (Readdly / Espace d'Administration)
  const accentGradient = "from-[#5f6ad8] to-[#444fc0]"

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col relative overflow-hidden`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full py-6 px-8 relative z-20 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            className={`relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl bg-white border-2 flex items-center justify-center ${
              isDark ? "border-[#4430a8]" : "border-[#4c57cf]"
            }`}
          >
            <Image
              src="/images/logo-readdly.png"
              alt="Readdly"
              fill
              sizes="64px"
              className="object-contain p-2"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}
            >
              Readdly
            </h1>
            <p className="text-sm text-slate-600">Portail Administrateur</p>
          </motion.div>
        </div>

        {/* Light/Dark toggle */}
        <button
          type="button"
          onClick={() => setIsDark((prev) => !prev)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            isDark ? "border-white/70 bg-[#1f2b4a]" : "border-[#5f6ad8] bg-white"
          }`}
          aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-[#FFD75A]" />
          ) : (
            <Sun className="h-5 w-5 text-[#f4b000]" />
          )}
        </button>
      </motion.header>

      {/* Decorative background (wave) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[30%] overflow-hidden">
          <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,60 C200,140 300,20 450,70 C550,100 650,10 800,50 C950,90 1050,0 1200,40 L1200,120 L0,120 Z"
              className={`fill-current ${isDark ? "text-[#1a2a4a]" : "text-white"}`}
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-4 w-full max-w-6xl mx-auto"
      >
        <div className="w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left - branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center gap-3 bg-gradient-to-r ${accentGradient} text-white px-6 py-3 rounded-full shadow-lg`}
              >
                <Shield className="w-8 h-8" />
                <span className="font-bold text-xl">Portail Admin</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-4xl md:text-5xl font-bold leading-tight ${
                  isDark ? "text-[#f8f4e6]" : "text-slate-900"
                }`}
              >
                Bienvenue dans votre{" "}
                <span
                  className={`align-baseline text-[0.9em] bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}
                >
                  Espace d&apos;Administration
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-lg ${isDark ? "text-[#e0d8c0]" : "text-slate-600"}`}
              >
                Gérez votre système en toute sécurité avec des outils professionnels et une interface
                moderne.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-4 mt-4"
            >
              {[
                { icon: Shield, text: "Gestion Centralisée" },
                { icon: CheckCircle2, text: "Statistiques & Analyses" },
                { icon: AlertCircle, text: "Gestion Utilisateurs" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm"
                >
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                  <span className="text-sm text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - login form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <LoginForm isDark={isDark} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

