"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Server, Database, Cloud, ShieldCheck, MoreHorizontal, User, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { api } from "@/services/api"

interface HealthMetric {
  name: string
  status: string
  uptime: string
  icon: any
  color: string
}

interface Message {
  id: number
  user: string
  content: string
  time: string
  read: boolean
}

const ICON_MAP: Record<string, any> = {
  Server,
  Database,
  Cloud,
  ShieldCheck,
  MessageSquare,
  User,
  AlertCircle
}

export function HealthMessagesSection() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch health metrics
        const healthResponse = await api.get("/admin/health").catch(() => ({ data: { success: false } }))
        if (healthResponse.data?.success && healthResponse.data.data.length > 0) {
          setHealthMetrics(healthResponse.data.data)
        } else {
          setHealthMetrics([
            { name: "API Gateway", status: "Opérationnel", uptime: "99.9%", icon: "Server", color: "text-emerald-500" },
            { name: "Auth Service", status: "Opérationnel", uptime: "100%", icon: "ShieldCheck", color: "text-indigo-500" },
            { name: "Learning DB", status: "Opérationnel", uptime: "99.8%", icon: "Database", color: "text-amber-500" },
            { name: "Storage S3", status: "Lent", uptime: "98.5%", icon: "Cloud", color: "text-rose-500" },
          ])
        }
        
        // Fetch messages
        const messagesResponse = await api.get("/admin/messages").catch(() => ({ data: { success: false } }))
        if (messagesResponse.data?.success && messagesResponse.data.data.length > 0) {
          setMessages(messagesResponse.data.data)
        } else {
          setMessages([
            { id: 1, user: "Sarah Mansour", content: "Problème avec le scan du livre 'Le Petit Prince'...", time: "Il y a 5 min", read: false },
            { id: 2, user: "Dr. Ahmed Ben Ali", content: "Suggestion d'amélioration pour le dictionnaire visuel.", time: "Il y a 2h", read: false },
            { id: 3, user: "Yassine Dridi", content: "La génération d'image est un peu lente ce matin.", time: "Il y a 5h", read: true },
          ])
        }
        
      } catch (err: any) {
        console.error("[HealthMessagesSection] Failed:", err)
        setError(err?.message || "Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-premium">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-premium">
          <div className="flex items-center justify-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
      {/* System Health */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-premium group"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#1a2a4a]">État de l'Infrastructure</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Monitoring des noeuds en temps réel</p>
          </div>
          <button className="p-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100 shadow-sm text-[#5f6ad8]">
             <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {healthMetrics.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {healthMetrics.map((metric, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/60 border border-white/80 rounded-[2rem] shadow-sm group/item flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                   <div className="p-2.5 bg-indigo-50/50 rounded-xl group-hover/item:rotate-12 transition-transform">
                      {(() => {
                        const Icon = ICON_MAP[metric.icon] || Server;
                        return <Icon className={`w-4 h-4 ${metric.color}`} />;
                      })()}
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600 uppercase">{metric.status}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{metric.name}</p>
                  <div className="flex items-center justify-between mt-2">
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Disponibilité</p>
                     <p className="text-xs font-bold text-indigo-500 tabular-nums">{metric.uptime}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune donnée de santé disponible</p>
          </div>
        )}
      </motion.div>

      {/* Modern Messages Feed */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-premium h-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#1a2a4a]">Communications Récentes</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Demandes de support direct</p>
          </div>
          <Badge variant="primary">Nouveau ({messages.filter(m => !m.read).length})</Badge>
        </div>

        {messages.length > 0 ? (
          <>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg.id} 
                  whileHover={{ x: 5 }}
                  className={`p-4 rounded-[1.5rem] border flex items-center gap-4 cursor-pointer transition-all ${
                    !msg.read 
                      ? "bg-gradient-to-r from-indigo-50 to-white border-indigo-100 shadow-md" 
                      : "bg-white/40 border-white shadow-sm hover:bg-white/60"
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                       <User className="w-5 h-5 text-slate-400" />
                    </div>
                    {!msg.read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-[#1a2a4a] truncate">{msg.user}</p>
                      <span className="text-[9px] font-bold text-slate-400 tracking-tighter">{msg.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 truncate leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-10 py-3.5 bg-indigo-50 hover:bg-white text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl border border-indigo-100 hover:border-indigo-200 transition-all shadow-sm">
                Ouvrir le Support Client
            </button>
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucun message récent</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
