"use client"

import React, { useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  User, 
  Clock, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Info
} from "lucide-react";
import { useAudit, AuditLog } from "@/features/audit/hooks/useAudit";
import { motion, AnimatePresence } from "framer-motion";

export default function AuditPage() {
  const { logs, total, pages, page, setPage, filters, setFilters, isLoading, clearHistory } = useAudit();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getActionIcon = (type: string) => {
    if (type.includes('ADD') || type.includes('CREATE')) return <PlusCircle className="w-4 h-4 text-emerald-500" />;
    if (type.includes('ACCEPT') || type.includes('VERIFY')) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (type.includes('REJECT')) return <XCircle className="w-4 h-4 text-rose-500" />;
    if (type.includes('EDIT') || type.includes('UPDATE')) return <Edit className="w-4 h-4 text-amber-500" />;
    if (type.includes('DELETE')) return <Trash2 className="w-4 h-4 text-rose-500" />;
    return <History className="w-4 h-4 text-indigo-500" />;
  };

  const getActionColor = (type: string) => {
    if (type.includes('ADD') || type.includes('CREATE') || type.includes('ACCEPT') || type.includes('VERIFY')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (type.includes('DELETE') || type.includes('REJECT')) return 'bg-rose-50 text-rose-700 border-rose-100';
    if (type.includes('EDIT') || type.includes('UPDATE')) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen relative">
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-10 bg-slate-200 rounded-xl w-64"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-96"></div>
            </div>
            <div className="h-12 bg-slate-100 rounded-2xl w-48"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-24">
            <div className="md:col-span-2 bg-slate-50 rounded-xl h-full"></div>
            <div className="bg-slate-50 rounded-xl h-full"></div>
            <div className="bg-slate-50 rounded-xl h-full"></div>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 h-[600px] p-8">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl w-full"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {selectedLog && (
              <div className="fixed inset-0 bg-[#1a2a4a]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${getActionColor(selectedLog.actionType)}`}>
                        {getActionIcon(selectedLog.actionType)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1a2a4a]">Détails de l'action</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedLog.actionType}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedLog(null)}
                      className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <XCircle className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description complète</label>
                      <p className="text-slate-700 font-bold text-lg leading-snug">
                        {selectedLog.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cible</label>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Tag className="w-4 h-4 text-indigo-400" />
                          {selectedLog.targetType}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date & Heure</label>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          {new Date(selectedLog.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => setSelectedLog(null)}
                      className="px-8 py-3 bg-[#1a2a4a] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Fermer
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-[#1a2a4a] tracking-tight mb-2">Historique Admin</h1>
              <p className="text-slate-500 font-medium">Suivi complet des actions et modifications du système</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-2xl shadow-sm hover:bg-rose-50 transition-all font-bold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer l'historique
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par description ou admin..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <select 
              value={filters.actionType}
              onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
              className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 outline-none"
            >
              <option value="">Tous les types</option>
              <option value="VERIFY">Validation</option>
              <option value="REJECT">Rejet</option>
              <option value="CREATE">Création</option>
              <option value="UPDATE">Modification</option>
              <option value="DELETE">Suppression</option>
            </select>
            <select 
              value={filters.targetType}
              onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
              className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 outline-none"
            >
              <option value="">Toutes les cibles</option>
              <option value="ORTHOPHONISTE">Orthophonistes</option>
              <option value="STORY">Histoires</option>
              <option value="USER">Utilisateurs</option>
              <option value="TEXT">Textes Éducatifs</option>
              <option value="DICTIONARY">Dictionnaire</option>
            </select>
          </div>
        </>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Logs Table */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Cible</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="wait">
                  {logs?.map((log, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      key={log.id} 
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                            {log.adminId === 'SYSTEM' ? 'SY' : 'AD'}
                          </div>
                          <span className="text-sm font-bold text-[#1a2a4a]">
                            {log.adminId === 'SYSTEM' ? 'Système' : 'Admin'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-black flex items-center w-fit gap-1.5 ${getActionColor(log.actionType)}`}>
                          {getActionIcon(log.actionType)}
                          {log.actionType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          {log.targetType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-400">
                          <div className="text-slate-700">{new Date(log.createdAt).toLocaleDateString()}</div>
                          <div>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400">Affichage de {logs?.length || 0} sur {total || 0} logs</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black px-4">Page {page} / {pages || 1}</span>
              <button 
                onClick={() => setPage(p => Math.min(pages || 1, p + 1))}
                disabled={page === (pages || 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Bonus */}
        <div className="bg-[#1a2a4a] p-8 rounded-[2.5rem] shadow-xl text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold">Flux d'activité</h3>
          </div>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {logs?.slice(0, 5).map((log, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={log.id} 
                className="relative pl-12"
              >
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-[#1a2a4a] z-10 flex items-center justify-center ${getActionColor(log.actionType)}`}>
                  {getActionIcon(log.actionType)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm font-bold">{log.description}</p>
                  <p className="text-xs text-slate-400 italic">Par {log.adminId === 'SYSTEM' ? 'Système' : `Admin (${log.adminId.substring(0, 8)})`}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
