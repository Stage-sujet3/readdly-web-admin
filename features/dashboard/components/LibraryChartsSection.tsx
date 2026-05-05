"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, Globe, GraduationCap, FileText, BookMarked, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { useLibraryStats } from "@/hooks/useLibraryStats"

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "14px",
          padding: "12px 18px",
          color: "#e2e8f0",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 4 }}>
          {payload[0].name}
        </p>
        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: payload[0].fill }}>
          {payload[0].value} livre{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    )
  }
  return null
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonChart = () => (
  <div className="flex flex-col items-center justify-center h-[280px] gap-4">
    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
    <p className="text-sm text-slate-400 font-medium animate-pulse">Chargement des statistiques…</p>
  </div>
)

// ── Stat Badge ───────────────────────────────────────────────────────────────
function StatBadge({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: any
  label: string
  value: number
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex items-center gap-3 p-3 rounded-2xl border"
      style={{
        background: `${color}10`,
        borderColor: `${color}25`,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </motion.div>
  )
}

// ── Categorized Charts (Reusable) ───────────────────────────────────────────
function CategorizedCharts({ 
  title, 
  total, 
  languageData, 
  levelData, 
  icon: Icon, 
  iconColor,
  delay = 0 
}: { 
  title: string
  total: number
  languageData: any[]
  levelData: any[]
  icon: any
  iconColor: string
  delay?: number
}) {
  const categoryId = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="border-t border-slate-100 first:border-t-0">
      <div className="px-8 pt-8 flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ background: `${iconColor}15` }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 flex-1 min-h-0">
        {/* ── Left: Language Donut ── */}
        <div className="p-8 min-h-0 min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
              Répartition par Langue
            </h4>
          </div>

          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + delay }}>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {languageData.map((d, i) => (
                        <radialGradient key={i} id={`grad-lang-${categoryId}-${i}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={d.fill} stopOpacity={1} />
                          <stop offset="100%" stopColor={d.fill} stopOpacity={0.7} />
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {languageData.map((_, i) => (
                        <Cell key={i} fill={`url(#grad-lang-${categoryId}-${i})`} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Centre label */}
              <div className="relative -mt-[138px] mb-[90px] flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{total}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total</span>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2 mt-2">
                {languageData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: item.fill, boxShadow: `0 0 8px ${item.fill}60` }}
                      />
                      <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">{item.value}</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${item.fill}15`, color: item.fill }}
                      >
                        {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right: Level Radial Bar ── */}
        <div className="p-8 min-h-0 min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
              Répartition par Niveau
            </h4>
          </div>

          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + delay }}>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="55%"
                    innerRadius={25}
                    outerRadius={100}
                    barSize={18}
                    data={levelData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      {levelData.map((d, i) => (
                        <linearGradient key={i} id={`grad-level-${categoryId}-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={d.fill} stopOpacity={0.7} />
                          <stop offset="100%" stopColor={d.fill} stopOpacity={1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      background={{ fill: "rgba(0,0,0,0.04)" }}
                    >
                      {levelData.map((_, i) => (
                        <Cell key={i} fill={`url(#grad-level-${categoryId}-${i})`} />
                      ))}
                    </RadialBar>
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2 mt-2">
                {levelData.map((item, i) => {
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: item.fill, boxShadow: `0 0 8px ${item.fill}60` }}
                        />
                        <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.4 + i * 0.1 + delay, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: item.fill }}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-800 w-6 text-right">{item.value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export function LibraryChartsSection() {
  const { libraryStats, loading, error, mutate } = useLibraryStats()
  const [activeTab, setActiveTab] = useState<'stories' | 'texts' | 'words'>('stories')

  // ── Palette de couleurs unifiée (Style Histoire) ──
  const COLORS = {
    french: "#6366F1",    // Indigo
    english: "#3B82F6",   // Blue
    arabic: "#EC4899",    // Pink
    beginner: "#10B981",  // Emerald
    intermediate: "#F59E0B", // Amber
    advanced: "#8B5CF6",  // Purple
  }

  // ── Stories Data ──
  const storyLanguageData = [
    { name: "Français", value: libraryStats?.stories?.byLanguage?.french ?? 0, fill: COLORS.french },
    { name: "Anglais", value: libraryStats?.stories?.byLanguage?.english ?? 0, fill: COLORS.english },
    { name: "Arabe", value: libraryStats?.stories?.byLanguage?.arabic ?? 0, fill: COLORS.arabic },
  ]
  const storyLevelData = [
    { name: "Facile", value: libraryStats?.stories?.byLevel?.beginner ?? 0, fill: COLORS.beginner },
    { name: "Moyen", value: libraryStats?.stories?.byLevel?.intermediate ?? 0, fill: COLORS.intermediate },
    { name: "Difficile", value: libraryStats?.stories?.byLevel?.advanced ?? 0, fill: COLORS.advanced },
  ]

  // ── Texts Data ──
  const textLanguageData = [
    { name: "Français", value: libraryStats?.texts?.byLanguage?.french ?? 0, fill: COLORS.french },
    { name: "Anglais", value: libraryStats?.texts?.byLanguage?.english ?? 0, fill: COLORS.english },
    { name: "Arabe", value: libraryStats?.texts?.byLanguage?.arabic ?? 0, fill: COLORS.arabic },
  ]
  const textLevelData = [
    { name: "Facile", value: libraryStats?.texts?.byLevel?.beginner ?? 0, fill: COLORS.beginner },
    { name: "Moyen", value: libraryStats?.texts?.byLevel?.intermediate ?? 0, fill: COLORS.intermediate },
    { name: "Difficile", value: libraryStats?.texts?.byLevel?.advanced ?? 0, fill: COLORS.advanced },
  ]

  // ── Words Data ──
  const wordLanguageData = [
    { name: "Français", value: libraryStats?.words?.byLanguage?.french ?? 0, fill: COLORS.french },
    { name: "Anglais", value: libraryStats?.words?.byLanguage?.english ?? 0, fill: COLORS.english },
    { name: "Arabe", value: libraryStats?.words?.byLanguage?.arabic ?? 0, fill: COLORS.arabic },
  ]
  const wordLevelData = [
    { name: "Facile", value: libraryStats?.words?.byLevel?.beginner ?? 0, fill: COLORS.beginner },
    { name: "Moyen", value: libraryStats?.words?.byLevel?.intermediate ?? 0, fill: COLORS.intermediate },
    { name: "Difficile", value: libraryStats?.words?.byLevel?.advanced ?? 0, fill: COLORS.advanced },
  ]

  const totalStories = libraryStats?.stories?.total ?? 0
  const totalWords = libraryStats?.words?.total ?? 0
  const totalTexts = libraryStats?.texts?.total ?? 0

  const tabs = [
    { id: 'stories', label: 'Histoires', icon: BookMarked, count: totalStories, color: "#6366F1" },
    { id: 'texts', label: 'Textes', icon: BookOpen, count: totalTexts, color: "#F59E0B" },
    { id: 'words', label: 'Mots', icon: FileText, count: totalWords, color: "#10B981" },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-premium overflow-hidden flex flex-col"
    >
      {/* ── Header with Integrated Segmented Control ── */}
      <div
        className="px-8 py-6 flex flex-col xl:flex-row items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
            }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 leading-tight">Bibliothèque</h3>
            <p className="text-sm text-slate-400 font-medium">Contenu & Distribution</p>
          </div>
        </div>

        {/* ── Segmented Control (Apple Style) ── */}
        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/50 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-5 py-2.5 rounded-xl transition-all duration-500 flex items-center gap-2.5
                ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-indigo-500' : 'text-slate-400'}`} />
              <span className="text-sm font-bold relative z-10">{tab.label}</span>
              <span className={`
                relative z-10 text-[10px] font-black px-2 py-0.5 rounded-lg
                ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-200/50 text-slate-500'}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => mutate()}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 min-h-0">
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Erreur</h3>
            <p className="text-red-600/70 text-sm max-w-md mb-6">{error}</p>
            <button onClick={() => mutate()} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200">Réessayer</button>
          </div>
        ) : loading ? (
          <SkeletonChart />
        ) : totalStories === 0 && totalWords === 0 && totalTexts === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Bibliothèque Vide</h3>
            <p className="text-slate-400 text-sm max-w-sm">Importez du contenu pour voir les statistiques.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'stories' && (
                <CategorizedCharts 
                  title="Statistiques des Histoires" 
                  total={totalStories} 
                  languageData={storyLanguageData} 
                  levelData={storyLevelData}
                  icon={BookMarked}
                  iconColor="#6366F1"
                />
              )}
              
              {activeTab === 'texts' && (
                <CategorizedCharts 
                  title="Statistiques des Textes" 
                  total={totalTexts} 
                  languageData={textLanguageData} 
                  levelData={textLevelData}
                  icon={BookOpen}
                  iconColor="#F59E0B"
                />
              )}

              {activeTab === 'words' && (
                <CategorizedCharts 
                  title="Statistiques du Dictionnaire" 
                  total={totalWords} 
                  languageData={wordLanguageData} 
                  levelData={wordLevelData}
                  icon={FileText}
                  iconColor="#10B981"
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}

