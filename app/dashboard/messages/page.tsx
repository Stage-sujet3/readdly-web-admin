"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare, AlertTriangle, Clock,
  User, ChevronLeft, ChevronRight,
  Send, X, Eye, Filter, Inbox, AlertCircle, ArrowRight,
  Image as ImageIcon, Layers, Zap, Search,
  Star, TrendingUp, Award, Users, BarChart2,
  Settings
} from "lucide-react"
import { messagesService } from "@/services/messages.service"

type MessageType = "PROBLEM" | "FEEDBACK"
type MessageStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED"

interface Message {
  id: string
  senderType: string
  senderEmail: string
  senderName: string
  type: MessageType
  subject: string
  description: string
  status: MessageStatus
  priority: string
  adminReply?: string
  repliedAt?: string
  createdAt: string
  problemDetails?: {
    category: string
    feature: string
    steps: string[]
    deviceInfo?: Record<string, any>
  }
  feedbackDetails?: {
    likedFeatures: string[]
    suggestions?: string
    futureNeeds?: string
  }
  attachments?: { id: string; fileUrl: string; fileType: string; fileName?: string }[]
}

interface RatingsSummary {
  globalAverage: number
  totalVotes: number
  topFeature: string
  byFeature: Record<string, { average: number; count: number; distribution: Record<number, number> }>
  distribution: Record<number, number>
}

const TYPE_CONFIG: Record<MessageType, { label: string; color: string; icon: any; bg: string; border: string; accent: string }> = {
  PROBLEM: { 
    label: "Problème", 
    color: "text-orange-700", 
    icon: AlertTriangle, 
    bg: "bg-orange-50", 
    border: "border-orange-100",
    accent: "bg-orange-500"
  },
  FEEDBACK: { 
    label: "Feedback", 
    color: "text-indigo-700", 
    icon: MessageSquare, 
    bg: "bg-indigo-50", 
    border: "border-indigo-100",
    accent: "bg-indigo-500"
  },
}

