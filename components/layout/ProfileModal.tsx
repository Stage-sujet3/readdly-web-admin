"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/services/api"
import { authService } from "@/services/auth"
import { X, AlertCircle, ShieldCheck, Mail, ArrowRight, CheckCircle2, Lock } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function ProfileModal({ isOpen, onClose, userEmail }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email')
  
  // States for Email Change
  const [newEmail, setNewEmail] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false)
  
  // States for Password Change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendEmailOtp = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.post('/auth/email-change/otp/send', { newEmail });
      if (res.data.success) {
        setIsEmailOtpSent(true)
        setSuccess("Code envoyé à la nouvelle adresse email.")
      } else {
        setError(res.data.message || "Erreur lors de l'envoi du code.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur technique.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmailOtp = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.post('/auth/email-change/otp/verify', { newEmail, otp: emailOtp });
      if (res.data.success) {
        setSuccess("Email mis à jour avec succès.")
        setTimeout(() => {
          onClose();
          window.location.reload(); // Reload to refresh user info
        }, 2000)
      } else {
        setError(res.data.message || "Code invalide.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur technique.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    
    setIsLoading(true)
    setError("")
    try {
      const res = await authService.updatePassword(currentPassword, newPassword);
      if (res.success) {
        setSuccess("Mot de passe mis à jour avec succès.")
        setTimeout(onClose, 2000)
      } else {
        setError(res.message || "Erreur lors de la mise à jour.")
      }
    } catch (err: any) {
      setError("Erreur technique.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-[#1a2a4a]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#1a2a4a]">Sécurité du compte</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gérer vos accès</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => { setActiveTab('email'); setError(""); setSuccess(""); }}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'email' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Changer l'Email
              </button>
              <button 
                onClick={() => { setActiveTab('password'); setError(""); setSuccess(""); }}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'password' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Changer le Mot de passe
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-sm font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  {success}
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Actuel</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold text-sm">
                      {userEmail}
                    </div>
                  </div>

                  {!isEmailOtpSent ? (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nouvel Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="nouvel@email.com"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleSendEmailOtp}
                        disabled={!newEmail || isLoading}
                        className="w-full py-4 bg-[#1a2a4a] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? "Envoi..." : "Envoyer le code OTP"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Code de Validation (OTP)</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none tracking-[0.2em]"
                            placeholder="000000"
                            maxLength={6}
                          />
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-2">Le code a été envoyé à {newEmail}</p>
                      </div>
                      <button 
                        onClick={handleVerifyEmailOtp}
                        disabled={!emailOtp || isLoading || emailOtp.length !== 6}
                        className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? "Vérification..." : "Valider le nouvel email"}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mot de passe actuel</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nouveau mot de passe</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleUpdatePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
                    className="w-full py-4 bg-[#1a2a4a] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
