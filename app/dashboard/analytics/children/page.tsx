"use client"
import { useState, useEffect } from "react"

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { Baby, BookOpen, Scan, Image, Clock, TrendingUp, Activity, LibraryBig, Zap, Star, Award, Users } from "lucide-react"
import { motion } from "framer-motion"

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const MOCK_DATA = {
  totalEnfants: 156,
  storiesRead: 428,
  scannedTexts: 89,
  imagesGenerated: 145,
  educationalTexts: 34,
  dictionaryUses: 134,
  totalAppTime: 45600,
  avgSessionTime: 600,
  dailyActivity: [
    { date: new Date(Date.now() - 6 * 86400000).toISOString(), count: 45 },
    { date: new Date(Date.now() - 5 * 86400000).toISOString(), count: 52 },
    { date: new Date(Date.now() - 4 * 86400000).toISOString(), count: 38 },
    { date: new Date(Date.now() - 3 * 86400000).toISOString(), count: 65 },
    { date: new Date(Date.now() - 2 * 86400000).toISOString(), count: 48 },
    { date: new Date(Date.now() - 1 * 86400000).toISOString(), count: 59 },
    { date: new Date().toISOString(), count: 72 },
  ],
  heatmap: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.floor(Math.random() * 50) + (i > 8 && i < 20 ? 30 : 5)
  })),
  distribution: [
    { name: "Histoires", value: 40 },
    { name: "Scans", value: 25 },
    { name: "Dictionnaire", value: 15 },
    { name: "Images", value: 10 },
    { name: "AI Chat", value: 10 },
  ],
  timePerFeature: [
    { feature: "Histoires", totalTime: 12000, avgTime: 280 },
    { feature: "Dictionnaire", totalTime: 8500, avgTime: 65 },
    { feature: "Scans", totalTime: 5400, avgTime: 120 },
    { feature: "AI Interaction", totalTime: 3200, avgTime: 45 },
  ]
};

export default function ChildrenAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const data = MOCK_DATA;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 bg-slate-200 rounded-xl w-64"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-96"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 h-32">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-100 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 h-[450px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                <div className="h-6 bg-slate-200 rounded-lg w-48"></div>
              </div>
              <div className="w-full h-64 bg-slate-50 rounded-[2rem]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dynamic Insights Calculation
  const distribution = data?.distribution || [];
  const sortedDistribution = [...distribution].sort((a, b) => b.value - a.value);
  const topFunction = sortedDistribution[0]?.name || "N/A";
  const totalActivity = (data?.dailyActivity || []).reduce((acc, curr) => acc + (curr?.count || 0), 0);

  const kpis = [
    { label: "Enfants inscrits", value: data.totalEnfants, icon: Baby, color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-500/5" },
    { label: "Histoires lues", value: data.storiesRead, icon: BookOpen, color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Textes scannés", value: data.scannedTexts, icon: Scan, color: "text-amber-500", gradient: "from-amber-500/20 to-amber-500/5" },
    { label: "Dictionnaire", value: data.dictionaryUses || 0, icon: LibraryBig, color: "text-purple-500", gradient: "from-purple-500/20 to-purple-500/5" },
    { label: "Temps total", value: `${Math.round((data.totalAppTime || 0) / 60)} min`, icon: Clock, color: "text-sky-500", gradient: "from-sky-500/20 to-sky-500/5" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#1a2a4a] tracking-tight mb-2">Analytics Enfants</h1>
          <p className="text-slate-500 font-medium">Vue d'ensemble détaillée de l'activité, de l'engagement et des comportements</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${kpi.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black text-[#1a2a4a] mt-1">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2a4a]">Activité Quotidienne (7 derniers jours)</h3>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyActivity || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Interactions" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap (Last 30 Days) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500/20 to-rose-500/5 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2a4a]">Heatmap (Horaire / 30j)</h3>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.heatmap || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  tickFormatter={(h) => `${h}h`} 
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(236, 72, 153, 0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="Activités" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#1a2a4a] mb-8">Répartition des Activités</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {(data.distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {(data.distribution || []).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-slate-600 capitalize">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel / Time Per Feature */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#1a2a4a] mb-8">Temps passé par Fonctionnalité (Secondes)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timePerFeature || []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="totalTime" name="Temps (secondes)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                  {
                    (data.timePerFeature || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-[#1a2a4a] text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group mt-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-black italic tracking-tight">Smart Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 group-hover:bg-white/15 transition-all">
              <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-3">Performance Hebdomadaire</p>
              <p className="text-lg font-bold leading-relaxed">
                L'activité globale est de <span className="text-emerald-400">{totalActivity}</span> événements. 
                La fonction <span className="text-indigo-400 capitalize">{topFunction.toLowerCase()}</span> est le moteur principal avec <span className="text-indigo-300">{sortedDistribution[0]?.value || 0}</span> interactions.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 group-hover:bg-white/15 transition-all">
              <p className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-3">Recommandation Data</p>
              <p className="text-lg font-bold leading-relaxed">
                Le temps moyen par session est de <span className="text-amber-400">{Math.round(data.avgSessionTime / 60)} min</span>. 
                {data.storiesRead > data.scannedTexts 
                  ? "Focus sur les nouvelles histoires interactives." 
                  : "Encouragez l'utilisation de l'OCR pour la lecture physique."}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-pink-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
      </div>
    </div>
  );
}