const STATUS_CONFIG: Record<MessageStatus, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "text-slate-700 bg-white border-slate-200", dot: "bg-slate-400" },
  IN_PROGRESS: { label: "En cours", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  RESOLVED: { label: "Résolu", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  HIGH: { label: "Haute", color: "text-slate-700", icon: Zap, bg: "bg-slate-100" },
  MEDIUM: { label: "Moyenne", color: "text-slate-600", icon: Clock, bg: "bg-slate-100" },
  LOW: { label: "Faible", color: "text-slate-500", icon: Filter, bg: "bg-slate-100" },
}

const FEATURE_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  STORY: { label: "Histoires", icon: Inbox, color: "text-indigo-600", bg: "bg-indigo-50" },
  TEXT: { label: "Textes Éducatifs", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
  DICT: { label: "Dictionnaire", icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
  SCAN: { label: "Scan de Texte", icon: Search, color: "text-emerald-600", bg: "bg-emerald-50" },
  FILE_IMPORT: { label: "Import de Fichier", icon: ArrowRight, color: "text-slate-600", bg: "bg-slate-100" },
  AI_ASSISTANT: { label: "Assistant Intelligent", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
  IMAGE_GEN: { label: "Génération d'Images", icon: ImageIcon, color: "text-pink-600", bg: "bg-pink-50" },
  AUDIO: { label: "Audio & Prononciation", icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-50" },
  CHILD_UI: { label: "Interface Enfant", icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  PARENT_DASHBOARD: { label: "Dashboard Parent", icon: BarChart2, color: "text-indigo-600", bg: "bg-indigo-50" },
  PROFILE: { label: "Profil & Compte", icon: User, color: "text-slate-600", bg: "bg-slate-100" },
  AUTH: { label: "Authentification", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  NOTIFICATIONS: { label: "Notifications & Emails", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
  ANALYTICS: { label: "Analytics & Statistiques", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  GENERAL: { label: "Général", icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
  DESIGN: { label: "Design", icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
}


const CATEGORY_LABELS: Record<string, string> = {
  BUG_TECHNIQUE: "Bug technique",
  PERFORMANCE: "Problème de performance",
  INTERFACE_DESIGN: "Interface / Design",
  RESEAU_SYNC: "Réseau / Synchronisation",
  EXPERIENCE_ENFANT: "Expérience enfant",
  OTHER: "Autre",
}

const EMPTY_RATINGS_SUMMARY: RatingsSummary = {
  globalAverage: 0,
  totalVotes: 0,
  topFeature: "",
  byFeature: {},
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

const TYPE_MAP: Record<number, MessageType> = { 0: "PROBLEM", 1: "FEEDBACK" }
const STATUS_MAP: Record<number, MessageStatus> = { 0: "OPEN", 1: "IN_PROGRESS", 2: "RESOLVED" }
const PRIORITY_MAP: Record<number, string> = { 0: "LOW", 1: "MEDIUM", 2: "HIGH" }
const SENDER_TYPE_MAP: Record<number, string> = { 0: "PARENT", 1: "ORTHOPHONISTE" }
const PROBLEM_CATEGORY_MAP: Record<number, string> = {
  0: "BUG_TECHNIQUE", 1: "PERFORMANCE", 2: "INTERFACE_DESIGN",
  3: "RESEAU_SYNC", 4: "EXPERIENCE_ENFANT", 5: "OTHER",
}
const PROBLEM_FEATURE_MAP: Record<number, string> = {
  0: "STORY", 1: "TEXT", 2: "DICT", 3: "SCAN",
  4: "FILE_IMPORT", 5: "AI_ASSISTANT", 6: "IMAGE_GEN",
  7: "AUDIO", 8: "CHILD_UI", 9: "PARENT_DASHBOARD",
  10: "PROFILE", 11: "AUTH", 12: "NOTIFICATIONS",
  13: "ANALYTICS", 14: "GENERAL",
}
const parseDeviceInfo = (value: any) => {
  if (!value) return undefined
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

const normalizeMessage = (raw: any): Message | null => {
  if (!raw) return null
  const type = typeof raw.type === "number" ? TYPE_MAP[raw.type] : raw.type
  const status = typeof raw.status === "number" ? STATUS_MAP[raw.status] : raw.status
  const priority = typeof raw.priority === "number" ? PRIORITY_MAP[raw.priority] : raw.priority
  const senderType = typeof raw.senderType === "number" ? SENDER_TYPE_MAP[raw.senderType] : raw.senderType

  if (!type || !status) return null

  // Ensure attachments is always an array of { id, fileUrl, fileType, fileName }
  const rawAttachments = Array.isArray(raw.attachments) ? raw.attachments : []
  const attachments = rawAttachments.map((att: any, idx: number) => ({
    id: att.id || String(idx),
    fileUrl: att.fileUrl || att.url || "",
    fileType: att.fileType || "IMAGE",
    fileName: att.fileName || `Attachement ${idx + 1}`
  })).filter((att: any) => att.fileUrl)

  return {
    id: String(raw.id),
    senderType: senderType || "PARENT",
    senderEmail: String(raw.senderEmail || ""),
    senderName: String(raw.senderName || "Utilisateur"),
    type,
    subject: String(raw.subject || "Sans objet"),
    description: String(raw.description || ""),
    status,
    priority: String(priority || "MEDIUM"),
    adminReply: raw.adminReply || undefined,
    repliedAt: raw.repliedAt || undefined,
    createdAt: raw.createdAt || new Date().toISOString(),
    problemDetails: raw.problemDetails
      ? {
          category:
            typeof raw.problemDetails.category === "number"
              ? PROBLEM_CATEGORY_MAP[raw.problemDetails.category]
              : raw.problemDetails.category,
          feature:
            typeof raw.problemDetails.feature === "number"
              ? PROBLEM_FEATURE_MAP[raw.problemDetails.feature]
              : raw.problemDetails.feature,
          steps: Array.isArray(raw.problemDetails.steps) ? raw.problemDetails.steps : [],
          deviceInfo: parseDeviceInfo(raw.problemDetails.deviceInfo),
        }
      : undefined,
    feedbackDetails: raw.feedbackDetails
      ? {
          likedFeatures: Array.isArray(raw.feedbackDetails.likedFeatures)
            ? raw.feedbackDetails.likedFeatures
            : [],
          suggestions: raw.feedbackDetails.suggestions || undefined,
          futureNeeds: raw.feedbackDetails.futureNeeds || undefined,
        }
      : undefined,
    attachments,
  }
}

const normalizeRatingsSummary = (raw: any): RatingsSummary => {
  if (!raw) return EMPTY_RATINGS_SUMMARY

  // The gateway now provides normalized data
  return {
    globalAverage: Number(raw.globalAverage || 0),
    totalVotes: Number(raw.totalVotes || 0),
    topFeature: String(raw.topFeature || ""),
    byFeature: raw.byFeature || {},
    distribution: raw.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  }
}

export default function FeedbackUnifiedPage() {
  const [activeView, setActiveView] = useState<"MESSAGES" | "RATINGS">("MESSAGES")
  
  // Messages State
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selected, setSelected] = useState<Message | null>(null)
  const [msgTab, setMsgTab] = useState<"ALL" | "PROBLEM" | "FEEDBACK">("ALL")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [replySuccess, setReplySuccess] = useState("")
  const [search, setSearch] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Ratings State
  const [ratingsSummary, setRatingsSummary] = useState<RatingsSummary | null>(null)
  const [isLoadingRatings, setIsLoadingRatings] = useState(true)

  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true)
    try {
      const [msgRes, statsRes] = await Promise.all([
        messagesService.getMessages({ type: msgTab === "ALL" ? undefined : msgTab, page, limit: 12 }),
        messagesService.getMessageStats(),
      ])

      const rawMessages = msgRes.data?.success ? (msgRes.data?.data?.messages || []) : []
      const normalizedMessages = rawMessages
        .map((m: any) => normalizeMessage(m))
        .filter((m: Message | null): m is Message => Boolean(m))

      const fetchedStats = statsRes.data?.success ? statsRes.data.data : null
      const apiTotal = Number(msgRes.data?.data?.total ?? normalizedMessages.length)
      const apiLimit = Number(msgRes.data?.data?.limit ?? 12)
      const apiPages = Number(
        msgRes.data?.data?.pages ??
          (apiTotal > 0 ? Math.ceil(apiTotal / Math.max(apiLimit, 1)) : 1),
      )

      setMessages(normalizedMessages)
      setTotal(apiTotal)
      setPages(Math.max(apiPages, 1))
      setStats(fetchedStats)
    } catch (err) { 
      console.error(err)
      setMessages([])
      setTotal(0)
      setPages(1)
      setStats(null)
    }
    finally { setIsLoadingMessages(false) }
  }, [msgTab, page])

  const fetchRatings = useCallback(async () => {
    setIsLoadingRatings(true)
    try {
      const res = await messagesService.getRatingsSummary()
      if (res.data?.success) {
        setRatingsSummary(normalizeRatingsSummary(res.data.data))
      } else setRatingsSummary(EMPTY_RATINGS_SUMMARY)
    } catch (err) { 
      console.error(err)
      setRatingsSummary(EMPTY_RATINGS_SUMMARY)
    }
    finally { setIsLoadingRatings(false) }
  }, [])

  useEffect(() => {
    if (activeView === "MESSAGES") fetchMessages()
    else fetchRatings()
  }, [activeView, fetchMessages, fetchRatings])

  useEffect(() => { setPage(1) }, [msgTab])

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return
    setIsSending(true)
    try {
      await messagesService.replyToMessage(selected.id, replyText)
      setReplySuccess("Réponse envoyée avec succès. L'email a été envoyé.")
      setReplyText("")
      setTimeout(() => {
        setReplySuccess("")
        setSelected(null)
        fetchMessages()
      }, 2000)
    } catch (err) { console.error(err) }
    finally { setIsSending(false) }
  }

  const filteredMessages = messages.filter(m =>
    !search || m.senderName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#1a2a4a] tracking-tight">Centre de Feedback</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez les retours utilisateurs et analysez la satisfaction</p>
        </div>
        
        {/* Main View Switcher */}
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm gap-1 self-start">
          <button 
            onClick={() => setActiveView("MESSAGES")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeView === "MESSAGES" ? "bg-[#1a2a4a] text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages & Problèmes
          </button>
          <button 
            onClick={() => setActiveView("RATINGS")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeView === "RATINGS" ? "bg-[#1a2a4a] text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Star className="w-4 h-4" />
            Ratings & Analytics
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "MESSAGES" ? (
          <motion.div 
            key="messages-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total messages", value: stats.total, icon: Inbox },
                  { label: "Ouverts", value: stats.open, icon: AlertCircle },
                  { label: "Problèmes", value: stats.problems, icon: AlertTriangle },
                  { label: "Feedbacks", value: stats.feedbacks, icon: MessageSquare },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className={`w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4`}>
                      <s.icon className={`w-5 h-5 text-slate-600`} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{s.value}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm gap-1">
                {(["ALL", "PROBLEM", "FEEDBACK"] as const).map((t) => (
                  <button key={t} onClick={() => setMsgTab(t)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${msgTab === t ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-700"}`}>
                    {t === "ALL" ? "Tous" : t === "PROBLEM" ? "Problèmes" : "Feedbacks"}
                  </button>
                ))}
              </div>

              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Rechercher par nom ou sujet…"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              {isLoadingMessages ? (
                <div className="p-8 space-y-4 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-5 px-6 py-5 border-b border-slate-50 last:border-0">
                      <div className="w-11 h-11 bg-slate-100 rounded-2xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                      <div className="h-6 bg-slate-100 rounded-full w-20" />
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-16 text-center">
                  <Inbox className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Aucun message trouvé</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-slate-50">
                    {filteredMessages.map((msg, i) => {
                      const TypeIcon = TYPE_CONFIG[msg.type].icon
                      return (
                        <motion.div key={msg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-5 px-6 py-5 hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-100"
                          onClick={() => { setSelected(msg); setReplyText("") }}>
                          <div className={`w-11 h-11 flex-shrink-0 ${TYPE_CONFIG[msg.type].bg} border ${TYPE_CONFIG[msg.type].border} rounded-xl flex items-center justify-center`}>
                            <TypeIcon className={`w-5 h-5 ${TYPE_CONFIG[msg.type].color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-black text-[#1a2a4a] truncate">{msg.subject}</p>
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black flex-shrink-0 ${PRIORITY_CONFIG[msg.priority]?.color}`}>
                                {PRIORITY_CONFIG[msg.priority]?.label}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 truncate">{msg.senderName} · {msg.senderEmail}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${STATUS_CONFIG[msg.status].color}`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[msg.status].dot} mr-1`} />
                              {STATUS_CONFIG[msg.status].label}
                            </span>
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="p-5 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400">{total} messages au total</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:border-indigo-300 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black px-3">Page {page} / {pages}</span>
                      <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
                        className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:border-indigo-300 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="ratings-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoadingRatings ? (
              <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 h-32"></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-100 h-96"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* KPI Cards for Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Moyenne Globale", value: ratingsSummary?.globalAverage.toFixed(1) || "0.0", sub: "sur 5 étoiles", icon: Star },
                    { label: "Total Évaluations", value: ratingsSummary?.totalVotes || 0, sub: "votes reçus", icon: Users },
                    { label: "Top Feature", value: ratingsSummary?.topFeature ? (FEATURE_CONFIG[ratingsSummary.topFeature]?.label || ratingsSummary.topFeature) : "—", sub: "Meilleur score", icon: Award },
                  ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center">
                        <kpi.icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
                        <p className="text-2xl font-bold text-slate-800 mb-0.5">{kpi.value}</p>
                        <p className="text-xs text-slate-400">{kpi.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Feature Ratings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <h2 className="text-xl font-black text-[#1a2a4a] mb-6 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  Satisfaction par Fonctionnalité
                </h2>
                <div className="space-y-6">
                  {ratingsSummary?.byFeature && Object.entries(ratingsSummary.byFeature).map(([feature, data], i) => {
                    const cfg = FEATURE_CONFIG[feature] || { label: feature, color: "text-slate-600", bg: "bg-slate-100", icon: Settings }
                    return (
                      <div key={feature}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 ${cfg.bg} rounded-lg flex items-center justify-center`}>
                              <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{cfg.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 mr-2">{data.count} votes</span>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-800">{(data.average || 0).toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((data.average || 0) / 5) * 100}%` }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <h2 className="text-xl font-black text-[#1a2a4a] mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Insights & Distribution
                </h2>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingsSummary?.distribution[star] || 0
                    const pct = ratingsSummary ? (count / ratingsSummary.totalVotes) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-sm font-bold text-slate-600">{star}</span>
                          <Star className="w-3 h-3 text-slate-300 fill-slate-300" />
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 w-8">{Math.round(pct)}%</span>
                      </div>
                    )
                  })}
                  
                  {/* Auto Insights */}
                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-500" />
                      </div> 
                      Analyse IA
                    </h3>
                    <div className="space-y-3">
                      {ratingsSummary && ratingsSummary.globalAverage >= 4 ? (
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                          La satisfaction globale est excellente. Les parents apprécient particulièrement {ratingsSummary.topFeature ? <span className="text-indigo-600 font-bold">{FEATURE_CONFIG[ratingsSummary.topFeature]?.label || ratingsSummary.topFeature}</span> : "l'application"}.
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                          Des opportunités d'amélioration existent pour certaines fonctionnalités. Continuez à recueillir des avis pour cibler les priorités.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Detail Drawer (same as before but simplified/premium icons) */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSelected(null); setReplyText("") }}
              className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col">
              
              <div className={`p-8 border-b ${TYPE_CONFIG[selected.type].border} ${TYPE_CONFIG[selected.type].bg}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white border ${TYPE_CONFIG[selected.type].border} rounded-xl flex items-center justify-center shadow-sm`}>
                      {React.createElement(TYPE_CONFIG[selected.type].icon, { className: `w-6 h-6 ${TYPE_CONFIG[selected.type].color}` })}
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${TYPE_CONFIG[selected.type].color} mb-1 opacity-80`}>
                        {TYPE_CONFIG[selected.type].label} • {selected.senderType}
                      </p>
                      <h2 className="text-xl font-bold text-slate-800 leading-tight">{selected.subject}</h2>
                    </div>
                  </div>
                  <button onClick={() => { setSelected(null); setReplyText("") }}
                    className="p-2 hover:bg-white/60 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${STATUS_CONFIG[selected.status].color}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status].dot} mr-1.5`} />
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${PRIORITY_CONFIG[selected.priority]?.color} flex items-center gap-1.5`}>
                    {React.createElement(PRIORITY_CONFIG[selected.priority]?.icon, { className: "w-3 h-3" })}
                    {PRIORITY_CONFIG[selected.priority]?.label}
                  </span>
                  <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {selected.senderName}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                    </div> 
                    Contenu du message
                  </h3>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                    {selected.description}
                  </p>
                </section>

                {selected.type === "PROBLEM" && selected.problemDetails && (
                  <section className="bg-orange-50/50 rounded-[2rem] p-8 border border-orange-100">
                    <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </div>
                      Diagnostic Technique
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Catégorie</p>
                        <p className="text-sm font-semibold text-slate-700">{CATEGORY_LABELS[selected.problemDetails.category] || selected.problemDetails.category}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fonctionnalité</p>
                        <p className="text-sm font-semibold text-slate-700">{FEATURE_CONFIG[selected.problemDetails.feature]?.label || selected.problemDetails.feature}</p>
                      </div>
                    </div>
                    {selected.problemDetails.steps?.length > 0 && (
                      <div className="mb-6">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Étapes pour reproduire</p>
                        <div className="space-y-3">
                          {selected.problemDetails.steps.map((step, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-6 h-6 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center text-xs font-bold border border-indigo-100">
                                {i + 1}
                              </div>
                              <p className="text-sm text-slate-700 pt-0.5">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selected.problemDetails.deviceInfo && (
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Informations Appareil</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selected.problemDetails.deviceInfo).map(([key, val]) => (
                            <div key={key} className="bg-white/50 p-2 rounded border border-slate-100">
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{key}</p>
                              <p className="text-[10px] font-medium text-slate-600 truncate">{String(val)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {selected.type === "FEEDBACK" && selected.feedbackDetails && (
                  <section className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                      </div>
                      Analyse du Feedback
                    </h3>
                    <div className="space-y-6">
                      {selected.feedbackDetails.likedFeatures?.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Ce qu'ils aiment</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.feedbackDetails.likedFeatures.map(f => (
                              <span key={f} className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-bold text-indigo-600">
                                {FEATURE_CONFIG[f]?.label || f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.feedbackDetails.suggestions && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Suggestions de fonctionnalités</p>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed">{selected.feedbackDetails.suggestions}</p>
                        </div>
                      )}
                      {selected.feedbackDetails.futureNeeds && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Besoins futurs exprimés</p>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">{selected.feedbackDetails.futureNeeds}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {selected.attachments && selected.attachments.length > 0 && (
                   <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      Pièces Jointes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selected.attachments.map(att => (
                        <div key={att.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
                           <img 
                            src={att.fileUrl} 
                            alt={att.fileName}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Indisponible';
                            }}
                           />
                           <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(att.fileUrl);
                            }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer"
                           >
                             <Eye className="w-8 h-8 text-white" />
                             <span className="text-[10px] font-bold text-white bg-black/40 px-2 py-1 rounded-full">Agrandir</span>
                           </div>
                        </div>
                      ))}
                    </div>
                   </section>
                )}

                {selected.adminReply && (
                  <section className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-2">Réponse Envoyée</p>
                    <p className="text-sm font-medium text-slate-700">{selected.adminReply}</p>
                  </section>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                {replySuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold text-sm text-center">
                    {replySuccess}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Votre réponse ici..."
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 outline-none resize-none shadow-sm"
                      rows={4}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || isSending}
                      className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Envoyer la réponse
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Image Preview Lightbox */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-12"
            onClick={() => setPreviewImage(null)}
          >
            <button 
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewImage}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
