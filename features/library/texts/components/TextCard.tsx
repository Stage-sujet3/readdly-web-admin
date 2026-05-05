import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Globe, Archive, FileText, BookOpen } from 'lucide-react';
import { ContentStatus } from '../../types';

interface TextCardProps {
  id: string;
  title: string;
  coverImage?: string;
  status: ContentStatus;
  level: string;
  theme: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function TextCard({ id, title, status, level, theme, onClick, onEdit, onDelete, onToggleStatus }: TextCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01, x: 10 }}
      className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center gap-6 overflow-hidden"
      onClick={onClick}
    >
      {/* Visual Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon Area */}
      <div className="w-16 h-16 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300 shadow-sm">
        <FileText className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">
            {theme}
          </span>
          <div className="flex gap-1">
             {[1, 2, 3].map(i => (
               <div key={i} className={`w-1 h-3 rounded-full ${
                 (level === 'Facile' && i === 1) || (level === 'Moyen' && i <= 2) || (level === 'Difficile') ? 'bg-amber-400' : 'bg-slate-100'
               }`} />
             ))}
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-800 leading-tight truncate group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-8 px-4 border-l border-slate-50">
        <div className="flex flex-col items-center gap-1">
          <div 
            onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
            className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${status === 'actif' ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <motion.div 
              animate={{ x: status === 'actif' ? 20 : 0 }}
              className="w-3 h-3 bg-white rounded-full shadow-sm"
            />
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{status}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
