"use client"

import React, { useState, useEffect, useMemo } from "react";
import { 
  Shield, 
  Server, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Terminal,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useMonitoring } from "@/features/monitoring/hooks/useMonitoring";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

const ServiceCard = ({ service, idx }: { service: any, idx: number }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'WARNING': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'DOWN': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/30 rounded-full -mr-20 -mt-20 group-hover:bg-indigo-100/50 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-md group-hover:text-indigo-600 rounded-2xl flex items-center justify-center transition-all">
            <Server className="w-6 h-6" />
          </div>
          <div className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusStyle(service.status)}`}>
            {service.status}
          </div>
        </div>

        <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight truncate">{service.serviceName}</h4>
        
        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full ${service.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
          Dernière vérif: {service.lastCheck ? new Date(service.lastCheck).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">Réponse</span>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {service.status === 'HEALTHY' && service.responseTime === 0 ? (
                <span className="text-xs text-indigo-400 animate-pulse uppercase">Sync...</span>
              ) : (
                <>{service.responseTime}<span className="text-xs ml-0.5 text-slate-400">ms</span></>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">Disponibilité</span>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {service.uptime === 0 ? (
                <span className="text-xs text-indigo-400 animate-pulse uppercase">Calcul...</span>
              ) : (
                <>{service.uptime?.toFixed(1)}%</>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Charge CPU</span>
              <span className={service.cpuUsage > 80 ? 'text-rose-500' : 'text-indigo-600'}>{service.cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, service.cpuUsage)}%` }}
                className={`h-full rounded-full ${service.cpuUsage > 80 ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-indigo-500" /> Mémoire</span>
              <span className={service.memoryUsage > 80 ? 'text-rose-500' : 'text-indigo-600'}>{service.memoryUsage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, service.memoryUsage)}%` }}
                className={`h-full rounded-full ${service.memoryUsage > 80 ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MonitoringPage() {
  const { services, healthScore, insights, usage, alerts, isLoading, error, refresh } = useMonitoring();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // Real-time Performance Distribution calculation based on current service latencies
  const performanceData = useMemo(() => {
    if (!services || services.length === 0) return [];
    
    const fast = services.filter(s => s.responseTime < 50).length;
    const normal = services.filter(s => s.responseTime >= 50 && s.responseTime < 200).length;
    const slow = services.filter(s => s.responseTime >= 200).length;
    
    return [
      { name: 'Ultra Rapide (<50ms)', value: fast },
      { name: 'Normal (50-200ms)', value: normal },
      { name: 'Latent (>200ms)', value: slow },
    ].filter(d => d.value > 0);
  }, [services]);

  if (isLoading && !services.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Initialisation de l'Observabilité...</p>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'WARNING': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'DOWN': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const scoreColor = healthScore > 90 ? 'text-emerald-600' : healthScore > 70 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-6 lg:p-10 space-y-10 selection:bg-indigo-100">
      
      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3 text-amber-700 text-sm font-medium">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
          {error} — Affichage du dernier état connu.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Observabilité Système
            <span className="text-xs font-bold px-2 py-0.5 bg-indigo-600 text-white rounded-md uppercase tracking-tighter">Entreprise</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Intelligence de santé et performance en temps réel.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-1 md:flex-none">
            <div className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">Score de Santé</span>
              <span className={`text-xl font-black ${scoreColor}`}>{healthScore}%</span>
            </div>
            <button 
              onClick={refresh}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section: Insights & Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Insights */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Analyses du Système</h3>
            </div>
          </div>
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${insight.priority === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`} />
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                <p className="font-bold text-slate-900 text-center text-sm uppercase tracking-widest">Tous les systèmes sont opérationnels</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Distribution (Real Data) */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight text-sm uppercase tracking-widest">Dist. Performance</h3>
          </div>
          {isMounted && performanceData.length > 0 ? (
            <>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-6">
                {performanceData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600">{item.value} service{item.value > 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] opacity-30 text-center">
              <TrendingUp className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-xs font-bold uppercase tracking-tighter">Calcul des métriques...</p>
            </div>
          )}
        </div>
      </div>

      {/* Infrastructure Health - Divided by Status */}
      <div className="space-y-12">
        {/* Healthy Services */}
        {services.filter(s => s.status === 'HEALTHY').length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Systèmes Opérationnels
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {services.filter(s => s.status === 'HEALTHY').length} Actifs
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {services.filter(s => s.status === 'HEALTHY').map((service, idx) => (
                  <ServiceCard key={service.id || service.serviceName} service={service} idx={idx} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Down Services */}
        {services.filter(s => s.status !== 'HEALTHY').length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-black text-rose-600 tracking-tight uppercase flex items-center gap-2">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                Services Interrompus
              </h2>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                {services.filter(s => s.status !== 'HEALTHY').length} Hors Ligne
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {services.filter(s => s.status !== 'HEALTHY').map((service, idx) => (
                  <ServiceCard key={service.id || service.serviceName} service={service} idx={idx} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Performance Chart & Alert Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Analyses de Performance</h3>
          </div>
          {isMounted && services.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={services} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="serviceName" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}ms`, 'Latence']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPerf)" 
                    animationDuration={1500}
                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] opacity-30">
              <BarChart3 className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>

        {/* Alert Console */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest">Console d'Alertes</h3>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="border-b border-white/5 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      alert.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400' : 
                      alert.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {alert.level}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[10px] font-bold text-indigo-400 ml-auto uppercase tracking-tighter">{(alert.service || '').replace(' Service', '')}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-20 h-full">
                <Shield className="w-12 h-12 text-white mb-4" />
                <p className="text-white font-bold text-sm uppercase tracking-widest">Système Sécurisé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
