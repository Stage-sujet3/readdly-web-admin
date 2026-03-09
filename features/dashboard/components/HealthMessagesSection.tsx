"use client"

import { MessageSquare, Server, Database, Cloud, ShieldCheck, MoreHorizontal, User } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"

const healthMetrics = [
  { name: "Auth Service", status: "Healthy", uptime: "99.9%", icon: ShieldCheck, color: "text-emerald-500" },
  { name: "API Utilisateur", status: "Healthy", uptime: "99.8%", icon: Server, color: "text-emerald-500" },
  { name: "Stockage", status: "Healthy", uptime: "100%", icon: Cloud, color: "text-emerald-500" },
  { name: "Base de données", status: "Healthy", uptime: "99.9%", icon: Database, color: "text-emerald-500" },
]

const messages = [
  { id: 1, user: "Jean Dupont", content: "Problème d'accès à la bibliothèque...", time: "Il y a 2m", read: false },
  { id: 2, user: "Khadija Ben", content: "Merci pour votre aide précieuse !", time: "Il y a 15m", read: true },
  { id: 3, user: "Marc Louis", content: "Question sur l'abonnement annuel.", time: "Il y a 1h", read: true },
]

export function HealthMessagesSection() {
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

        <div className="grid grid-cols-2 gap-6">
          {healthMetrics.map((metric, index) => (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/60 border border-white/80 rounded-[2rem] shadow-sm group/item flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                 <div className="p-2.5 bg-indigo-50/50 rounded-xl group-hover/item:rotate-12 transition-transform">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                 </div>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase">Actif</span>
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
          <Badge variant="primary">Nouveau (1)</Badge>
        </div>

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
      </motion.div>
    </div>
  )
}
