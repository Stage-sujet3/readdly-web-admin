import React from "react";
import { Search, Filter, CheckCircle2, Clock, XCircle, UserX, Users } from "lucide-react";
import { motion } from "framer-motion";

interface OrthophonistesFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const statusOptions = [
  { id: 'PENDING', label: 'En attente', icon: Clock, color: 'text-amber-500' },
  { id: 'VERIFIED', label: 'Vérifiés', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 'REJECTED', label: 'Rejetés', icon: XCircle, color: 'text-rose-500' },
  { id: 'all', label: 'Tous', icon: Users, color: 'text-indigo-500' },
];

export function OrthophonistesFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: OrthophonistesFilterProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col lg:flex-row items-center gap-6 p-4 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
        
        {/* Search Bar */}
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou CIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-white/80 border border-slate-100 rounded-[1.5rem] shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-800 font-bold placeholder:text-slate-300"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setStatusFilter(option.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                statusFilter === option.id 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/80'
              }`}
            >
              {statusFilter === option.id && (
                <motion.div 
                  layoutId="activeStatus"
                  className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <option.icon className={`relative z-10 w-3.5 h-3.5 ${statusFilter === option.id ? 'text-white' : option.color}`} />
              <span className="relative z-10">{option.label}</span>
            </button>
          ))}
        </div>

        {statusFilter !== 'PENDING' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setStatusFilter('PENDING')}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            Réinitialiser
          </motion.button>
        )}
      </div>
    </div>
  );
}
