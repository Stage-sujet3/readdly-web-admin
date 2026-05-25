"use client"
import { cloneElement, useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import {
  Baby,
  BookOpen,
  Scan,
  LibraryBig,
  Clock,
  FileText,
  RefreshCcw,
  Image as ImageIcon,
  TrendingUp,
  Activity,
  Lightbulb,
  Target,
  Info,
} from "lucide-react"
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const FEATURE_LABELS: Record<string, string> = {
  STORY: 'Histoires',
  TEXT: 'Textes éducatifs',
  SCAN: 'Scans',
  DICT: 'Dictionnaire',
  IMAGE: 'Images',
  IMPORT: 'Imports',
  AI: 'Assistant IA',
}


function SafeChartContainer({
  children,
  height = 320,
}: {
  children: ReactElement
  height?: number
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = rootRef.current
    if (!element) return

    const update = () => {
      const next = Math.floor(element.getBoundingClientRect().width)
      if (next > 0) setWidth(next)
    }

    update()
    const observer = new ResizeObserver(() => update())
    observer.observe(element)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const canRender = width > 10

  return (
    <div ref={rootRef} className="relative w-full min-w-0 overflow-hidden rounded-2xl" style={{ height, minHeight: 260 }}>
      {canRender ? (
        cloneElement(children, {
          width,
          height,
        } as any)
      ) : (
        <div className="h-full w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
          Chargement du graphique...
        </div>
      )}
    </div>
  )
}

export default function ChildrenAnalyticsPage() {
  const { data: realData, loading, error, refresh } = useAnalytics()

  const data = realData as any;

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-72" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-white border border-red-100 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-900">Analytics indisponibles</h2>
          <p className="text-slate-500 mt-2">{error || "Aucune donnée analytics réelle reçue."}</p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2"
            onClick={refresh}
          >
            <RefreshCcw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const totalInteractions = (data.dailyActivity || []).reduce((sum: number, item: any) => sum + (item.count || 0), 0)
  const avgMinutesPerSession = Math.max(0, Math.round((data.avgSessionTime || 0) / 60))
  const totalHours = ((data.totalAppTime || 0) / 3600).toFixed(1)
  const topFeature = (data.timePerFeature || []).slice().sort((a: any, b: any) => b.totalTime - a.totalTime)[0]
  const peakHour = (data.heatmap || []).slice().sort((a: any, b: any) => b.count - a.count)[0]

  const minuteTrend = (data.dailyActivity || []).map((p: any) => ({
    date: p.date,
    minutes: Math.round((p.duration || 0) / 60),
  }))

  const CORE_FEATURES = ['STORY', 'TEXT', 'SCAN', 'DICT']
  const featureTimes = CORE_FEATURES.map((featKey) => {
    const item = (data.timePerFeature || []).find((it: any) => it.feature === featKey)
    return {
      feature: FEATURE_LABELS[featKey] || featKey,
      totalTime: item ? Math.round((item.totalTime || 0) / 60) : 0,
      avgTime: item ? Math.round((item.avgTime || 0) / 60) : 0,
    }
  })

  const sortedActivity = [...(data.dailyActivity || [])].sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
  const peakActivity = sortedActivity[0] || null
  const lowestActivity = sortedActivity.length > 1 ? sortedActivity[sortedActivity.length - 1] : null

  const sortedDuration = [...(data.dailyActivity || [])].sort((a: any, b: any) => (b.duration || 0) - (a.duration || 0))
  const peakDuration = sortedDuration[0] || null
  const lowestDuration = sortedDuration.length > 1 ? sortedDuration[sortedDuration.length - 1] : null

  const sortedFeatures = [...featureTimes].sort((a: any, b: any) => b.totalTime - a.totalTime)
  const topFeatureItem = sortedFeatures[0] || null
  const bottomFeatureItem = sortedFeatures.length > 1 ? sortedFeatures[sortedFeatures.length - 1] : null

  const smartInsights = [
    {
      icon: TrendingUp,
      title: "Analyse de l'Activité",
      text: peakActivity
        ? `Le pic d'activité a été atteint le ${peakActivity.date} avec ${peakActivity.count} actions. ${lowestActivity ? `Le niveau le plus bas a été enregistré le ${lowestActivity.date} avec ${lowestActivity.count} actions.` : "Pas d'autre jour enregistré."}`
        : "Aucune donnée d'activité disponible pour analyser le pic ou le point bas.",
    },
    {
      icon: Clock,
      title: "Analyse du Temps Passé",
      text: peakDuration
        ? `Le temps d'utilisation maximal a été de ${Math.round(peakDuration.duration / 60)} minutes le ${peakDuration.date}. ${lowestDuration ? `Le minimum d'utilisation a été de ${Math.round(lowestDuration.duration / 60)} minutes le ${lowestDuration.date}.` : "Pas d'autre jour enregistré."}`
        : "Aucune donnée de durée de session disponible.",
    },
    {
      icon: Target,
      title: "Performance Fonctionnalités",
      text: topFeatureItem
        ? `La fonctionnalité la plus populaire est "${topFeatureItem.feature}" (${topFeatureItem.totalTime} min). La moins performante (à améliorer en priorité) est "${bottomFeatureItem?.feature || 'Aucune'}" (${bottomFeatureItem?.totalTime || 0} min).`
        : "Aucune donnée d'utilisation des fonctionnalités disponible.",
    },
  ]

  const kpis = [
    { label: "Enfants inscrits", value: data.totalEnfants, icon: Baby },
    { label: "Histoires lues", value: data.storiesRead, icon: BookOpen },
    { label: "Textes éducatifs lus", value: data.educationalTexts, icon: FileText },
    { label: "Textes scannés", value: data.scannedTexts, icon: Scan },
    { label: "Dictionnaire", value: data.dictionaryUses || 0, icon: LibraryBig },
    { label: "Temps total", value: `${totalHours} h`, icon: Clock },
  ]

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#1a2a4a] tracking-tight">
            Analytics Enfants
          </h1>
          <p className="text-slate-500 font-medium">
            Données réelles synchronisées avec le backend
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-slate-700"
          onClick={refresh}
        >
          <RefreshCcw size={16} />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-[#1a2a4a]">{kpi.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-2">{kpi.label}</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <kpi.icon size={20} className="text-slate-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a2a4a] mb-6">Activité quotidienne</h3>
            {(data.dailyActivity || []).length > 0 ? (
              <SafeChartContainer height={320}>
                <AreaChart data={data.dailyActivity || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Actions" 
                    stroke="#f59e0b" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </SafeChartContainer>
            ) : (
              <div className="h-[320px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
                Aucune activité disponible
              </div>
            )}
          </div>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 items-start">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a2a4a] uppercase tracking-wider">Comprendre ce graphique</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ce graphique retrace le nombre total d&apos;interactions (clics, lectures, scans) réalisées par jour par l&apos;ensemble des enfants. Il permet de mesurer le niveau d&apos;engagement global et d&apos;identifier les jours de forte affluence.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a2a4a] mb-6">Temps quotidien (minutes)</h3>
            {(data.dailyActivity || []).length > 0 ? (
              <SafeChartContainer height={320}>
                <BarChart data={(data.dailyActivity || []).map((item: any) => ({
                  day: item.date,
                  minutes: Math.round((item.duration || 0) / 60)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" name="Minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </SafeChartContainer>
            ) : (
              <div className="h-[320px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
                Aucun temps de connexion disponible
              </div>
            )}
          </div>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 items-start">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a2a4a] uppercase tracking-wider">Comprendre ce graphique</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Indique le temps total cumulé, converti en minutes, passé sur l&apos;application chaque jour. Ce suivi aide à comprendre les habitudes de connexion et la fidélité des jeunes utilisateurs au fil du temps.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full">
        <h3 className="text-lg font-bold text-[#1a2a4a] mb-6">Usage par fonctionnalité (temps)</h3>
        {featureTimes.length > 0 ? (
          <SafeChartContainer height={340}>
            <BarChart data={featureTimes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
              <Tooltip />
              <Bar 
                dataKey="totalTime" 
                name="Temps (min)" 
                fill="#6366f1" 
                radius={[0, 8, 8, 0]} 
                label={{ position: 'right', fill: '#6366f1', fontSize: 10, fontWeight: 'bold', formatter: (v: any) => `${v} min` }}
              />
            </BarChart>
          </SafeChartContainer>
        ) : (
          <div className="h-[340px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
            Aucune donnée de fonctionnalité disponible
          </div>
        )}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 items-start">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 mt-0.5 shrink-0">
            <Info size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1a2a4a] uppercase tracking-wider">Comprendre ce graphique</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ce graphique compare la durée totale en minutes passée sur chaque fonctionnalité principale (Histoires, Textes, Dictionnaire, Scans, etc.). Il permet d&apos;identifier instantanément les fonctionnalités les plus attractives et celles nécessitant des améliorations ergonomiques.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a2a4a] mb-6">Répartition journalière de l'activité</h3>
            {(data.dailyActivity || []).length > 0 ? (
              <SafeChartContainer height={320}>
                <BarChart data={(data.dailyActivity || []).map((item: any) => ({
                  day: item.date,
                  count: item.count || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Activités" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </SafeChartContainer>
            ) : (
              <div className="h-[320px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
                Aucune répartition d&apos;activité disponible
              </div>
            )}
          </div>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 items-start">
            <div className="p-2 bg-violet-50 rounded-xl text-violet-600 mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a2a4a] uppercase tracking-wider">Comprendre ce graphique</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Illustre la répartition et le volume d&apos;actions de l&apos;utilisateur au quotidien. Il aide à détecter des modèles d&apos;activité cyclique ou des baisses d&apos;utilisation anormales.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF7F0] border border-[#EBE2D3] text-slate-900 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-[#EBE2D3] pb-4">
              <Activity size={22} className="text-amber-800" />
              <h3 className="text-xl font-bold text-slate-900">Système intelligent</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-[#E5DAC6] rounded-2xl p-5 shadow-xs">
                <p className="text-amber-800 text-xs font-bold uppercase tracking-widest">Pic d&apos;utilisation horaire</p>
                <p className="text-lg font-black text-slate-900 mt-1">
                  {peakHour ? `${peakHour.hour}h (${peakHour.count} actions)` : "Aucune donnée"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Représente l&apos;heure de la journée où la charge d&apos;activité est la plus dense.
                </p>
              </div>
              {smartInsights.map((insight, index) => (
                <div key={index} className="bg-white border border-[#E5DAC6] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <insight.icon size={18} className="text-amber-800" />
                    <p className="font-bold text-slate-900">{insight.title}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
