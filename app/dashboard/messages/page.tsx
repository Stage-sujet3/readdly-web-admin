"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare, AlertTriangle, ThumbsUp, Clock, CheckCircle2,
  User, Mail, Tag, Calendar, ChevronLeft, ChevronRight,
  Send, X, Eye, Filter, Inbox, AlertCircle, ArrowRight,
  Image as ImageIcon, ListOrdered, Layers, Zap, Search,
  Star, TrendingUp, Award, Users, BarChart2, Heart, Lightbulb, Rocket,
  Settings, Monitor, Layout
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

const TYPE_CONFIG: Record<MessageType, { label: string; color: string; icon: any; gradient: string; bg: string; border: string }> = {
  PROBLEM: { label: "Problème", color: "text-rose-500", icon: AlertTriangle, gradient: "from-rose-500/20 to-rose-500/5", bg: "bg-rose-50", border: "border-rose-100" },
  FEEDBACK: { label: "Feedback", color: "text-indigo-500", icon: MessageSquare, gradient: "from-indigo-500/20 to-indigo-500/5", bg: "bg-indigo-50", border: "border-indigo-100" },
}

const STATUS_CONFIG: Record<MessageStatus, { label: string; color: string; dot: string }> = {
  OPEN: { label: "Ouvert", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  IN_PROGRESS: { label: "En cours", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "bg-blue-400" },
  RESOLVED: { label: "Résolu", color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: any; gradient: string }> = {
  HIGH: { label: "Haute", color: "text-rose-600", icon: Zap, gradient: "from-rose-500/20 to-rose-500/5" },
  MEDIUM: { label: "Moyenne", color: "text-amber-600", icon: Clock, gradient: "from-amber-500/20 to-amber-500/5" },
  LOW: { label: "Faible", color: "text-slate-600", icon: Filter, gradient: "from-slate-500/20 to-slate-500/5" },
}

const FEATURE_CONFIG: Record<string, { label: string; icon: any; color: string; gradient: string; bg: string }> = {
  STORY: { label: "Histoires", icon: Inbox, color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-500/5", bg: "bg-indigo-50" },
  TEXT: { label: "Textes Éducatifs", icon: MessageSquare, color: "text-blue-500", gradient: "from-blue-500/20 to-blue-500/5", bg: "bg-blue-50" },
  DICT: { label: "Dictionnaire", icon: BookMarkedIcon, color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5", bg: "bg-emerald-50" },
  IMAGE: { label: "Génération Image", icon: ImageIcon, color: "text-rose-500", gradient: "from-rose-500/20 to-rose-500/5", bg: "bg-rose-50" },
  AI: { label: "Intelligence Artificielle", icon: BrainIcon, color: "text-amber-500", gradient: "from-amber-500/20 to-amber-500/5", bg: "bg-amber-50" },
  DESIGN: { label: "Design Enfant", icon: PaletteIcon, color: "text-pink-500", gradient: "from-pink-500/20 to-pink-500/5", bg: "bg-pink-50" },
}

function BookMarkedIcon(props: any) { return <Layers {...props} /> }
function BrainIcon(props: any) { return <Zap {...props} /> }
function PaletteIcon(props: any) { return <Layout {...props} /> }

const CATEGORY_LABELS: Record<string, string> = {
  BUG: "Bug technique", PERFORMANCE: "Performance", UI: "Interface", AI: "Intelligence Artificielle", OTHER: "Autre",
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_MESSAGES: Message[] = [
  {
    id: "m-1",
    senderType: "PARENT",
    senderName: "Sarah Mansour",
    senderEmail: "sarah.m@gmail.com",
    type: "PROBLEM",
    subject: "Erreur lors du scan de l'histoire",
    description: "Je n'arrive pas à scanner le livre 'Le Petit Prince'. L'application affiche une erreur 'OCR Failed' après 10 secondes de chargement. J'ai essayé avec plusieurs éclairages différents mais le problème persiste.",
    status: "OPEN",
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    problemDetails: {
      category: "BUG",
      feature: "SCAN",
      steps: ["Ouvrir KidsSpace", "Cliquer sur Scanner", "Prendre la photo", "Attendre le traitement"],
      deviceInfo: { model: "iPhone 13", os: "iOS 16.5" }
    },
    attachments: [
      { id: "att-1", fileUrl: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800", fileType: "IMAGE" }
    ]
  },
  {
    id: "m-2",
    senderType: "ORTHOPHONISTE",
    senderName: "Dr. Ahmed Ben Ali",
    senderEmail: "ahmed.ortho@clinique.tn",
    type: "FEEDBACK",
    subject: "Suggestion pour le dictionnaire",
    description: "L'outil est excellent pour mes patients. J'aimerais pouvoir ajouter mes propres mots personnalisés dans un dictionnaire privé pour chaque enfant. Cela permettrait de travailler sur des besoins spécifiques.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    feedbackDetails: {
      likedFeatures: ["Dictionnaire visuel", "Prononciation AI"],
      suggestions: "Ajouter une section 'Favoris' pour les mots difficiles.",
      futureNeeds: "Partage de rapports avec les parents via l'app."
    }
  },
  {
    id: "m-3",
    senderType: "PARENT",
    senderName: "Yassine Dridi",
    senderEmail: "yassine.d@outlook.com",
    type: "PROBLEM",
    subject: "Lenteur de la génération d'image",
    description: "La génération d'images pour les histoires personnalisées prend parfois plus de 30 secondes, ce qui décourage mon fils de 6 ans.",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    adminReply: "Bonjour Yassine, nous avons optimisé nos serveurs GPU. La génération devrait maintenant prendre moins de 10 secondes.",
    repliedAt: new Date(Date.now() - 86400000).toISOString(),
    problemDetails: {
      category: "PERFORMANCE",
      feature: "IMAGE",
      steps: ["Créer une histoire", "Cliquer sur 'Générer visuels'"],
      deviceInfo: { model: "Samsung S22", os: "Android 13" }
    }
  },
  {
    id: "m-4",
    senderType: "PARENT",
    senderName: "Leila Ferjani",
    senderEmail: "leila.f@yahoo.fr",
    type: "FEEDBACK",
    subject: "Félicitations pour le design",
    description: "Mon enfant adore l'interface KidsSpace ! Les couleurs et les animations sont parfaites. C'est le premier outil qui lui donne vraiment envie de lire.",
    status: "OPEN",
    priority: "LOW",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    feedbackDetails: {
      likedFeatures: ["Design Enfant", "Gamification", "Histoires Magiques"],
      suggestions: "Plus de thèmes de couleurs pour personnaliser l'espace."
    }
  }
]

const MOCK_STATS = {
  total: 42,
  open: 12,
  problems: 25,
  feedbacks: 17
}

const MOCK_RATINGS_SUMMARY: RatingsSummary = {
  globalAverage: 4.6,
  totalVotes: 128,
  topFeature: "STORY",
  byFeature: {
    STORY: { average: 4.8, count: 45, distribution: { 5: 35, 4: 8, 3: 2, 2: 0, 1: 0 } },
    AI: { average: 4.5, count: 32, distribution: { 5: 20, 4: 8, 3: 3, 2: 1, 1: 0 } },
    DICT: { average: 4.2, count: 28, distribution: { 5: 12, 4: 10, 3: 4, 2: 2, 1: 0 } },
    IMAGE: { average: 4.7, count: 23, distribution: { 5: 18, 4: 4, 3: 1, 2: 0, 1: 0 } }
  },
  distribution: { 5: 85, 4: 25, 3: 10, 2: 5, 1: 3 }
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
      
      let fetchedMessages = msgRes.data?.success ? msgRes.data.data.messages : []
      let fetchedStats = statsRes.data?.success ? statsRes.data.data : null

      // Fallback to MOCK data if empty (for demonstration)
      if (fetchedMessages.length === 0 && page === 1) {
        fetchedMessages = MOCK_MESSAGES.filter(m => msgTab === "ALL" || m.type === msgTab)
      }
      if (!fetchedStats || fetchedStats.total === 0) {
        fetchedStats = MOCK_STATS
      }

      setMessages(fetchedMessages || [])
      setTotal(msgRes.data?.data?.total || fetchedMessages.length)
      setPages(msgRes.data?.data?.pages || 1)
      setStats(fetchedStats)
      
    } catch (err) { 
      console.error(err)
      // Fallback on error
      setMessages(MOCK_MESSAGES.filter(m => msgTab === "ALL" || m.type === msgTab))
      setStats(MOCK_STATS)
    }
    finally { setIsLoadingMessages(false) }
  }, [msgTab, page])

  const fetchRatings = useCallback(async () => {
    setIsLoadingRatings(true)
    try {
      const res = await messagesService.getRatingsSummary()
      if (res.data?.success && res.data.data.totalVotes > 0) {
        setRatingsSummary(res.data.data)
      } else {
        setRatingsSummary(MOCK_RATINGS_SUMMARY)
      }
    } catch (err) { 
      console.error(err)
      setRatingsSummary(MOCK_RATINGS_SUMMARY)
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
                  { label: "Total messages", value: stats.total, icon: Inbox, color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-500/5" },
                  { label: "Ouverts", value: stats.open, icon: AlertCircle, color: "text-amber-500", gradient: "from-amber-500/20 to-amber-500/5" },
                  { label: "Problèmes", value: stats.problems, icon: AlertTriangle, color: "text-rose-500", gradient: "from-rose-500/20 to-rose-500/5" },
                  { label: "Feedbacks", value: stats.feedbacks, icon: MessageSquare, color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <p className="text-3xl font-black text-[#1a2a4a]">{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
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
                          className="flex items-center gap-5 px-6 py-5 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          onClick={() => { setSelected(msg); setReplyText("") }}>
                          <div className={`w-11 h-11 flex-shrink-0 bg-gradient-to-br ${TYPE_CONFIG[msg.type].gradient} ${TYPE_CONFIG[msg.type].border} border rounded-2xl flex items-center justify-center`}>
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
                    { label: "Moyenne Globale", value: ratingsSummary?.globalAverage.toFixed(1) || "0.0", sub: "sur 5 étoiles", icon: Star, color: "text-amber-500", gradient: "from-amber-500/20 to-amber-500/5" },
                    { label: "Total Évaluations", value: ratingsSummary?.totalVotes || 0, sub: "votes reçus", icon: Users, color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-500/5" },
                    { label: "Top Feature", value: ratingsSummary?.topFeature ? (FEATURE_CONFIG[ratingsSummary.topFeature]?.label || ratingsSummary.topFeature) : "—", sub: "Meilleur score", icon: Award, color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
                  ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-lg transition-all">
                      <div className={`w-14 h-14 flex-shrink-0 bg-gradient-to-br ${kpi.gradient} rounded-2xl flex items-center justify-center shadow-sm`}>
                        <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
                        <p className="text-3xl font-black text-[#1a2a4a] mb-1">{kpi.value}</p>
                        <p className="text-xs text-slate-400 font-medium">{kpi.sub}</p>
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
                    const cfg = FEATURE_CONFIG[feature] || { label: feature, gradient: "from-slate-400 to-slate-500", color: "text-slate-600", bg: "bg-slate-50", icon: Layout }
                    return (
                      <div key={feature}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 bg-gradient-to-br ${cfg.gradient} rounded-xl flex items-center justify-center`}>
                              <cfg.icon className={`w-4.5 h-4.5 ${cfg.color}`} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{cfg.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-black text-[#1a2a4a]">{data.average.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.average / 5) * 100}%` }}
                            className={`h-full bg-gradient-to-r ${cfg.gradient}`}
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
                          La satisfaction globale est excellente. Les parents apprécient particulièrement les <span className="text-indigo-600 font-bold">Histoires</span>.
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                          Des opportunités d'amélioration existent pour les fonctionnalités AI et Dictionnaire.
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
              
              <div className={`p-8 border-b border-slate-100 ${TYPE_CONFIG[selected.type].bg}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${TYPE_CONFIG[selected.type].gradient} ${TYPE_CONFIG[selected.type].border} border-2 rounded-2xl flex items-center justify-center shadow-sm`}>
                      {React.createElement(TYPE_CONFIG[selected.type].icon, { className: `w-6 h-6 ${TYPE_CONFIG[selected.type].color}` })}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {TYPE_CONFIG[selected.type].label} • {selected.senderType}
                      </p>
                      <h2 className="text-xl font-black text-[#1a2a4a] leading-tight">{selected.subject}</h2>
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
                    Message
                  </h3>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                    {selected.description}
                  </p>
                </section>

                {selected.type === "PROBLEM" && selected.problemDetails && (
                  <section className="bg-rose-50/50 rounded-[2rem] p-8 border border-rose-100">
                    <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500/20 to-rose-500/5 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      </div> 
                      Diagnostic Technique
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Catégorie</p>
                        <p className="text-sm font-bold text-slate-800">{CATEGORY_LABELS[selected.problemDetails.category]}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Feature</p>
                        <p className="text-sm font-bold text-slate-800">{selected.problemDetails.feature}</p>
                      </div>
                    </div>
                    {selected.problemDetails.steps?.length > 0 && (
                      <div className="space-y-3">
                        {selected.problemDetails.steps.map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-6 h-6 flex-shrink-0 bg-rose-500 text-white rounded-lg flex items-center justify-center text-[10px] font-black">
                              {i + 1}
                            </div>
                            <p className="text-sm font-medium text-slate-600">{step}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {selected.type === "FEEDBACK" && selected.feedbackDetails && (
                  <section className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100">
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-indigo-500" />
                      </div> 
                      Retours Utilisateur
                    </h3>
                    <div className="space-y-6">
                      {selected.feedbackDetails.likedFeatures?.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Fonctionnalités Aimées</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.feedbackDetails.likedFeatures.map(f => (
                              <span key={f} className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.feedbackDetails.suggestions && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Suggestions</p>
                          <p className="text-sm font-medium text-slate-600">{selected.feedbackDetails.suggestions}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {selected.attachments && selected.attachments.length > 0 && (
                   <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-500/20 to-slate-500/5 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                      </div> 
                      Pièces Jointes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selected.attachments.map(att => (
                        <a key={att.id} href={att.fileUrl} target="_blank" className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200">
                           <img src={att.fileUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Eye className="w-6 h-6 text-white" />
                           </div>
                        </a>
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
                      placeholder="Votre réponse ici... (envoyée par email)"
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
                      rows={4}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || isSending}
                      className="w-full py-4 bg-[#1a2a4a] text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
    </div>
  )
}
